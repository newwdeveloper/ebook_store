// src/pages/LandingPage.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import EbookCard from "../components/EbookCard";
import BuyForm from "../components/BuyForm";
import CheckoutForm from "../components/CheckoutForm";
import { ToastContainer, toast } from "react-toastify";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { ClipLoader } from "react-spinners";
import "react-toastify/dist/ReactToastify.css";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const LandingPage = () => {
  const [ebooks, setEbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEbook, setSelectedEbook] = useState(null);
  const [clientSecret, setClientSecret] = useState("");
  const [checkoutData, setCheckoutData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ebooksPerPage = 9;

  useEffect(() => {
    axios
      .get("https://ebook-store-backend.onrender.com/api/ebooks")
      .then((res) => setEbooks(res.data))
      .catch(() => toast.error("Failed to load ebooks"))
      .finally(() => setLoading(false));
  }, []);

  const handleBuy = async (formData) => {
    try {
      const res = await axios.post(
        "https://ebook-store-backend.onrender.com/api/payment/create",
        { amount: selectedEbook.price }
      );
      setClientSecret(res.data.clientSecret);
      setCheckoutData({ formData, ebook: selectedEbook });
    } catch (err) {
      toast.error("Stripe payment failed.");
    }
  };

  const totalPages = Math.ceil(ebooks.length / ebooksPerPage);
  const indexOfLastEbook = currentPage * ebooksPerPage;
  const indexOfFirstEbook = indexOfLastEbook - ebooksPerPage;
  const currentEbooks = ebooks.slice(indexOfFirstEbook, indexOfLastEbook);

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handlePageClick = (num) => setCurrentPage(num);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center text-blue-600 mb-10">
        📚 Ebook Store
      </h1>

      {loading ? (
        <div className="flex justify-center items-center h-72">
          <ClipLoader size={50} color="#3B82F6" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentEbooks.map((ebook) => (
              <EbookCard
                key={ebook._id}
                ebook={ebook}
                onBuy={() => setSelectedEbook(ebook)}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-wrap justify-center items-center gap-2 mt-10">
              <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm font-medium bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
              >
                Prev
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageClick(i + 1)}
                  className={`px-4 py-2 text-sm rounded font-medium transition-all duration-150 ${
                    currentPage === i + 1
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 hover:bg-gray-300"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-sm font-medium bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Buy Form Modal */}
      {selectedEbook && !clientSecret && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <BuyForm
              ebook={selectedEbook}
              onSubmit={handleBuy}
              onClose={() => setSelectedEbook(null)}
            />
          </div>
        </div>
      )}

      {/* Stripe Checkout Modal */}
      {clientSecret && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CheckoutForm
                onSuccess={() => {
                  toast.success("Payment successful!");
                  setClientSecret("");
                  setSelectedEbook(null);
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

export default LandingPage;
