// src/lib/api.js
import axios from "axios";

// Axios instance for backend requests
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
  timeout: 8000,
});

// Fetch products from the backend API
export async function fetchProducts(params) {
  const { data } = await api.get("/api/products", { params });
  if (Array.isArray(data)) return data;                
  if (Array.isArray(data?.products)) return data.products;
  return [];
}