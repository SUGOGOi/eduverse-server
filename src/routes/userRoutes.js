import express from "express";
import { isLogin } from "../middlewares/auth.js";
import { getMyProfile } from "../controllers/userControllers.js";

const app = express.Router();

app.get("/myprofile", isLogin, getMyProfile);

export default app;
