import React, { useState } from "react";
import { Link } from "react-router-dom";

const EbookCard = ({ ebook, onBuy }) => {
  const [showFull, setShowFull] = useState(false);
  const toggleDescription = () => setShowFull((prev) => !prev);

  const shortDescription =
    ebook.description.length > 100
      ? ebook.description.slice(0, 100) + "..."
      : ebook.description;

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <Link to={`/ebook/${ebook._id}`}>
        <img
          src={ebook.imageUrl}
          alt={ebook.title}
          className="w-full h-48 object-cover rounded"
        />
        <h2 className="text-xl font-bold mt-2">{ebook.title}</h2>
      </Link>

      <p className="text-gray-600">
        {showFull ? ebook.description : shortDescription}
      </p>
      {ebook.description.length > 100 && (
        <button
          onClick={toggleDescription}
          className="text-blue-500 text-sm mt-1 hover:underline"
        >
          {showFull ? "Show Less" : "Show More"}
        </button>
      )}

      <p className="text-lg font-semibold mt-2">Price: ₹{ebook.price}</p>
      <button
        onClick={onBuy}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Buy Now
      </button>
    </div>
  );
};

export default EbookCard;
