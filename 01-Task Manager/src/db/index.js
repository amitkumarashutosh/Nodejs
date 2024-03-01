import mongoose from "mongoose";

const connectDB = async (req, res) => {
  try {
    const { connection } = await mongoose.connect(process.env.MONGO_URI);
    console.log(
      `MONGO_DB IS CONNECTED SUCCESSFULLY!! DB_HOST: ${connection.host}`
    );
  } catch (error) {
    console.log(`DATABASE CONNECTION FAILED!! ${error}`);
    process.exit(1);
  }
};

export default connectDB;
