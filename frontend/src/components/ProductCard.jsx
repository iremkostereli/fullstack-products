// src/components/ProductCard.jsx
import { useState } from "react";
import StarRating from "./StarRating";

// Displays product details with image, color selector, price and rating
export default function ProductCard({ product }) {

  const [color, setColor] = useState("yellow");
  const colorLabels = {
    yellow: "Yellow Gold",
    white: "White Gold",
    rose: "Rose Gold"
  };

  const img =
    product?.images?.[color] ||
    product?.images?.yellow ||
    product?.images?.white ||
    product?.images?.rose;

  return (
    <div className="rounded-2xl p-16">
      <div className="aspect-square rounded-xl overflow-hidden mb-3 bg-neutral-50">
        <img src={img} alt={product?.name} className="w-full h-full object-cover" />
      </div>
      
      <div className="text-[15px] font-medium font-['Montserrat']">
        {product?.name}
      </div>

      <div className="text-[15px] font-normal font-['Montserrat'] mb-3">
        {product?.priceUSD != null ? `$${Number(product.priceUSD).toFixed(2)} USD` : "-"}
      </div>

      <div className="flex gap-2 mb-3">
        {["yellow", "white", "rose"].map(c => (
          <button
            key={c}
            onClick={() => setColor(c)}
            className={`w-5 h-5 rounded-full ${
              color === c ? "ring-1 ring-black ring-offset-3" : ""
            }`}
            title={colorLabels[c]}
            style={{
              background:
                c === "yellow" ? "#E6CA97" : c === "white" ? "#D9D9D9" : "#E1A4A9"
            }}
          />
        ))}
      </div>

      <div className="text-[12px] font-['Avenir'] font-normal mb-1">
        {colorLabels[color]}
      </div>

      <StarRating score={product?.popularityOutOf5 || 0} />

    </div>
  );
}
