import jwt from "jsonwebtoken";
export const sendToken = (res, user, message, statusCode = 200) => {
  const token = jwt.sign(
    { _id: user._id, role: user.role },
    `${process.env.JWT_SECRET}`,
    {
      expiresIn: "10d",
    }
  );

  const options = {
    expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: true,
    sameSite: "none",
  };
  return res.status(statusCode).cookie("token", token, options).json({
    success: true,
    message,
    user,
  });
};
