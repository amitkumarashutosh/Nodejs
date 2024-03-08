import { User } from "../models/user.model.js";
import ApiError from "../utils/error.js";
import { isTokenValid } from "../utils/jwt.js";
import asyncHandler from "../utils/async.js";

const authenticateUser = asyncHandler(async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    throw new ApiError("Authentication Invalid");
  }

  const payload = isTokenValid({ token });
  req.user = {
    name: payload.name,
    userId: payload.userId,
    role: payload.role,
  };
  next();
});

const authorizePermissions = asyncHandler(async (req, res, next) => {
  if (req.user.role !== "admin") {
    throw new ApiError(500, "Authentication Invalid! Not a ADMIN");
  }
  next();
});

export { authenticateUser, authorizePermissions };
