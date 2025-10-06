// src/products.service.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { getGoldPriceUSDPerGram } from "./goldPrice.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Convert 0–1 popularity score to a 0–5 scale with one decimal
function normalizePopularity(score) {
  return Math.round(Number(score) * 5 * 10) / 10;
}

export async function getProducts(filters = {}) {
  const { minPrice, maxPrice, minPopularity } = filters;

  // Get live gold price (USD/gram)
  const goldPrice = await getGoldPriceUSDPerGram();

  // Read products.json asynchronously
  const filePath = path.join(__dirname, "..", "products.json");
  const productsRaw = await fs.promises.readFile(filePath, "utf-8");
  const products = JSON.parse(productsRaw);

  // Map & compute price
  const mapped = products.map(({ name, popularityScore, weight, images }) => {
    const price = (Number(popularityScore) + 1) * Number(weight) * goldPrice;
    return {
      name,
      images,
      weight,
      popularityScore,
      popularityOutOf5: normalizePopularity(popularityScore),
      priceUSD: Number(price.toFixed(2)),
      goldPriceUSDPerGram: Number(goldPrice.toFixed(4))
    };
  });

  // Apply filters
  let result = mapped;
  if (minPrice !== undefined) result = result.filter(p => p.priceUSD >= minPrice);
  if (maxPrice !== undefined) result = result.filter(p => p.priceUSD <= maxPrice);

    if (filters.sort) {
    if (filters.sort === "priceAsc") {
      result.sort((a, b) => a.priceUSD - b.priceUSD);
    } else if (filters.sort === "priceDesc") {
      result.sort((a, b) => b.priceUSD - a.priceUSD);
    } else if (filters.sort === "popularityDesc") {
      result.sort((a, b) => b.popularityOutOf5 - a.popularityOutOf5);
    }
  }
  return { count: result.length, products: result };
}
