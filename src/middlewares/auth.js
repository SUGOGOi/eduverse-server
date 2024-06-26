import { ErrorHandler } from "../utils/utilityClass.js";
import { User } from "../models/userModel.js";
import jwt from "jsonwebtoken";

export const isAdminOrTeacher = async (req, res, next) => {
  try {
    const { id } = req.query;

    if (!id) {
      return next(new ErrorHandler("Login to access this resources", 401));
    }

    const user = await User.findById(id);
    if (!user) {
      return next(new ErrorHandler("Invalid  ID or user not exist", 400));
    }

    if (user.role != "admin" && user.role != "teacher") {
      return next(
        new ErrorHandler(
          "Your are not authorized to access these resources",
          401
        )
      );
    }

    next();
  } catch (error) {
    return next(
      new ErrorHandler("Your are not authorized to access these resources", 401)
    );
  }
};

export const isLogin = async (req, res, next) => {
  try {
    const token = req.headers.authorization || req.cookies.token;
    // console.log(token);

    if (!token) {
      return next(new ErrorHandler("Not Logged In", 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("done");

    req.user = await User.findById(decoded._id);

    next();
  } catch (error) {
    return next(new ErrorHandler("session expire, please login", 401));
  }
};
