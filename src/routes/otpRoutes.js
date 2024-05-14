import express from "express";
import {
  allContactMessage,
  contactUs,
  sendOtpEmail,
  verifyOtpEmail,
} from "../controllers/otpControllers.js";

const app = express.Router();

app.post("/send-otp", sendOtpEmail);
app.post("/resend-otp", sendOtpEmail);
app.post("/verify-otp", verifyOtpEmail);

//=================Contact Routes=======================//
app.post("/conact-us", contactUs);
app.get("/all-conacts", allContactMessage);

export default app;
