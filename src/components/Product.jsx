// src/components/Product.jsx
import React, { useState, useEffect } from "react";
import {
  fetchPublicProducts,
  fetchSubProductsByProduct,
} from "../api/products";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;


// ---------------- Product Card ----------------
export function ProductCard({ product }) {
  const navigate = useNavigate();

  return (
    <motion.div
      className="bg-white transition p-4 m-5 flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      {/* Product Image */}
      <img
        src={product.feature_image_url || ""}
        alt={product.title}
        className="rounded-xl h-48 w-full object-cover mb-4 hover:scale-105 transition-transform duration-500"
      />

      {/* Product Info */}
      <h3 className="text-lg font-bold text-gray-900 mb-2">{product.title}</h3>
      <p className="text-gray-600 text-sm line-clamp-3 mb-4">
        {product.short_description ||
          "Advanced enterprise solution for modern businesses."}
      </p>
      <p className="text-gray-600 text-sm line-clamp-3 mb-4">
        {product.description ||
          "Advanced enterprise solution for modern businesses."}
      </p>

      {/* Navigate to Sub-products page */}
      <button
        onClick={() => navigate(`/products/${product.id}/sub-products`)}
        className="mt-auto cursor-pointer flex w-full items-center justify-center group text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-full text-sm font-semibold transition"
      >
        View Details
        <ArrowRight className="ml-2 h-4 w-4 animate-pulse transition-transform duration-300 ease-in-out group-hover:translate-x-1" />
      </button>
    </motion.div>
  );
}

// ---------------- Product List ----------------
export default function ProductList({ perPage = 9 }) {
  const [productsPage, setProductsPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pageNum, setPageNum] = useState(1);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    fetchPublicProducts({ per_page: perPage, page: pageNum })
      .then((data) => mounted && setProductsPage(data))
      .catch(() => mounted && setProductsPage(null))
      .finally(() => mounted && setLoading(false));

    return () => (mounted = false);
  }, [pageNum, perPage]);

  const nextPage = () => setPageNum((prev) => prev + 1);
  const prevPage = () => setPageNum((prev) => Math.max(prev - 1, 1));

  return (
    <section className="mt-20 max-w-7xl mx-auto px-6">
      <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
        Our Products
      </h2>

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: perPage }).map((_, i) => (
            <div key={i} className="p-4 bg-transparent animate-pulse h-72" />
          ))}
        </div>
      ) : productsPage?.data?.length ? (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {productsPage.data.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          {/* Pagination */}
        </>
      ) : (
        <p className="text-center text-gray-500 py-20">
          No products available.
        </p>
      )}
    </section>
  );
}
