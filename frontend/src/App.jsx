// src/App.jsx
import { useEffect, useState } from "react";
import { fetchProducts } from "./lib/api";
import Filters from "./components/Filters";
import ProductCarousel from "./components/ProductCarousel";

export default function App() {
    // --- Application state ---
  const [list, setList] = useState(null);         
  const [sort, setSort] = useState("");
  const [range, setRange] = useState([0, 2000]); 
  const [useRange, setUseRange] = useState(false); 
  const [hydrated, setHydrated] = useState(false);

  // --- Read filters from URL on initial mount ---
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const s = p.get("sort");
    const minStr = p.get("minPrice");
    const maxStr = p.get("maxPrice");

    if (s) {
      // If sort parameter exists → activate sorting only
      setSort(s);
      setUseRange(false);
    } else if (minStr !== null && maxStr !== null) {
      // If min & max price exist → activate range filter
      const min = Number(minStr);
      const max = Number(maxStr);
      if (Number.isFinite(min) && Number.isFinite(max) && min <= max) {
        setRange([min, max]);
        setUseRange(true);
      }
    }
    setHydrated(true);
  }, []);

  // --- Sync filter state to URL query parameters ---
  useEffect(() => {
    if (!hydrated) return;
    const p = new URLSearchParams();
    if (useRange) {
      p.set("minPrice", range[0]);
      p.set("maxPrice", range[1]);
    } else if (sort) {
      p.set("sort", sort);
    }
    const qs = p.toString();
    window.history.replaceState({}, "", qs ? `?${qs}` : window.location.pathname);
  }, [hydrated, sort, range, useRange]);

  // --- Fetch products from backend API ---
  useEffect(() => {
    if (!hydrated) return;
    const params = {};
    if (useRange) {
      params.minPrice = range[0];
      params.maxPrice = range[1];
    } else if (sort) {
      params.sort = sort;
    }
    fetchProducts(params)
      .then((data) => setList(Array.isArray(data) ? data : data?.products ?? []))
      .catch((e) => { console.error(e); setList([]); });
  }, [hydrated, sort, range, useRange]);

  // --- Reset all filters and reload default product list ---
  const reset = () => {
    setSort("");
    setRange([0, 2000]);
    setUseRange(false);
    window.history.replaceState({}, "", window.location.pathname);
    fetchProducts().then((data) => setList(Array.isArray(data) ? data : data?.products ?? []));
  };

  // --- Loading state before initial fetch ---
  if (!list) return <div className="p-4">Loading…</div>;

  return (
    <div className="min-h-screen bg-white text-black px-6 pt-24 pb-10">
      {/* Header Section */}
      <div className="relative">
        <h1 className="font-['Avenir'] text-[45px] text-center">Product List</h1>

        {/* Filter & Reset controls */}
        <div className="absolute inset-y-0 right-16 flex items-center gap-3">
          <Filters
            sort={sort} setSort={setSort}
            range={range} setRange={setRange}
            useRange={useRange} setUseRange={setUseRange}
          />
          <button onClick={reset} className="border rounded-xl px-3 py-2 text-sm hover:bg-gray-50">
            Reset Filters
          </button>
        </div>
      </div>
      {/* Product list or empty state */}
      {list.length === 0 ? (
        <div className="mt-10 text-center text-gray-500 text-base font-medium">
          No products found
        </div>
      ) : (
        <ProductCarousel products={list} />
      )}
    </div>
  );
}
