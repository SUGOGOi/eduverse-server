import express from "express";
import { isAdmin, isLogin } from "../middlewares/auth.js";
import {
  approveUser,
  getAllUsers,
  getMyProfile,
} from "../controllers/userControllers.js";

const app = express.Router();

app.get("/myprofile", isLogin, getMyProfile);
app.get("/all-users", isAdmin, getAllUsers);
app.put("/approve", isAdmin, approveUser);

export default app;
