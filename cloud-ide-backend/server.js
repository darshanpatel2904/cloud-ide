import express from "express";
import { Server } from "socket.io";
import { WebSocketServer } from "ws";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import playgrounds from "./src/routes/playground.route.js";
import users from "./src/routes/user.route.js";
import connectDB from "./src/db.js";
import DockerService from "./src/services/docker.services.js";
import fs from "fs/promises";

const app = express();

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.use(cors({ origin: true, credentials: true }));

dotenv.config();

const io = new Server(4001, {
  cors: true,
});
const wsForShell = new WebSocketServer({
  port: 4000,
});

wsForShell.on("connection", async (ws, req) => {
  console.log("shell connected");
  const containerId = new URLSearchParams(req.url.split("?")[1]).get(
    "containerId"
  );
  const dockerService = new DockerService();
  await dockerService.excecuteCommand(containerId, ws);
});

const emailToSocketIdMap = new Map();
const socketidToEmailMap = new Map();

io.on("connection", (socket) => {
  socket.emit("file:refresh");

  socket.on("file:change", async ({ room, path, content }) => {
    await fs.writeFile(path, content);
    io.to(room).emit("file:changed", { path, content });
    console.log("file:changed", { room, path, content });
  });

  socket.on("file:selected", ({ room, path }) => {
    io.to(room).emit("file:selected", { path });
  });

  socket.on("room:join", (data) => {
    const { email, room } = data;
    emailToSocketIdMap.set(email, socket.id);
    socketidToEmailMap.set(socket.id, email);
    io.to(room).emit("user:joined", { email, id: socket.id });
    socket.join(room);
    io.to(socket.id).emit("room:join", data);
  });

  socket.on("user:call", ({ to, offer }) => {
    io.to(to).emit("incomming:call", { from: socket.id, offer });
  });

  socket.on("call:accepted", ({ to, ans }) => {
    io.to(to).emit("call:accepted", { from: socket.id, ans });
  });

  socket.on("peer:nego:needed", ({ to, offer }) => {
    console.log("peer:nego:needed", offer);
    io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
  });

  socket.on("peer:nego:done", ({ to, ans }) => {
    console.log("peer:nego:done", ans);
    io.to(to).emit("peer:nego:final", { from: socket.id, ans });
  });
});

app.get("/ping", (req, res) => {
  return res.send("PONG");
});

app.use("/playground", playgrounds);
app.use("/user", users);

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 3000, () => {
      console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
  });
