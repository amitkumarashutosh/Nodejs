import express from "express";
import {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
} from "../controllers/user.controller.js";
import {
  authenticateUser,
  authorizePermissions,
} from "../middlewares/authentication.js";

const router = express.Router();

router.route("/").get(authenticateUser, authorizePermissions, getAllUsers);

router.route("/showMe").get(authenticateUser, showCurrentUser);
router.route("/updateUser").patch(authenticateUser, updateUser);
router.route("/updateUserPassword").patch(authenticateUser, updateUserPassword);

router.route("/:id").get(authenticateUser, getSingleUser);

export default router;
