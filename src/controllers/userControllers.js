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
    const users = await User.find({});
    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
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
