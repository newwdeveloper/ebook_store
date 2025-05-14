// src/components/CheckoutForm.jsx
import React, { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import axios from "axios";
import { toast } from "react-toastify";

const CheckoutForm = ({ clientSecret, checkoutData, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);

    try {
      // Confirm the payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        toast.error(result.error.message);
        setLoading(false);
        return;
      }

      const paymentIntent = result.paymentIntent;

      if (paymentIntent.status === "succeeded") {
        // Call your backend to verify the payment and send ebook
        await axios.post(
          "https://ebook-store-backend.onrender.com/api/payment/verify",
          {
            paymentIntentId: paymentIntent.id,
            userData: checkoutData.formData,
            ebookId: checkoutData.ebook._id,
          }
        );

        toast.success("Ebook sent successfully!");
        onSuccess(); // Notify parent component
      } else {
        toast.error("Payment did not succeed.");
      }
    } catch (error) {
      console.error("Verification error:", error);
      toast.error("Verification failed. Please contact support.");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-bold mb-2">Enter Card Details</h2>
      <CardElement
        options={{
          style: {
            base: {
              fontSize: "16px",
              color: "#32325d",
              "::placeholder": {
                color: "#a0aec0",
              },
            },
            invalid: {
              color: "#e53e3e",
            },
          },
        }}
      />
      <button
        type="submit"
        disabled={!stripe || loading}
        className={`w-full px-4 py-2 rounded text-white ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700"
        }`}
      >
        {loading ? "Processing..." : "Pay & Get Ebook"}
      </button>
    </form>
  );
};

export default CheckoutForm;
