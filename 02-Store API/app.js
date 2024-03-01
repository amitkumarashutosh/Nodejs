import "dotenv/config";
import express from "express";

const app = express();
const port = process.env.PORT || 3001;

//middlewares
app.use(express.json());
app.use(express.static("./public"));

//routes
import productRouter from "./src/routes/product.route.js";

app.use("/api/v1/products", productRouter);

//database
import connectDB from "./src/db/index.js";

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`app listening on port ${port}`);
    });
  })
  .catch(() => {
    console.log("Connection failed!");
  });
