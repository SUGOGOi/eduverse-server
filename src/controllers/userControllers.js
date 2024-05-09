import { User } from "../models/userModel.js";
import { ErrorHandler } from "../utils/utilityClass.js";

export const getMyProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    return res.status(200).json({
      success: true,
      user,
      message: `Welcome ${user.name}`,
    });
  } catch (error) {
    return next(new ErrorHandler("user not found", 404));
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const { id } = req.query;
    let users = undefined;
    const user = await User.findById(id).select(["role", "school"]);

    if (user.role === "teacher") {
      users = await User.find({ school: user.school, role: "student" });
    } else {
      users = await User.find({});
    }

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler("users not found", 404));
  }
};

export const approveUser = async (req, res, next) => {
  try {
    const { uid } = req.query;
    if (!uid) {
      return next(new ErrorHandler("no uid", 400));
    }

    const user = await User.findById(uid).select("isApproved").select("name");

    if (!user) {
      return next(new ErrorHandler("no user found", 404));
    }

    user.isApproved = true;

    await user.save();
    return res.status(200).json({
      success: true,
      message: `${user.name} approved`,
    });
  } catch (error) {
    return next(new ErrorHandler("users not found", 404));
  }
};

export const getSpecificUsers = async (req, res, next) => {
  try {
    const { uid } = req.params;
    if (!uid) {
      return next(new ErrorHandler("no uid", 400));
    }
    const userDetail = await User.findById(uid);
    if (!userDetail) {
      return next(new ErrorHandler("no user found", 404));
    }
    return res.status(200).json({
      success: true,
      userDetail,
    });
  } catch (error) {
    return next(new ErrorHandler("users not found", 404));
  }
};
