// src/goldPrice.js
import axios from "axios";

const OUNCE_TO_GRAM = 31.1034768;

// In-memory cache for the last fetched price
let cached = { value: null, expiresAt: 0 };

export async function getGoldPriceUSDPerGram() {
  try {
    // Defines cache duration in seconds. Currently set to 300 (5 minutes)
    const ttlSec = Number(process.env.GOLD_CACHE_TTL_SECONDS || 300);
    const now = Date.now();
    if (cached.value && now < cached.expiresAt) return cached.value;

    // Load provider settings from environment
    // Gold price fetched from MetalPriceAPI
    const base = (process.env.MPA_BASE);
    const key = process.env.MPA_API_KEY || process.env.MPA_API_KEY_FALLBACK;
    
    if (!key) {
      throw new Error("Missing API key for external service");
    }

    // Request current USD→XAU rate
    const url = `${base}/v1/latest?api_key=${encodeURIComponent(key)}&base=USD&currencies=XAU`;
    const { data } = await axios.get(url, {
      timeout: 8000
    });

    const rateUsdToXau = data?.rates?.XAU;
    if (!rateUsdToXau || !Number.isFinite(rateUsdToXau)) {
      throw new Error("MetalpriceAPI: XAU rate missing/invalid");
    }

    // Invert USD→XAU to get USD per troy ounce, then convert to USD per gram
    const usdPerOunce = 1 / Number(rateUsdToXau);
    const usdPerGram  = usdPerOunce / OUNCE_TO_GRAM;

    if (!Number.isFinite(usdPerGram)) {
      throw new Error("MetalpriceAPI: invalid gram price");
    }

    // Update in-memory cache with value and expiry
    cached.value = usdPerGram;
    cached.expiresAt = now + ttlSec * 1000;

    return usdPerGram;
  } catch (err) {
    console.error("Gold price API error:", err.message);
    throw err;
  }
}
