import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to DB!");
  } catch (error) {
    console.error(`Failed to connect to MongoDB, ${error}`);
    process.exit(1);
  }
};
