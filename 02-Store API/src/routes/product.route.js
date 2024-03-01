import exress from "express";
import {
  getAllProducts,
  getAllStaticProducts,
} from "../controllers/product.controller.js";

const router = exress.Router();

router.route("/").get(getAllProducts);
router.route("/static").get(getAllStaticProducts);
export default router;
