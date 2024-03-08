import "dotenv/config";
import express from "express";

const app = express();
const port = process.env.PORT || 3001;

//rest of the package
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";

//middlewares
app.use(express.json());
app.use(cookieParser());

app.use(express.static("./public"));
app.use(fileUpload());

//routes
import authRouter from "./src/routes/auth.route.js";
import userRouter from "./src/routes/user.route.js";
import productRouter from "./src/routes/product.route.js";
import reviewRouter from "./src/routes/review.route.js";
import orderRouter from "./src/routes/order.route.js";

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/orders", orderRouter);

//not foud
import notFound from "./src/utils/notFound.js";

app.use(notFound);

//database
import connectDB from "./src/db/index.js";

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`app is listening on port ${port}`);
    });
  })
  .catch(() => {
    console.log("Connection failed!");
  });
