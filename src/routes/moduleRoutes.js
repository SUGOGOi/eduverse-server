import express from "express";
import { isAdmin } from "../middlewares/auth.js";
import {
  addVideos,
  createModule,
  deleteVideo,
} from "../controllers/moduleController.js";

const app = express.Router();

app.post("/create-module", isAdmin, createModule);
app.post("/add-video", isAdmin, addVideos);

app.delete("/:id", isAdmin, deleteVideo);

export default app;
