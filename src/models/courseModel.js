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
      required: [true, "enter course title"],
    },
    videos: [
      {
        title: {
          type: String,
          required: [true, "enter video title"],
        },
        url: {
          type: String,
          required: [true, "enter video url"],
        },
      },
    ],
  },
  { timestamps: true }
);

export const Course = mongoose.model("course", courseSchema);
