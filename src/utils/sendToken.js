import jwt from "jsonwebtoken";
import cookie from "cookie";

export const sendToken = (res, user, message, statusCode = 200) => {
  const token = jwt.sign({ _id: user._id }, `${process.env.JWT_SECRET}`, {
    expiresIn: "10d",
  });

  const options = {
    expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: true,
  };
  return res
    .status(statusCode)
    .cookie("token", token, options)
    .cookie("role", user.role, options)
    .json({
      success: true,
      message,
      user,
    });
};
