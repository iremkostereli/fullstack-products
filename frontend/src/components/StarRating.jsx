// src/components/StarRating.jsx
import { Rating, Star } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";

// Displays a read-only star rating with half-star precision
const myStyles = {
  itemShapes: Star,
  activeFillColor: "#FED7AA",   
  inactiveFillColor: "#D4D4D4", 
};

export default function StarRating({ score = 0, max = 5, className = "" }) {
  return (
    <div className={`flex items-center ${className}`}>
      <Rating
        style={{ maxWidth: 114, marginLeft: "-3px" }}
        value={score}
        readOnly                    
        itemStyles={myStyles}
        items={max}
        fractions={2}             
      />
      <span className="ml-2 text-[14px] font-['Avenir'] font-normal">
        {score.toFixed(1)}/{max}
      </span>
    </div>
  );
}
