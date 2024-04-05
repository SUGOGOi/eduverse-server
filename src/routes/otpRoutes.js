import express from "express";
import { sendOtpEmail, verifyOtpEmail } from "../controllers/otpControllers.js";

const app = express.Router();

app.post("/send-otp", sendOtpEmail);
app.post("/resend-otp", sendOtpEmail);
app.post("/verify-otp", verifyOtpEmail);

export default app;
