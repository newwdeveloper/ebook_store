import express from "express";
import Stripe from "stripe";
import Ebook from "../models/Ebook.js";
import sendEmail from "../services/emailService.js";
//import sendWhatsApp from "../services/whatsappService.js";
import dotenv from "dotenv";

const router = express.Router();

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Create PaymentIntent
router.post("/create", async (req, res) => {
  const { amount } = req.body;
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // convert to cents
      currency: "inr",
      metadata: { integration_check: "accept_a_payment" },
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verify Payment and send ebook
router.post("/verify", async (req, res) => {
  const { paymentIntentId, userData, ebookId } = req.body;
  try {
    console.log("Received paymentIntentId:", paymentIntentId);
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    console.log("Retrieved PaymentIntent:", paymentIntent);

    if (paymentIntent.status === "succeeded") {
      const ebook = await Ebook.findById(ebookId);
      sendEmail(userData.email, ebook.fileUrl);
      //sendWhatsApp(userData.phone, ebook.fileUrl);
      res.json({ message: "Payment successful" });
    } else {
      res.status(400).json({ message: "Payment not completed" });
    }
  } catch (error) {
    console.error("Payment verification failed:", error);
    res
      .status(500)
      .json({ message: "Verification failed", error: error.message });
  }
});

export default router;
