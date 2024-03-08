import express from "express";
import {
  createProduct,
  getAllProducts,
  getSingleProduct,
  uploadImage,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";
import {
  authenticateUser,
  authorizePermissions,
} from "../middlewares/authentication.js";
import { getSingleProductReview } from "../controllers/review.controller.js";

const router = express.Router();

router
  .route("/")
  .post([authenticateUser, authorizePermissions], createProduct)
  .get(getAllProducts);

router
  .route("/uploadImage")
  .post([authenticateUser, authorizePermissions], uploadImage);

router
  .route("/:id")
  .get(getSingleProduct)
  .patch([authenticateUser, authorizePermissions], updateProduct)
  .delete([authenticateUser, authorizePermissions], deleteProduct);

router.route("/:id/reviews").get(getSingleProductReview);

export default router;
