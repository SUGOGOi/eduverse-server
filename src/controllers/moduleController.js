import { Course } from "../models/courseModel.js";
import { Module } from "../models/moduleModel.js";
import getDataUri from "../utils/dataUri.js";
import { ErrorHandler } from "../utils/utilityClass.js";
import cloudinary from "cloudinary";
import { rm } from "fs";

export const createModule = async (req, res, next) => {
  try {
    const { cid } = req.query;
    const { name } = req.body;
    console.log(cid);

    let course = await Course.findById(cid);
    const subject = course.subject;
    const Class = course.class;

    if (!course) {
      return next(new ErrorHandler("No course found", 404));
    }

    let module = await Module.findOne({
      name,
      course: cid,
    });

    console.log(module);
    if (module != null) {
      return next(new ErrorHandler("chapter already exist", 400));
    }

    module = await Module.create({
      course: course._id,
      name,
      class: Class,
      subject,
    });

    course.modules.push({
      title: module.name,
      _id: module._id,
    });

    await course.save();

    // const modules = await Module.find({});
    return res.status(201).json({
      success: true,
      message: "chapter created successfuly",
      // modules,
    });
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler("Error creating chapter", 500));
  }
};

//=====================UPLOAD LINK/PDF=========================================//
export const addVideos = async (req, res, next) => {
  try {
    const { link, vname } = req.body;
    const { mid } = req.query;

    if (!link || !vname) {
      return next(new ErrorHandler("Please enter all fields", 400));
    }

    const module = await Module.findById(mid);
    if (!module) {
      return next(new ErrorHandler("module not found", 404));
    }

    // if (module.materials.video.vname === vname) {
    //   return next(new ErrorHandler("video name already exist", 404));
    // }

    module.materials.push({
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

export const addPdf = async (req, res, next) => {
  try {
    const { pname } = req.body;
    const { mid } = req.query;
    const file = req.file;

    if (!pname || !mid) {
      rm(file.path, () => {
        console.log(`${file.originalname} deleted`);
      });
      return next(new ErrorHandler("Please enter all fields", 400));
    }

    const module = await Module.findById(mid);

    if (!module) {
      rm(file.path, () => {
        console.log(`${file.originalname} deleted`);
      });
      return next(new ErrorHandler("module not found", 404));
    }

    module.materials.push({
      pname: pname,
      url: file.path,
    });

    await module.save();
    return res.status(200).json({
      success: true,
      module,
      message: "pdf added successfuly",
    });
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler("Error adding pdf", 500));
  }
};

//===============================DELETE VIDEO/PDF=============================//
export const deleteVideo = async (req, res, next) => {
  try {
    const { mid, vid } = req.query;

    if (!mid) {
      return next(new ErrorHandler("no module id", 500));
    }
    const module = await Module.findById(mid).select("materials");
    // console.log(module.videos);
    if (!module) {
      return next(new ErrorHandler("no module found", 404));
    }

    module.materials = module.materials.filter((item) => {
      if (item.vname) {
        if (item._id.toString() != vid.toString()) return item;
      } else {
        return item;
      }
    });

    await module.save();

    return res.status(200).json({
      success: true,
      message: "Video deleted",
    });
  } catch (error) {
    // console.log(error);
    return next(new ErrorHandler("Error deleting videos", 500));
  }
};

export const deletePdf = async (req, res, next) => {
  try {
    const { mid, pid } = req.query;
    if (!mid) {
      return next(new ErrorHandler("no module id", 500));
    }
    const module = await Module.findById(mid).select("materials");
    // console.log(module.videos);
    if (!module) {
      return next(new ErrorHandler("no module found", 404));
    }
    module.materials = module.materials.filter((item) => {
      if (item.pname) {
        if (item._id.toString() != pid.toString()) return item;
        if (item._id.toString() === pid.toString()) {
          rm(item.url, () => {
            console.log(`${item.pname}'s poster deleted`);
          });
        }
      } else {
        return item;
      }
    });

    await module.save();

    return res.status(200).json({
      success: true,
      message: "pdf  deleted",
    });
  } catch (error) {
    return next(new ErrorHandler("Error deleting videos", 500));
  }
};

//=========================DELETE CHAPTER/MODULE================================//
export const deleteModule = async (req, res, next) => {
  try {
    const { cid, mid } = req.query;

    if (!mid) {
      return next(new ErrorHandler("no  module", 500));
    }
    const module = await Module.findById(mid);
    if (!module) {
      return next(new ErrorHandler("no module found", 404));
    }

    const course = await Course.findById(cid).select("modules");
    if (!course) {
      return next(new ErrorHandler("no course found", 404));
    }

    course.modules = course.modules.filter((item) => {
      if (item._id.toString() !== mid.toString()) return item;
    });

    module.materials.forEach((item) => {
      if (item.pname) {
        rm(item.url, () => {
          console.log(`${item.pname}'s poster deleted`);
        });
      }
    });

    await course.save();

    await module.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Chapter deleted",
    });

    // for (let i = 0;i<videos.leng)
  } catch (error) {
    return next(new ErrorHandler("Error deleting Chapter", 500));
  }
};

export const getAllMaterials = async (req, res, next) => {
  try {
    const { mid } = req.query;
    if (!mid) {
      return next(new ErrorHandler("no module", 404));
    }
    const module = await Module.findById(mid).select("materials");
    // console.log(module);

    res.status(200).json({
      success: true,
      materials: module.materials,
    });
  } catch (error) {
    // console.log(error);
    return next(new ErrorHandler("Error loading materials", 500));
  }
};
