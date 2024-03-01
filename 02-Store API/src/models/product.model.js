import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [, "product name must be provide"],
    },
    price: {
      type: Number,
      required: [true, "product price must be provided"],
      default: 300,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      default: 4.5,
    },
    company: {
      type: String,
      enum: ["ikea", "liddy", "caressa", "marcos"],
    },
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);
