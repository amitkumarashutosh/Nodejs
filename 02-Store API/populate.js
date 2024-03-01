import "dotenv/config";
import productData from "./product.js";
import connectDB from "./src/db/index.js";
import { Product } from "./src/models/product.model.js";

const start = async () => {
  try {
    await connectDB();
    await Product.deleteMany();
    await Product.create(productData);
    console.log("SUCCESS!!!");
    process.exit(0);
  } catch (error) {
    console.log("Failed!");
    process.exit(1);
  }
};
start();
