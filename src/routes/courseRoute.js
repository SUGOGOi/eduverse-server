import express from "express";
import {
  createCourse,
  getAllCourses,
} from "../controllers/courseControllers.js";
import { isAdmin } from "../middlewares/auth.js";
import singleUpload from "../middlewares/multer.js";
const app = express.Router();

app.get("/all-courses", getAllCourses);
app.post("/create-course", isAdmin, singleUpload, createCourse);

export default app;
