import express from "express";
import {
  createCourse,
  getAllCourses,
  getCourseById,
} from "../controllers/courseControllers.js";
import { isAdmin, isLogin } from "../middlewares/auth.js";
import singleUpload from "../middlewares/multer.js";
const app = express.Router();

app.get("/all-courses", isLogin, getAllCourses);
app.post("/create-course", isAdmin, singleUpload, createCourse);
app.get("/:id", isLogin, getCourseById);

export default app;
