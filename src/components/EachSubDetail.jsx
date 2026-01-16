import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import fetchSubProduct from "../api/subProductService";
import { motion } from "framer-motion";
import { ArrowLeft, Package, BadgeDollarSign, Info } from "lucide-react";

const BACKEND_URL = "http://localhost:8000";

export default function EachSubDetail() {
  const { subProductId } = useParams();
  const navigate = useNavigate();

  const [subProduct, setSubProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchSubProduct(subProductId)
      .then((res) => setSubProduct(res.data || null))
      .catch(() => setSubProduct(null))
      .finally(() => setLoading(false));
  }, [subProductId]);

  /* ---------- Loading ---------- */
  if (loading) {
    return (
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <p className="text-gray-500 animate-pulse">
          Loading product information…
        </p>
      </section>
    );
  }

  /* ---------- Not Found ---------- */
  if (!subProduct) {
    return (
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h1 className="text-2xl font-bold text-red-600">
          Sub-product not found
        </h1>
        <p className="mt-2 text-gray-600">
          The product you are looking for may have been removed or is
          unavailable.
        </p>

        <button
          onClick={() => navigate(-1)}
          className="mt-6 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full transition"
        >
          <ArrowLeft size={18} />
          Go Back
        </button>
      </section>
    );
  }

  const primaryImage =
    subProduct.images?.find((i) => i.is_primary) || subProduct.images?.[0];

  const imageUrl = primaryImage
    ? `${BACKEND_URL}/storage/${primaryImage.image_path}`
    : "/images/placeholder-product.png";

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gray-50"
    >
      {/* ================= HERO HEADER ================= */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <Link
            to={`/products/${subProduct.product_id}/sub-products`}
            className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-6"
          >
            <ArrowLeft size={18} />
            Back to Sub-products
          </Link>

          {/* H1 */}
          <h1 className="text-4xl md:text-5xl font-extrabold flex items-center gap-3">
            <Package />
            {subProduct.name}
          </h1>

          {/* Paragraph */}
          <p className="mt-4 max-w-3xl text-lg text-white/90">
            {subProduct.description ||
              "A high-quality sub-product engineered to meet modern professional and industrial standards."}
          </p>
        </div>
      </header>

      {/* ================= MAIN CONTENT ================= */}
      <main className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12">
        {/* ---------- Image Section ---------- */}
        <motion.figure
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <img
            src={imageUrl}
            alt={subProduct.name}
            className="w-full h-[420px] object-cover rounded-3xl shadow-lg"
          />
        </motion.figure>

        {/* ---------- Details Section ---------- */}
        <motion.article
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          

          {/* H2 */}
          <h2 className="mt-8 text-2xl font-bold text-gray-900">
            Product Overview
          </h2>

          {/* Paragraph */}
          <p className="mt-3 text-gray-700 leading-relaxed">
            {subProduct.description ||
              "This sub-product is built with precision and reliability in mind, offering dependable performance and consistent quality across various applications."}
          </p>

          {/* H3 */}
          {subProduct.properties?.length > 0 && (
            <section className="mt-10">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2 mb-4">
                <Info size={20} />
                Technical Specifications
              </h3>

              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">
                {subProduct.properties.map((prop) => (
                  <li
                    key={prop.key}
                    className="bg-white rounded-xl border px-4 py-3"
                  >
                    <strong className="uppercase">{prop.key}:</strong>{" "}
                    {prop.value}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </motion.article>
      </main>
    </motion.section>
  );
}
