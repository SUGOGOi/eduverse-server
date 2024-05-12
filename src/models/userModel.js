import mongoose, { Schema } from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "please enter your name"],
    },
    phno: {
      type: String,
      required: [true, "please enter your mobile number"],
      unique: [true, "mobile number already exist"],
      select: false,
    },
    email: {
      type: String,
      required: [true, "please enter your email"],
      unique: [true, "email already exist"],
      validate: validator.isEmail,
    },
    role: {
      type: String,
      enum: ["admin", "student", "teacher"],
      default: "student",
    },
    classes: [
      //for teacher
      {
        type: String,
      },
    ],
    class: {
      //for student
      type: String,
    },
    password: {
      type: String,
      requird: [true, "please enter your password"],
      select: false,
    },
    school: {
      type: String,
      requird: [true, "please enter your school"],
    },
    paymentPhoto: {
      type: String,
    },
    avatar: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("user", userSchema);
