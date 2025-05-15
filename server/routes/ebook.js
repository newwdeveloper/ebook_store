import express from "express";
import Ebook from "../models/Ebook.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const ebooks = await Ebook.find().sort({ createdAt: -1 }); // ✅ Newest first;
    res.json(ebooks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, description, price, imageUrl, fileUrl } = req.body;
    const ebook = new Ebook({ title, description, price, imageUrl, fileUrl });
    await ebook.save();
    res.status(201).json({ message: "Ebook added successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE an ebook by ID
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const ebook = await Ebook.findByIdAndDelete(req.params.id);
    if (!ebook) {
      return res.status(404).json({ error: "Ebook not found" });
    }
    res.json({ message: "Ebook deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/ebooks/:id
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { title, description, price, imageUrl, fileUrl } = req.body;

    const ebook = await Ebook.findByIdAndUpdate(
      req.params.id,
      { title, description, price, imageUrl, fileUrl },
      { new: true } // return the updated document
    );

    if (!ebook) {
      return res.status(404).json({ error: "Ebook not found" });
    }

    res.json({ message: "Ebook updated successfully", ebook });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/ebooks/:id - Get one ebook by ID
router.get("/:id", async (req, res) => {
  try {
    const ebook = await Ebook.findById(req.params.id);
    if (!ebook) {
      return res.status(404).json({ error: "Ebook not found" });
    }
    res.json(ebook);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
