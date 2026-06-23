import mongoose from "mongoose";
import { getEnv } from "../../config/env.service.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(getEnv("Database_URL"));
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};