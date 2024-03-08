import { User } from "../models/user.model.js";
import asyncHandler from "../utils/async.js";
import ApiError from "../utils/error.js";
import { attachCookiesToResponse } from "../utils/jwt.js";
import checkPermissions from "../utils/checkPermissions.js";

const getAllUsers = asyncHandler(async (req, res) => {
  console.log(req.user);
  const users = await User.find({ role: "user" }).select("-password");
  res.status(200).json({ users, count: users.length });
});

const getSingleUser = asyncHandler(async (req, res) => {
  const { id: userId } = req.params;
  const user = await User.findOne({ _id: userId }).select("-password");
  if (!user) {
    throw new ApiError(404, `No user with id ${userId}`);
  }
  console.log("hey");
  checkPermissions(req.user, user._id);
  res.status(200).json({ user });
});

const showCurrentUser = asyncHandler((req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

const updateUser = asyncHandler(async (req, res) => {
  const { email, name } = req.body;
  if (!email || !name) {
    throw new ApiError(500, "Please provide all values");
  }

  const user = await User.findOneAndUpdate(
    { _id: req.user.userId },
    { email, name },
    { new: true }
  );

  const tokenUser = { name: user.name, userId: user._id, role: user.role };
  attachCookiesToResponse({ res, user: tokenUser });
  res.status(200).json({ success: true, tokenUser });
});

const updateUserPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new ApiError(500, "Please provide both values");
  }
  const user = await User.findOne({ _id: req.user.userId });

  const isPasswordCorrect = await user.comparePassword(oldPassword);
  if (!isPasswordCorrect) {
    throw new ApiError(500, "Old password is incorrect");
  }

  user.password = newPassword;
  user.save();

  res.status(200).json({ success: true, msg: "Password Updated" });
});

export {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};
