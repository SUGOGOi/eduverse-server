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
    class: {
      type: String,
      required: [true, "enter class"],
    },
    subject: {
      type: String,
      required: [true, "enter subject"],
    },

    materials: [
      {
        vname: {
          type: String,
        },
        link: {
          type: String,
        },
        pname: {
          type: String,
        },
        url: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

export const Module = mongoose.model("module", moduleSchema);
