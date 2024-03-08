import { Review } from "../models/review.model.js";
import { Product } from "../models/product.model.js";
import ApiError from "../utils/error.js";
import asyncHandler from "../utils/async.js";
import checkPermissions from "../utils/checkPermissions.js";

const createReview = asyncHandler(async (req, res) => {
  const { product: productId } = req.body;

  const isValidProduct = await Product.findOne({ _id: productId });
  if (!isValidProduct) {
    throw new ApiError("500", `No product with id ${productId}`);
  }

  const alreadySubmitted = await Review.findOne({
    product: productId,
    user: req.user.userId,
  });
  if (alreadySubmitted) {
    throw new ApiError(500, "Already submitted");
  }

  req.body.user = req.user.userId;
  const review = await Review.create(req.body);
  res.status(201).json({ review });
});

const getAllReviews = asyncHandler(async (req, res) => {
  const review = await Review.find({})
    .populate({
      path: "product",
      select: "name company price",
    })
    .populate({
      path: "user",
      select: "name",
    });
  res.status(200).json({ review, count: review.length });
});

const getSingleReview = asyncHandler(async (req, res) => {
  const { id: reviewId } = req.params;

  const review = await Review.findOne({ _id: reviewId });
  if (!review) {
    throw new ApiError(500, `No review with id ${reviewId}`);
  }
  res.status(200).json({ review });
});

const updateReview = asyncHandler(async (req, res) => {
  const { id: reviewId } = req.params;
  const { title, comment, rating } = req.body;

  const review = await Review.findOne({ _id: reviewId });
  if (!review) {
    throw new ApiError(500, `No review with id ${reviewId}`);
  }

  checkPermissions(req.user, review.user);
  review.rating = rating;
  review.title = title;
  review.comment = comment;
  await review.save();

  res.status(200).json({ review });
});

const deleteReview = asyncHandler(async (req, res) => {
  const { id: reviewId } = req.params;

  const review = await Review.findOne({ _id: reviewId });
  if (!review) {
    throw new ApiError(500, `No review with id ${reviewId}`);
  }
  checkPermissions(req.user, review.user);
  await Review.findOneAndDelete({ _id: reviewId });

  res.status(200).json({ msg: "Sucess! Review deleted!" });
});

const getSingleProductReview = asyncHandler(async (req, res) => {
  const { id: productId } = req.params;
  const reviews = await Review.find({ product: productId });
  res.status(200).json({ reviews, count: reviews.length });
});

export {
  getSingleProductReview,
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
};
