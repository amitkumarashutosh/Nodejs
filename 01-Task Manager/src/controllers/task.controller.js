import { Task } from "../models/task.model.js";
import { ApiError } from "../utils/error.js";
import asyncHandler from "../utils/async.js";

const getAllTask = asyncHandler(async (req, res) => {
  const tasks = await Task.find({});
  res.status(200).json({ tasks });
});

const getTask = asyncHandler(async (req, res) => {
  const { id: taskID } = req.params;
  const task = await Task.findOne({ _id: taskID });

  if (!task) {
    throw new ApiError(404, `task is not present with id ${taskID}`);
  }

  res.status(200).json({ task });
});

const createTask = asyncHandler(async (req, res) => {
  const task = await Task.create(req.body);
  res.status(201).json({ task });
});

const updateTask = asyncHandler(async (req, res) => {
  const { id: taskID } = req.params;
  const task = await Task.findOneAndUpdate({ _id: taskID }, req.body, {
    runValidators: true,
  });
  if (!task) {
    throw new ApiError(404, `task is not present with id ${taskID}`);
  }
  res.status(200).json({ task });
});

const deleteTask = asyncHandler(async (req, res) => {
  const { id: taskID } = req.params;
  const task = await Task.findOneAndDelete({ _id: taskID });
  if (!task) {
    throw new ApiError(404, `task is not present with id ${taskID}`);
  }
  res.status(200).json({ task });
});

export { getAllTask, getTask, createTask, updateTask, deleteTask };
