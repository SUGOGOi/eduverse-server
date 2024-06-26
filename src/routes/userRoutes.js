import express from "express";
import { isAdminOrTeacher, isLogin } from "../middlewares/auth.js";
import {
  addClassTeacher,
  approveUser,
  getAllUsers,
  getMyProfile,
  getSpecificUsers,
} from "../controllers/userControllers.js";

const app = express.Router();

app.get("/myprofile", isLogin, getMyProfile);
app.get("/all-users", isAdminOrTeacher, getAllUsers);
app.put("/approve", isAdminOrTeacher, approveUser);
app.put("/addclass", isAdminOrTeacher, addClassTeacher);
app.get("/:uid", isAdminOrTeacher, getSpecificUsers);

export default app;
