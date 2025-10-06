// src/components/ProductCarousel.jsx
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, A11y, Keyboard, Scrollbar } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/scrollbar";
import ProductCard from "./ProductCard";

// Renders a responsive product carousel using Swiper.js
export default function ProductCarousel({ products }) {
  return (
    <Swiper
      modules={[Navigation, A11y, Keyboard, Scrollbar]}
      navigation
      keyboard={{ enabled: true }}
      grabCursor
      spaceBetween={24}
      scrollbar={{ draggable: true, hide: false }}
      slidesPerView="auto"
      breakpoints={{
        640: { slidesPerView: 2, spaceBetween: 20 },
        1024: { slidesPerView: 3, spaceBetween: 24 },
        1280: { slidesPerView: 4, spaceBetween: 45 },
      }}
    >
      {products.map((p, i) => (
        <SwiperSlide key={i}>
          <ProductCard product={p} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
