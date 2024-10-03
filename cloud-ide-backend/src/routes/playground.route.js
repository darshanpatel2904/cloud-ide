import { Router } from "express";
import {
  getPlayground,
  createPlayground,
  getFiles,
  getFileContent,
  getPlaygrounds,
  updatePlayground,
  deletePlayground,
} from "../controllers/playground.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router
  .route("/")
  .get(verifyJWT, getPlaygrounds)
  .post(verifyJWT, createPlayground);

router
  .route("/:playgroundId")
  .get(verifyJWT, getPlayground)
  .put(verifyJWT, updatePlayground)
  .delete(verifyJWT, deletePlayground);

router.route("/files/:playgroundId").get(verifyJWT, getFiles);

router.route("/files/content").post(verifyJWT, getFileContent);

export default router;
