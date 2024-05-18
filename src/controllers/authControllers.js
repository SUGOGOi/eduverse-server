import cloudinary from "cloudinary";
import getDataUri from "../utils/dataUri.js";
import { ErrorHandler } from "../utils/utilityClass.js";
import { User } from "../models/userModel.js";
import { sendToken } from "../utils/sendToken.js";
import { sendEmail } from "../utils/sendEmail.js";
import { OtpModel } from "../models/otpModel.js";
import { rm } from "fs";

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, phno, school, password, Class, role, subject } =
      req.body;
    let file;

    if (role === "student") {
      file = req.file;
      // console.log(file);
      if (!file) return next(new ErrorHandler("Upload payment proof", 400));
    }

    if (!name || !email || !password || !phno || !school || !subject) {
      rm(file.path, () => {
        console.log(`${file.originalname} deleted`);
      });
      return next(new ErrorHandler("Please enter all fields", 400));
    }

    let otp = await OtpModel.findOne({ email });

    if (!otp) {
      rm(file.path, () => {
        console.log(`${file.originalname} deleted`);
      });
      return next(new ErrorHandler("Please verify your email address!", 400));
    }

    let user = await User.findOne({ email });

    if (user) {
      rm(file.path, () => {
        console.log(`${file.originalname} deleted`);
      });
      return next(new ErrorHandler("User already exist!", 409));
    }

    if (role === "student") {
      user = await User.create({
        name,
        email,
        password,
        phno,
        school,
        class: Class, //for student
        role,
        paymentPhoto: file.path,
      });
    } else {
      user = await User.create({
        name,
        email,
        password,
        phno,
        school,
        classes: Class, //for teacher
        role,
        subject,
      });
    }

    sendToken(
      res,
      user,
      "Registered Successfully, Wait for approval by Admin.",
      201
    );
  } catch (e) {
    // console.log(e);
    return next(new ErrorHandler("Registration Unsuccessfull", 500));
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ErrorHandler("Please enter your email/password", 400));
    }

    const user = await User.findOne({ email, password });

    if (!user) {
      return next(
        new ErrorHandler("Invalid credential or user doen't exist", 400)
      );
    }

    sendToken(res, user, `Welcome back ${user.name}`, 200);
  } catch (error) {
    return next(new ErrorHandler("Login Fail", 500));
  }
};

export const forgetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    // console.log(email);
    if (!email) {
      return next(new ErrorHandler("Please enter your registered email", 400));
    }
    const user = await User.findOne({ email }).select(["email", "password"]);
    // console.log(user);
    if (!user) {
      return next(new ErrorHandler("Invalid email or user doen't exist", 400));
    }

    const msg = `Your password is: ${user.password}`;
    // console.log(msg);

    await sendEmail(user.email, "EduVerse Password", msg);
    return res.status(200).json({
      success: true,
      message: `Password sent to your email`,
    });
  } catch (error) {
    return next(new ErrorHandler("Operation Fail", 500));
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    return res
      .status(200)
      .cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
        secure: true,
      })
      .cookie("role", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
        secure: true,
      })
      .json({
        success: true,
        message: "Logout Successfully",
      });
  } catch (error) {
    return next(new ErrorHandler("Logout Fail", 500));
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const { email } = req.query;
    if (!oldPassword || !newPassword) {
      return next(new ErrorHandler("Please enter all the fields", 400));
    }

    const user = await User.findOne({ email, password: oldPassword }).select(
      "password"
    );
    if (!user) {
      return next(new ErrorHandler("Internal server error", 500));
    }
    user.password = newPassword;
    await user.save();
    res.status(201).json({
      success: true,
      message: `Password changed`,
    });
  } catch (error) {
    return next(new ErrorHandler("Operation Fail", 500));
  }
};
