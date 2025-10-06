# Fullstack Products — Case Study

---

## Overview

* **Frontend:** React (Vite) + Axios
* **Backend:** Node.js (Express), Axios
* **Infra:** Vercel (FE), Render (BE)
* **Caching:** 5‑minute TTL (default **300s**) for gold price based computations
* **CORS:** Allowed origins are controlled via env.

The backend fetches live gold price data (MetalPriceAPI) to compute product prices and caches results to reduce external API calls.

---


##  Features

* Dynamic pricing: Product prices are computed from the live gold price (with a 5‑minute cache).
* Unified Sort & Filter menu: A single dropdown combines sorting and price filtering; the button label reflects the active state (e.g., Price Range • $120–$680).
* Sorting options: Most Popular (popularityDesc), Price: Low to High (priceAsc), Price: High to Low (priceDesc).
* Price range filter: Interactive slider (0–2000 USD, step 10) with live min/max readouts for precise control.
* Smart exclusivity: Moving the slider enables range filtering and clears any sort; picking a sort disables range filtering.

---


##  Author

**İrem Köstereli**

---

