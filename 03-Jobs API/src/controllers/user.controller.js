import { User } from "../models/user.model.js";
import asyncHandler from "../utils/async.js";
import { ApiError } from "../utils/error.js";

const register = asyncHandler(async (req, res) => {
  const user = await User.create(req.body);
  const token = await user.createJWT();
  res.status(200).json({ user: { name: user.username }, token });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ApiError(400, "All fields are required!");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(401, "User does not exist!");
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid Credentials!");
  }

  const token = await user.createJWT();
  res.status(200).json({ user: { name: user.username }, token });
});

export { register, login };
