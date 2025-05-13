import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const connectDB = async () => {
  console.log(process.env.MONGODB_URL);
  try {
    await mongoose.connect(process.env.MONGODB_URL);

    console.log("connected to MONGODB");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1); // Exit the app if DB connection fails
  }
};

export default connectDB;
