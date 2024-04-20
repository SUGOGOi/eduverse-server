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
    poster: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
    modules: [
      {
        title: {
          type: String,
          required: [true, "enter module title"],
        },
        id: {
          type: mongoose.Types.ObjectId,
          ref: "module",
        },
      },
    ],
  },
  { timestamps: true }
);

export const Course = mongoose.model("course", courseSchema);