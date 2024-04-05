import mongoose, { Schema } from "mongoose";
import validator from "validator";
import jwt from "jsonwebtoken";

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
    },
    email: {
      type: String,
      required: [true, "please enter your email"],
      unique: [true, "email already exist"],
      validate: validator.isEmail,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    password: {
      type: String,
      requird: [true, "please enter your password"],
    },
    school: {
      type: String,
      requird: [true, "please enter your school"],
    },
    paymentPhoto: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

userSchema.methods.getJWTToken = function () {
  return jwt.sign({ _id: this._id }, `${process.env.JWT_SECRET}`, {
    expiresIn: "10d",
  });
};

export const User = mongoose.model("user", userSchema);
