import express from "express";
import cors from "cors";
import dbconnection from "./config/dbconnection.js";
import authRoutes from "././routes/auth.js";
import ebookRoutes from "././routes/ebook.js";
import orderRoutes from "././routes/order.js";
import paymentRoutes from "././routes/payment.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

dbconnection();

app.get("/", (req, res) => {
  console.log("working fine");
  res.send("Server is working fine!"); // <-- Added response
});

app.use("/api/auth", authRoutes);
app.use("/api/ebooks", ebookRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
