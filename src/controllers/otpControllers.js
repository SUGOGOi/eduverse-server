import validator from "validator";

import { OtpModel } from "../models/otpModel.js";
import { sendEmail } from "../utils/sendEmail.js";
import { ErrorHandler } from "../utils/utilityClass.js";
import { Contact } from "../models/contactModel.js";
import { User } from "../models/userModel.js";

export const sendOtpEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    // console.log(email);
    if (!email) {
      return next(new ErrorHandler("Please provide an email", 400));
    }
    const validate = validator.isEmail(email);
    // console.log(validate);

    if (!validate) {
      return next(new ErrorHandler("Please provide a valid email", 400));
    }

    const user = await User.findOne({ email });

    if (user) {
      return next(new ErrorHandler("Email is already used", 400));
    }

    const otp = String(Math.floor(1000 + Math.random() * 8000));
    console.log(otp);

    const expire = String(Date.now() + 15 * 60 * 1000);
    // console.log(expire);

    let otpUser = await OtpModel.findOne({ email });
    // console.log(otpUser);

    if (otpUser != null) {
      otpUser.otpSend = otp;
      otpUser.otpExpire = expire;
      await otpUser.save();
    } else {
      otpUser = await OtpModel.create({
        email: email,
        otpSend: otp,
        otpExpire: expire,
      });
    }

    const msg = `Your EduVerse otp is : ${otp}`;
    // console.log(msg);

    await sendEmail(otpUser.email, "EduVerse OTP verify", msg);

    return res.status(200).json({
      success: true,
      message: `OTP has been send to ${otpUser.email}`,
      email,
    });
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler("Error sending otp ", 500));
  }
};

export const verifyOtpEmail = async (req, res, next) => {
  try {
    const { otp } = req.body;
    const { email } = req.query;
    if (!otp) {
      return next(new ErrorHandler("please enter otp ", 400));
    }
    const user = await OtpModel.findOne({
      otpSend: otp,
      otpExpire: {
        $gte: String(Date.now()),
      },
      email: email,
    });
    // console.log(user);

    if (!user) {
      return next(new ErrorHandler("Invalid otp or otp expired ", 400));
    }

    if (user.otpSend === otp) {
      return res.status(200).json({
        success: true,
        message: `${user.email} varified`,
        isVerified: true,
      });
    }
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler("Error verifying otp ", 500));
  }
};

//======================CONTACT INFO=============================//

export const contactUs = async (req, res, next) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return next(new ErrorHandler("Enter all fileds", 400));
    }

    const validate = validator.isEmail(email);

    if (!validate) {
      return next(new ErrorHandler("Please provide a valid email", 400));
    }

    const msg = await Contact.findOne({ email });

    if (msg) {
      msg.message = message;
      return res.status(200).json({
        success: true,
        message: "Message Updated",
      });
    }
    await Contact.create({
      userName: name,
      email,
      message,
    });
    return res.status(200).json({
      success: true,
      message: "Message sent",
    });
  } catch (error) {
    return next(new ErrorHandler("Error sending Message ", 500));
  }
};

export const allContactMessage = async (req, res, next) => {
  try {
    const messages = await Contact.find({});
    if (messages.length === 0) {
      return next(new ErrorHandler("no contact messages found", 404));
    }
    return res.status(201).json({
      success: true,
      messages,
    });
  } catch (error) {
    return next(new ErrorHandler("Error fetching message ", 500));
  }
};
