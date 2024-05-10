import mongoose from "mongoose";

const moduleSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Types.ObjectId,
      ref: "course",
    },
    name: {
      type: String,
      required: [true, "enter module name"],
    },

    videos: [
      {
        vname: {
          type: String,
          required: [true, "enter video title"],
        },
        link: {
          type: String,
          required: [true, "enter video link"],
        },
      },
    ],
  },
  { timestamps: true }
);

export const Module = mongoose.model("module", moduleSchema);
