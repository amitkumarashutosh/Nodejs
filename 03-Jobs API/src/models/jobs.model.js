import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "Please provide company name"],
      maxlength: 30,
    },
    position: {
      type: String,
      required: [true, "Please provide positon"],
      maxlength: 30,
    },
    status: {
      type: String,
      enum: ["pending", "declined", "interview"],
      default: "pending",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide user"],
    },
  },
  { timestamps: true }
);

export const Job = mongoose.model("Job", jobSchema);
