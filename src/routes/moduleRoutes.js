import express from "express";
import { isAdmin } from "../middlewares/auth.js";
import { addVideos, createModule } from "../controllers/moduleController.js";

const app = express.Router();

app.post("/create-module", isAdmin, createModule);
app.post("/add-video", isAdmin, addVideos);

export default app;
