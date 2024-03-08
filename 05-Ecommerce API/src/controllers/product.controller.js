import { Product } from "../models/product.model.js";
import ApiError from "../utils/error.js";
import asyncHandler from "../utils/async.js";
import path from "path";
import { fileURLToPath } from "url";
import { Review } from "../models/review.model.js";

const createProduct = asyncHandler(async (req, res) => {
  req.body.user = req.user.userId;
  const product = await Product.create(req.body);
  res.status(201).json({ product });
});

const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  res.status(200).json({ products, count: products.length });
});

const getSingleProduct = asyncHandler(async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findOne({ _id: productId });

  if (!product) {
    throw new ApiError("404", `No product with id ${productId}`);
  }

  res.status(200).json({ product });
});

const updateProduct = asyncHandler(async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findOneAndUpdate({ _id: productId }, req.body, {
    new: true,
  });

  if (!product) {
    throw new ApiError("404", `No product with id ${productId}`);
  }
  res.status(200).json({ product });
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { id: productId } = req.params;

  await Review.deleteMany({ product: { _id: productId } });
  const product = await Product.findOneAndDelete({ _id: productId });

  if (!product) {
    throw new ApiError("404", `No product with id ${productId}`);
  }
  res.status(200).json({ msg: "Success! Product removed" });
});

const uploadImage = asyncHandler(async (req, res) => {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  console.log("amit" + __dirname);
  if (!req.files) {
    throw new ApiError(500, "No file uploaded");
  }

  const productImage = req.files.image;
  if (!productImage.mimetype.startsWith("image")) {
    throw new ApiError(500, "Please upload Images");
  }

  const maxSize = 1024 * 1024;
  if (productImage.size > maxSize) {
    throw new ApiError(500, "Please upload image smaller than 1MB");
  }

  const imagePath = path.join(
    __dirname,
    "../../public/uploads/" + `${productImage.name}`
  );

  await productImage.mv(imagePath);
  res.status(200).json({ image: `/uploads/${productImage.name}` });
});

export {
  createProduct,
  getAllProducts,
  getSingleProduct,
  uploadImage,
  updateProduct,
  deleteProduct,
};
