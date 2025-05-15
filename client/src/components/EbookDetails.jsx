import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import BuyForm from "../components/BuyForm";
import { ToastContainer, toast } from "react-toastify";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../components/CheckoutForm";

// Load Stripe key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const EbookDetailsPage = () => {
  const { id } = useParams();
  console.log("Ebook ID:", id);
  const [ebook, setEbook] = useState(null);
  const [showBuyForm, setShowBuyForm] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [checkoutData, setCheckoutData] = useState(null);

  // Fetch ebook details
  useEffect(() => {
    axios
      .get(`https://ebook-store-backend.onrender.com/api/ebooks/${id}`)
      .then((res) => setEbook(res.data))
      .catch(() => toast.error("Failed to fetch ebook details"));
  }, [id]);

  // Handle purchase flow
  const handleBuy = async (formData) => {
    try {
      const res = await axios.post(
        "https://ebook-store-backend.onrender.com/api/payment/create",
        {
          amount: ebook.price,
        }
      );
      setClientSecret(res.data.clientSecret);
      setCheckoutData({ formData, ebook });
    } catch (err) {
      toast.error("Stripe payment failed.");
    }
  };

  if (!ebook) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <img
        src={ebook.imageUrl}
        alt={ebook.title}
        className="w-full h-64 object-cover rounded"
      />
      <h1 className="text-3xl font-bold mt-4">{ebook.title}</h1>
      <p className="mt-2 text-gray-700">{ebook.description}</p>
      <p className="mt-4 font-semibold text-lg">Price: ₹{ebook.price}</p>

      <button
        onClick={() => setShowBuyForm(true)}
        className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Buy Now
      </button>

      {/* Show BuyForm */}
      {showBuyForm && !clientSecret && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <BuyForm
              ebook={ebook}
              onSubmit={handleBuy}
              onClose={() => setShowBuyForm(false)}
            />
          </div>
        </div>
      )}

      {/* Show Stripe Checkout */}
      {clientSecret && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CheckoutForm
                onSuccess={() => {
                  toast.success("Payment successful!");
                  setClientSecret("");
                  setShowBuyForm(false);
                  setCheckoutData(null);
                }}
                clientSecret={clientSecret}
                checkoutData={checkoutData}
              />
            </Elements>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default EbookDetailsPage;
