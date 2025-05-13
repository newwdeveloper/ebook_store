import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

router.post("/login", (req, res) => {
  const { userName, password } = req.body;
  console.log("Received userName:", userName);
  console.log("Expected userName:", process.env.USERNAME);

  if (userName === process.env.USERNAME && password === process.env.PASSWORD) {
    const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token });
  } else {
    console.log("Login failed. Invalid credentials.");
    res.status(401).json({ message: "invalid crediantials" });
  }
});

export default router;
