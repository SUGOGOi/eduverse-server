import express from "express";
import {
  changePassword,
  forgetPassword,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/authControllers.js";
import { singleUpload } from "../middlewares/multer.js";

const app = express.Router();

app.post("/register", singleUpload, registerUser);
app.post("/login", loginUser);
app.post("/forget-password", forgetPassword);
app.post("/change-password", changePassword);
app.get("/logout", logoutUser);

export default app;
