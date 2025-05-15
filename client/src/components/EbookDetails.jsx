import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import BuyForm from "../components/BuyForm";
import { ToastContainer, toast } from "react-toastify";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../components/CheckoutForm";
import { ArrowLeft } from "lucide-react";
import { ClipLoader } from "react-spinners";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const EbookDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ebook, setEbook] = useState(null);
  const [showBuyForm, setShowBuyForm] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [checkoutData, setCheckoutData] = useState(null);

  useEffect(() => {
    axios
      .get(`https://ebook-store-backend.onrender.com/api/ebooks/${id}`)
      .then((res) => setEbook(res.data))
      .catch(() => toast.error("Failed to fetch ebook details"));
  }, [id]);

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

  if (!ebook) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader color="#3B82F6" size={50} />
      </div>
    );
  }

  return (
    <div className="px-6 py-8 max-w-5xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6 font-semibold"
      >
        <ArrowLeft size={22} />
        <span>Back to Home</span>
      </button>

      {/* Main Content */}
      <div className="bg-white border rounded-2xl p-6 md:flex md:gap-10 shadow-md">
        {/* Book Cover */}
        <div className="md:w-1/3 w-full flex justify-center items-start">
          <div className="group w-full max-w-xs">
            <img
              src={ebook.imageUrl}
              alt={ebook.title}
              className="rounded-xl border border-gray-200 shadow-md w-full object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </div>

        {/* Details */}
        <div className="mt-6 md:mt-0 md:w-2/3 flex flex-col justify-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            {ebook.title}
          </h1>

          <p className="mt-4 text-gray-700 leading-relaxed whitespace-pre-line text-lg">
            {ebook.description}
          </p>

          <p className="mt-6 text-2xl font-bold text-green-700">
            ₹{ebook.price}
          </p>

          <button
            onClick={() => setShowBuyForm(true)}
            className="mt-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-transform transform hover:scale-105 active:scale-95"
          >
            Buy Now
          </button>
        </div>
      </div>

      {/* Buy Form Modal */}
      {showBuyForm && !clientSecret && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <BuyForm
              ebook={ebook}
              onSubmit={handleBuy}
              onClose={() => setShowBuyForm(false)}
            />
          </div>
        </div>
      )}

      {/* Stripe Checkout Modal */}
      {clientSecret && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
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
