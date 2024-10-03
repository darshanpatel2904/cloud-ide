import Playground from "../models/playground.model.js";
import DockerService from "../services/docker.services.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import path from "path";
import fs from "fs/promises";
import { exec } from "child_process";

const getPlayground = asyncHandler(async (req, res) => {
  const { playgroundId } = req.params;
  const playground = await Playground.findById(playgroundId);

  if (!playground) {
    return res
      .status(404)
      .json(new ApiResponse(404, "Playground not found", "Error"));
  }
  return res.status(200).json(new ApiResponse(200, playground, "Success"));
});

const getPlaygrounds = asyncHandler(async (req, res) => {
  const playgrounds = await Playground.find({
    userId: req.user._id,
  });
  return res.status(200).json(new ApiResponse(200, playgrounds, "Success"));
});

const createPlayground = asyncHandler(async (req, res) => {
  const { projectName, projectType, description } = req.body;
  const createdCollaboration = await Playground.create({
    projectName,
    projectType,
    description,
  });

  fs.mkdir(
    path.resolve(
      "/Users/darshan/Desktop/project/cloud-ide/playgrounds",
      `${createdCollaboration._id}`
    ),
    { recursive: true }
  );

  exec(
    "npm create vite@latest . -- --template react",
    {
      cwd: path.resolve(
        "/Users/darshan/Desktop/project/cloud-ide/playgrounds",
        `${createdCollaboration._id}`
      ),
    },
    (error) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
    }
  );
  const dockerService = new DockerService();
  const containerId = await dockerService.createContainer(
    createdCollaboration._id
  );

  await Playground.updateOne(
    { _id: createdCollaboration._id },
    { $set: { containerId: containerId } }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, createdCollaboration, "Success"));
});

const getAllFiles = async (folderPath) => {
  const filesTree = [];
  try {
    const files = await fs.readdir(folderPath);
    for (const file of files) {
      const filePath = path.join(folderPath, file);
      const stats = await fs.stat(filePath);

      if (stats.isDirectory()) {
        filesTree.push({
          name: file,
          type: "folder",
          path: filePath,
          children: await getAllFiles(filePath),
        });
      } else {
        filesTree.push({
          name: file,
          type: "file",
          path: filePath,
        });
      }
    }
    return filesTree;
  } catch (error) {
    console.error("Error while reading files:", error);
    throw new Error(error);
  }
};

const getFiles = asyncHandler(async (req, res) => {
  const { playgroundId } = req.params;
  const folderPath = path.resolve(
    "/Users/darshan/Desktop/project/cloud-ide/playgrounds",
    playgroundId
  );

  try {
    const filesTree = await getAllFiles(folderPath);
    return res.status(200).json(new ApiResponse(200, filesTree, "Success"));
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, "Error", error.message));
  }
});

const getFileContent = asyncHandler(async (req, res) => {
  const { filePath } = req.body;
  const fileContent = await fs.readFile(filePath, "utf8");
  return res.status(200).json(new ApiResponse(200, fileContent, "Success"));
});

const updatePlayground = asyncHandler(async (req, res) => {
  const { playgroundId } = req.params;
  const { projectName, description } = req.body;
  const playground = await Playground.findById(playgroundId);
  if (!playground) {
    return res
      .status(404)
      .json(new ApiResponse(404, "Playground not found", "Error"));
  }
  await Playground.updateOne(
    { _id: playgroundId },
    { $set: { projectName, description } }
  );
  return res
    .status(200)
    .json(new ApiResponse(200, "Playground updated successfully", "Success"));
});

const deletePlayground = asyncHandler(async (req, res) => {
  const { playgroundId } = req.params;
  const playground = await Playground.findById(playgroundId);
  if (!playground) {
    return res
      .status(404)
      .json(new ApiResponse(404, "Playground not found", "Error"));
  }
  const dockerService = new DockerService();
  await dockerService.removeContainer(playground.containerId);
  await playground.remove();
  return res
    .status(200)
    .json(new ApiResponse(200, "Playground deleted successfully", "Success"));
});

export {
  getPlayground,
  createPlayground,
  getFiles,
  getFileContent,
  getPlaygrounds,
  deletePlayground,
  updatePlayground,
};
