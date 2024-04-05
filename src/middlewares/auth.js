import ErrorHandler from "../utils/utilityClass.js";
import { User } from "../models/userModel.js";

export const isAdmin = async (req, res, next) => {
  try {
    const { _id } = req.query;

    if (!_id) {
      return next(new ErrorHandler("Login to access this resources", 401));
    }

    const user = await User.findById(_id);
    if (!user) {
      return next(new ErrorHandler("Invalid  ID or user not exist", 400));
    }

    if (user.role != "admin") {
      return next(
        new ErrorHandler("Only admin can access this resources", 401)
      );
    }

    next();
  } catch (error) {
    return next(new ErrorHandler("Only admin can access this resources", 401));
  }
};
