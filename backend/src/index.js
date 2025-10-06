// src/index.js
import 'dotenv/config';
import express from "express";
import cors from "cors";
import { getProducts } from "./products.service.js";

const app = express();

// --- CORS ---
const allowedOrigins = [process.env.CORS_ORIGIN];

app.use(cors({
  origin: process.env.CORS_ORIGIN
}));

app.use(express.json());

// Health check
app.get("/api/health", (req, res) => {
  res.json({ ok: true, service: "products-backend" });
});

// Products endpoint
app.get("/api/products", async (req, res) => {
  try {
    const { minPrice, maxPrice, minPopularity, sort } = req.query;

    const filters = {
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      minPopularity: minPopularity ? Number(minPopularity) : undefined,
      sort: typeof sort === "string" ? sort : undefined
    };

    const result = await getProducts(filters);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// --- PORT ---
const port = process.env.PORT;
app.listen(port, () => {
  console.log(` Server running on port ${port}`);
});

