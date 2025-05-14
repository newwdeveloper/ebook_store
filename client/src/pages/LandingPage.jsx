// src/pages/LandingPage.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import EbookCard from "../components/EbookCard";
import BuyForm from "../components/BuyForm";
import { ToastContainer, toast } from "react-toastify";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../components/CheckoutForm";
import "react-toastify/dist/ReactToastify.css";

// Use Vite's environment variable syntax
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const LandingPage = () => {
  const [ebooks, setEbooks] = useState([]);
  const [selectedEbook, setSelectedEbook] = useState(null);
  const [clientSecret, setClientSecret] = useState("");
  const [checkoutData, setCheckoutData] = useState(null);

  // Fetch the ebooks on component mount
  useEffect(() => {
    axios
      .get("https://ebook-store-backend.onrender.com/api/ebooks")
      .then((res) => setEbooks(res.data))
      .catch(() => toast.error("Failed to load ebooks"));
  }, []);

  // Handle the purchase by sending the user's data and selected ebook ID
  const handleBuy = async (formData) => {
    try {
      const res = await axios.post(
        "https://ebook-store-backend.onrender.com/api/payment/create",
        {
          amount: selectedEbook.price,
        }
      );

      setClientSecret(res.data.clientSecret);
      setCheckoutData({ formData, ebook: selectedEbook }); // Store data for payment verification
    } catch (err) {
      console.log("error", err);
      toast.error("Stripe payment failed.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Ebook Store</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {ebooks.map((ebook) => (
          <EbookCard
            key={ebook._id}
            ebook={ebook}
            onBuy={() => setSelectedEbook(ebook)} // Select ebook when "Buy" is clicked
          />
        ))}
      </div>

      {/* Show Buy Form */}
      {selectedEbook && !clientSecret && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <BuyForm
              ebook={selectedEbook}
              onSubmit={handleBuy}
              onClose={() => setSelectedEbook(null)} // Close form when user cancels
            />
          </div>
        </div>
      )}

      {/* Show Checkout Form after clientSecret is received */}
      {clientSecret && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CheckoutForm
                onSuccess={() => {
                  toast.success("Payment successful!");
                  setClientSecret(""); // Reset clientSecret after success
                  setSelectedEbook(null); // Reset selected ebook
                  setCheckoutData(null); // Reset checkout data
                }}
                clientSecret={clientSecret}
                checkoutData={checkoutData} // Pass the form data and ebook for payment verification
              />
            </Elements>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default LandingPage;
