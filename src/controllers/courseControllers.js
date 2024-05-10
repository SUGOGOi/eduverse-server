import getDataUri from "../utils/dataUri.js";
import { Course } from "../models/courseModel.js";
import { ErrorHandler } from "../utils/utilityClass.js";
import cloudinary from "cloudinary";
import { User } from "../models/userModel.js";

export const getAllCourses = async (req, res, next) => {
  try {
    const courses = await Course.find({});
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

export const getSearchCourse = async (req, res, next) => {
  try {
    const { subject, Class } = req.query;
    let courses;
    if (!Class) {
      courses = await Course.find({ subject });
      if (!courses) {
        return next(new ErrorHandler("No course available", 404));
      }
    }

    if (!subject) {
      courses = await Course.find({ class: Class });
      if (!courses) {
        return next(new ErrorHandler("No course available", 404));
      }
    }

    courses = await Course.findOne({ subject, class: Class });

    if (!courses) {
      return next(new ErrorHandler("No course available", 404));
    }

    res.status(200).json({
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

    res.status(200).json({
      success: true,
      course,
    });
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler("Error fetching course", 500));
  }
};

//<=============================CREATE=====================================>
export const createCourse = async (req, res, next) => {
  try {
    const { subject, Class, description, school } = req.body;
    const file = req.file;
    // console.log(subject, Class, description);

    const fileUri = getDataUri(file);
    const courseExist = await Course.findOne({ subject, class: Class });
    if (courseExist) {
      return next(
        new ErrorHandler(
          `${courseExist.subject} of class ${courseExist.class} already exist`,
          400
        )
      );
    }

    const myCloud = await cloudinary.v2.uploader.upload(fileUri.content);
    const course = await Course.create({
      class: Class,
      subject,
      description,
      school,
      poster: {
        public_id: myCloud.public_id,
        url: myCloud.url,
      },
    });

    return res.status(201).json({
      success: true,
      course,
      message: "Course created!",
    });
  } catch (error) {
    // console.log(error);
    return next(new ErrorHandler("Error creating courses ", 500));
  }
};

export const deleteCourse = async (req, res, next) => {
  try {
    const id = req.params.id;
    const course = await Course.findById(id);
    if (!course) {
      return next(new ErrorHandler("Course not available", 500));
    }
    await cloudinary.v2.uploader.destroy(course.poster.public_id);
    await course.deleteOne();
    return res.status(200).json({
      success: true,
      message: "Course deleted",
    });
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler("Error deleting courses ", 500));
  }
};
