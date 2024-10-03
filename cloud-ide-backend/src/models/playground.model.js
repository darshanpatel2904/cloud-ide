import mongoose from "mongoose";

const PlaygroundSchema = new mongoose.Schema(
  {
    projectName: {
      type: String,
      required: true,
    },
    projectType: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    containerId: {
      type: String,
      default: null,
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Playground = mongoose.model("Playground", PlaygroundSchema);

export default Playground;
