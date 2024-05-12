import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    class: {
      type: String,
      required: [true, "enter class"],
    },
    subject: {
      type: String,
      required: [true, "enter subject"],
    },
    description: {
      type: String,
      required: [true, "enter course description"],
    },
    school: {
      type: String,
      required: [true, "enter school"],
    },
    poster: {
      type: String,
      required: true,
    },
    modules: [
      {
        title: {
          type: String,
        },
        id: {
          type: mongoose.Types.ObjectId,
          ref: "module",
        },
      },
    ],

    creatorID: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true }
);

export const Course = mongoose.model("course", courseSchema);
