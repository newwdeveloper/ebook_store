import mongoose from "mongoose";

const ebookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // ✅ This adds createdAt and updatedAt fields
  }
);

const Ebook = mongoose.model("Ebook", ebookSchema);

export default Ebook;
