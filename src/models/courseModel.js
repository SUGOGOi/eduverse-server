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
