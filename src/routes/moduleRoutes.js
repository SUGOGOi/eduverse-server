import express from "express";
import { isAdmin } from "../middlewares/auth.js";
import {
  addVideos,
  createModule,
  deleteModule,
  deleteVideo,
  getAllVideos,
} from "../controllers/moduleController.js";

const app = express.Router();

app.get("/all-videos", getAllVideos);

app.post("/create-module", isAdmin, createModule);
app.post("/add-video", isAdmin, addVideos);

app.delete("/delete-video", isAdmin, deleteVideo);
app.delete("/delete-module", isAdmin, deleteModule);

export default app;
