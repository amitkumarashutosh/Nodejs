import ApiError from "./error.js";

const checkPermissions = (requestUser, resourceUserId) => {
  if (requestUser.role === "admin") return;
  if (requestUser.userId === resourceUserId.toString()) return;

  throw new ApiError(500, "Not authorized to access this route");
};

export default checkPermissions;
