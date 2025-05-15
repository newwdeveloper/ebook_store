import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import BuyForm from "../components/BuyForm";
import { ToastContainer, toast } from "react-toastify";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../components/CheckoutForm";
import { ArrowLeft } from "lucide-react";

// Load Stripe key
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

  if (!ebook) return <div className="p-4 text-center">Loading...</div>;

  return (
    <div className="px-4 py-6 max-w-4xl mx-auto">
      {/* Home Button */}
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4"
      >
        <ArrowLeft size={20} />
        <span>Back to Home</span>
      </button>

      {/* Main Content */}
      <div className="bg-white shadow-lg rounded-xl p-6 md:flex md:gap-6">
        <img
          src={ebook.imageUrl}
          alt={ebook.title}
          className="w-full md:w-1/3 h-64 object-cover rounded-lg"
        />

        <div className="mt-4 md:mt-0 md:w-2/3">
          <h1 className="text-3xl font-bold text-gray-800">{ebook.title}</h1>
          <p className="mt-3 text-gray-600 leading-relaxed">
            {ebook.description}
          </p>
          <p className="mt-4 text-lg font-semibold text-green-700">
            ₹{ebook.price}
          </p>

          <button
            onClick={() => setShowBuyForm(true)}
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition duration-300"
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
