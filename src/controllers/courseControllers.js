import getDataUri from "../utils/dataUri.js";
import { Course } from "../models/courseModel.js";
import { ErrorHandler } from "../utils/utilityClass.js";
import cloudinary from "cloudinary";
import { User } from "../models/userModel.js";
import { rm } from "fs";
import { Module } from "../models/moduleModel.js";

export const getAllCourses = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    let courses = [];
    // console.log(user);
    if (user.role === "student") {
      if (user.isApproved === true) {
        courses = await Course.find({
          school: user.school,
          class: user.class,
        });
      } else {
        return next(new ErrorHandler("Wait for admin approval", 404));
      }
    } else if (user.role === "teacher") {
      if (user.isApproved === true) {
        courses = await Course.find({ creatorID: user._id });
      } else {
        return next(new ErrorHandler("Wait for admin approval", 404));
      }
    } else {
      courses = await Course.find({});
    }
    // console.log(courses);
    if (!courses) {
      return next(new ErrorHandler("No course available", 404));
    }

    return res.status(200).json({
      success: true,
      courses,
    });
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler("Error fetching courses ", 500));
  }
};

export const getCourseById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let course;
    if (!id) {
      return next(new ErrorHandler("Invalid Course Id", 404));
    }

    course = await Course.findById(id);
    if (!course) {
      return next(new ErrorHandler("No course available", 404));
    }

    const person = await Course.findById(id)
      .populate("creatorID")
      .select("creatorID");
    const { _doc } = { ...course };

    const newCourse = { ..._doc, creator: person.creatorID.name };
    // console.log(newCourse);

    res.status(200).json({
      success: true,
      course: newCourse,
    });
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler("Error fetching course", 500));
  }
};

//<=============================CREATE=====================================>//
export const createCourse = async (req, res, next) => {
  try {
    const { subject, Class, description, school } = req.body;
    const { id } = req.query;
    const file = req.file;

    const courseExist = await Course.findOne({ subject, class: Class });
    if (courseExist) {
      rm(file.path, () => {
        console.log(`${file.originalname} deleted`);
      });
      return next(
        new ErrorHandler(
          `${courseExist.subject} of class ${courseExist.class} already exist`,
          400
        )
      );
    }

    const course = await Course.create({
      class: Class,
      subject,
      description,
      school,
      poster: file.path,
      creatorID: id,
    });

    return res.status(201).json({
      success: true,
      course,
      message: "Course created!",
    });
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler("Error creating courses ", 500));
  }
};

export const deleteCourse = async (req, res, next) => {
  try {
    const { cid } = req.params;
    const { id } = req.query;

    if (!id) {
      return next(new ErrorHandler("no id", 400));
    }
    const user = await User.findById(id);
    if (!user) {
      return next(new ErrorHandler("user not found or invalid id", 404));
    }

    const course = await Course.findById(cid);

    if (!course) {
      return next(new ErrorHandler("Course not available", 404));
    }

    if (user.role === "admin") {
      rm(course.poster, () => {
        console.log(`${course.subject}'s poster deleted`);
      });

      // =====DELETEING ALL MODULES AND THEIR PDFS AND VIDEO LINKS===//
      for (let i = 0; i < course.modules.length; i++) {
        let module = await Module.findById(course.modules[i]._id);
        for (let j = 0; j < module.materials.length; j++) {
          if (module.materials[j].pname) {
            rm(module.materials[j].url, () => {
              console.log(`${module.materials[j].pname}'s poster deleted`);
            });
          }
        }
        await module.deleteOne();
      }

      await course.deleteOne();
      return res.status(200).json({
        success: true,
        message: "Course deleted",
      });
    } else if (user.role === "teacher") {
      if (user._id.toString() === course.creatorID.toString()) {
        rm(course.poster, () => {
          console.log(`${course.subject}'s poster deleted`);
        });

        // =====DELETEING ALL MODULES AND THEIR PDFS AND VIDEO LINKS===//
        for (let i = 0; i < course.modules.length; i++) {
          let module = await Module.findById(course.modules[i]._id);
          for (let j = 0; j < module.materials.length; j++) {
            if (module.materials[j].pname) {
              rm(module.materials[j].url, () => {
                console.log(`${module.materials[j].pname}'s poster deleted`);
              });
            }
          }
          await module.deleteOne();
        }

        await course.deleteOne();
        return res.status(200).json({
          success: true,
          message: "Course deleted",
        });
      }
      return next(
        new ErrorHandler("Unauthorized, can't delete other's course", 400)
      );
    } else {
      return next(
        new ErrorHandler("Unauthorized, can't delete other's course", 400)
      );
    }
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler("Error deleting courses ", 500));
  }
};
