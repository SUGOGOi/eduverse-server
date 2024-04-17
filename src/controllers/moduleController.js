import { Course } from "../models/courseModel.js";
import { Module } from "../models/moduleModel.js";
import { ErrorHandler } from "../utils/utilityClass.js";

export const createModule = async (req, res, next) => {
  try {
    const { cid } = req.query;
    const { name } = req.body;

    let course = await Course.findById(cid);

    if (!course) {
      return next(new ErrorHandler("No course found", 404));
    }

    let module = await Module.findOne({ name });
    if (module) {
      return next(new ErrorHandler("module already exist", 400));
    }

    module = await Module.create({
      course: course._id,
      name,
    });

    course.modules.push({
      title: module.name,
    });

    await course.save();

    const modules = await Module.find({});
    return res.status(201).json({
      success: true,
      message: "module created successfuly",
      modules,
    });
  } catch (error) {
    return next(new ErrorHandler("Error createing module", 500));
  }
};

export const addVideos = async (req, res, next) => {
  try {
    const { link, vname } = req.body;
    const { mid } = req.query;

    const module = await Module.findById(mid);
    if (!module) {
      return next(new ErrorHandler("module not found", 404));
    }

    if (module.videos.vname === vname) {
      return next(new ErrorHandler("video name already exist", 404));
    }

    module.videos.push({
      vname,
      link,
    });

    await module.save();
    return res.status(200).json({
      success: true,
      module,
      message: "video added successfuly",
    });
  } catch (error) {
    return next(new ErrorHandler("Error adding videos", 500));
  }
};
