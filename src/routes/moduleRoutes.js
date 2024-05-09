import express from "express";
import { isAdminOrTeacher } from "../middlewares/auth.js";
import {
  addVideos,
  createModule,
  deleteModule,
  deleteVideo,
  getAllVideos,
} from "../controllers/moduleController.js";

const app = express.Router();

app.get("/all-videos", getAllVideos);

app.post("/create-module", isAdminOrTeacher, createModule);
app.post("/add-video", isAdminOrTeacher, addVideos);

app.delete("/delete-video", isAdminOrTeacher, deleteVideo);
app.delete("/delete-module", isAdminOrTeacher, deleteModule);

export default app;
