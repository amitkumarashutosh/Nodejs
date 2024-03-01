import "dotenv/config";
import express from "express";
import cors from "cors";

const app = express();
const port = process.env.PORT || 3001;

//middlewares
app.use(express.json());
app.use(cors());

//routes
import authRouter from "./src/routes/auth.route.js";
import jobsRouter from "./src/routes/jobs.route.js";
import authentication from "./src/middlewares/authentication.js";

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", authentication, jobsRouter);

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
