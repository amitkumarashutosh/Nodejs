import { Job } from "../models/jobs.model.js";
import asyncHandler from "../utils/async.js";
import { ApiError } from "../utils/error.js";

const getAllJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.userId });
  res.status(200).json({ jobs, count: jobs.length });
});

const getJob = asyncHandler(async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;
  const job = await Job.findOne({
    _id: jobId,
    createdBy: userId,
  });

  if (!job) {
    throw new ApiError(404, `No job with id ${jobId}`);
  }
  res.status(200).json({ job });
});

const createJob = asyncHandler(async (req, res) => {
  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);
  res.status(201).json({ job });
});

const updateJob = asyncHandler(async (req, res) => {
  const {
    body: { company, position },
    user: { userId },
    params: { id: jobId },
  } = req;

  if (company === "" || position === "") {
    throw new ApiError(500, "Company or position field cannt be empty");
  }
  const job = await Job.findOneAndUpdate(
    { _id: jobId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  );

  if (!job) {
    throw new ApiError(404, `No job with id ${jobId}`);
  }
  res.status(200).json({ job });
});

const deleteJob = asyncHandler(async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;

  const job = await Job.findOneAndDelete({ _id: jobId, createdBy: userId });

  if (!job) {
    throw new ApiError(404, `No job with id ${jobId}`);
  }
  res.status(200).json({ job });
});

export { getAllJobs, getJob, createJob, updateJob, deleteJob };
