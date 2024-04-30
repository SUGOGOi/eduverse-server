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
