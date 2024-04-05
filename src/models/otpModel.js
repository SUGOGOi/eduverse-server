import mongoose, { mongo } from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "please enter email"],
    },
    otpSend: {
      type: String,
      required: [true, "please provide an otp"],
    },
    otpExpire: {
      type: String,
      required: [true, "please provide expire time"],
    },
  },
  { timestamps: true }
);

export const OtpModel = mongoose.model("otp", otpSchema);
