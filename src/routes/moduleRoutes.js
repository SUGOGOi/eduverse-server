import express from "express";
import { isAdminOrTeacher } from "../middlewares/auth.js";
import {
  addPdf,
  addVideos,
  createModule,
  deleteModule,
  deleteVideo,
  getAllMaterials,
} from "../controllers/moduleController.js";
import { singleUpload } from "../middlewares/multer.js";

const app = express.Router();

app.get("/all-materials", getAllMaterials);

app.post("/create-module", isAdminOrTeacher, createModule);
app.post("/add-video", isAdminOrTeacher, addVideos);
app.post("/add-pdf", isAdminOrTeacher, singleUpload, addPdf);

app.delete("/delete-video", isAdminOrTeacher, deleteVideo);
app.delete("/delete-module", isAdminOrTeacher, deleteModule);

export default app;
