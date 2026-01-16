import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchSubProductsByProduct, fetchPublicProduct } from "../api/products";
import ContactForm from "./ContactForm";

const BACKEND_URL = "http://localhost:8000";

export default function SubProductDetail() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [subProducts, setSubProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    // Fetch main product
    fetchPublicProduct(productId)
      .then((res) => setProduct(res || null))
      .catch(() => setProduct(null));

    // Fetch sub-products
    fetchSubProductsByProduct(productId)
      .then((res) => setSubProducts(res.data?.data || []))
      .catch(() => setSubProducts([]))
      .finally(() => setLoading(false));
  }, [productId]);

  if (loading)
    return (
      <section className="max-w-8xl mx-auto px-6 py-10">
        <p>Loading product and sub-products...</p>
      </section>
    );
  const productImage = product?.image
    ? `${BACKEND_URL}/storage/${product.image}`
    : "/images/placeholder-product.png";

  return (
    <section className="max-w-6xl mx-auto px-6 py-12">
      {/* ================= Header / Intro ================= */}
      {product && (
        <header className="mb-16 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* -------- Product Image -------- */}
          <img
            src={product.image_url || productImage}
            alt={product.title || product.name}
            className="w-full h-[420px] object-cover rounded-3xl shadow-lg"
          />

          {/* -------- Product Content -------- */}
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
              {product.title || product.name}
            </h1>

            <p className="mt-4 text-lg text-gray-600 max-w-xl">
              {product.short_description ||
                "Discover a complete range of carefully designed sub-products that extend the capabilities of this product."}
            </p>

            <div className="mt-6 space-y-4 text-gray-700 leading-relaxed">
              <p>
                {product.description ||
                  "This product is crafted to meet high standards of quality, performance, and usability."}
              </p>

              <p>
                Each sub-product is optimized to complement the main product and
                integrate seamlessly into your workflow.
              </p>

              <p>
                Built with durability and precision, ensuring long-term
                reliability in real-world use cases.
              </p>

              <p>
                Suitable for professional, commercial, and everyday
                environments.
              </p>

              <p>
                Browse the available sub-products below to find the perfect
                match.
              </p>
            </div>

            {product.category?.name && (
              <p className="mt-6 text-sm text-gray-500">
                Category:{" "}
                <span className="font-semibold">{product.category.name}</span>
              </p>
            )}
          </div>
        </header>
      )}

      {/* ================= Sub-product Title ================= */}
      <div className="mb-8">
        {/* Header */}
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Software for {product?.name || product?.title}
        </h2>

        {/* Optional paragraph */}
        <p className="text-gray-600 dark:text-gray-300">
          Explore the available options for {product?.name || product?.title}.
          Click on a service to see more details or purchase.
        </p>
      </div>

      {/* ================= Sub-products List ================= */}
      {subProducts.length > 0 ? (
        <div className="space-y-6">
          {subProducts.map((sub) => {
            const primaryImage =
              sub.images?.find((i) => i.is_primary) || sub.images?.[0];

            const imageUrl = primaryImage
              ? `${BACKEND_URL}/storage/${primaryImage.image_path}`
              : "/images/placeholder-product.png";

            return (
              <Link
                key={sub.id}
                to={`/sub-products/${sub.id}`}
                className="block rounded-2xl bg-white shadow-sm hover:shadow-xl transition-all duration-300 p-5"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  <img
                    src={imageUrl}
                    alt={sub.name}
                    className="w-full md:w-40 h-40 object-cover rounded-xl"
                  />

                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900">
                      {sub.name}
                    </h3>

                    <p className="mt-2 text-gray-600 leading-relaxed">
                      {sub.description ||
                        "This sub-product enhances the core product with additional features and optimized performance."}
                    </p>

                    {sub.properties?.length > 0 && (
                      <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700">
                        {sub.properties.map((prop) => (
                          <li key={prop.key}>
                            <span className="font-semibold">{prop.key}:</span>{" "}
                            {prop.value}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-500">No sub-products available.</p>
      )}
      <ContactForm
        title={`Questions about ${product?.name || product?.title}?`}
        description={`If you have any questions about ${
          product?.name || product?.title
        } or its sub-products, send us a message below.`}
      />
    </section>
  );
}
