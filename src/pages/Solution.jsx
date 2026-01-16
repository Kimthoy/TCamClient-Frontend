import React, { useEffect, useState } from "react";
import { fetchSolutionBanners, fetchPublicProducts } from "../api/products";
import { fetchServices } from "../api/home";
import { fetchPublicIndustries } from "../api/industry";
import Banner from "../components/Banner";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ProductList from "../components/Product";

const fallbackBanner = {
  title: "Our Solutions",
  subtitle: "Tailored for modern businesses",
  image_url:
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=2400&q=85",
};

function SolutionHero() {
  return (
    <Banner fetchData={fetchSolutionBanners} fallbackTitle="Solution page" />
  );
}

function ProductCard({ product }) {
  return (
    <motion.div
      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-4 flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <img
        src={product.feature_image_url || "/images/placeholder-product.png"}
        alt={product.title}
        className="rounded-xl h-48 w-full object-cover mb-4 hover:scale-105 transition-transform duration-500"
      />
      <h3 className="text-lg font-bold text-gray-900 mb-2">{product.title}</h3>
      <p className="text-gray-600 text-sm line-clamp-3 mb-4">
        {product.short_description ||
          "Advanced enterprise solution for modern businesses."}
      </p>
      <Link
        to={product.website_link || "#"}
        className="mt-auto flex w-32 text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-full text-sm font-semibold transition"
      >
        Visit Website
      </Link>
    </motion.div>
  );
}

function ServiceCard({ service }) {
  return (
    <motion.div
      className="bg-transparent  overflow-hidden flex flex-col transition"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <img
        src={
          service.image_url ||
          service.feature_image_url ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            service.title || "Service"
          )}&background=ecfdf5&color=065f46&size=400`
        }
        alt={service.title}
        className="w-full h-40 object-cover"
      />
      <div className="p-4 flex flex-col flex-grow">
        <h4 className="text-gray-900 font-bold mb-2">{service.title}</h4>
        <p className="text-gray-600 text-sm line-clamp-3">
          {service.description || "Short description of the service."}
        </p>
      </div>
    </motion.div>
  );
}
function SolutionByIndustry({ industries }) {
  if (!Array.isArray(industries)) return null;

  const activeIndustries = industries
    .filter((ind) => ind.status)
    .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

  // Define some random gradient classes
  const gradients = [
    "from-blue-400 to-indigo-500",
    "from-green-400 to-teal-500",
    "from-purple-400 to-pink-500",
    "from-yellow-400 to-orange-500",
    "from-red-400 to-pink-500",
    "from-cyan-400 to-blue-500",
  ];

  const getRandomGradient = () =>
    gradients[Math.floor(Math.random() * gradients.length)];

  return (
    <section className="py-20 bg-gradient-to-r from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-10">
          Solutions by Industry
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeIndustries.map((ind, idx) => {
            const solutions = Array.isArray(ind.solutions) ? ind.solutions : [];
            const gradientClasses = ind.gradient || getRandomGradient();

            return (
              <motion.div
                key={idx}
                className="bg-white rounded-3xl shadow-md hover:shadow-xl transition overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.8,
                  ease: "easeInOut",
                  delay: idx * 0.1,
                }}
              >
                <div
                  className={`h-28 flex items-center justify-center text-white text-xl font-bold bg-gradient-to-r ${gradientClasses}`}
                >
                  {ind.industry_name}
                </div>
                {ind.industry_description && (
                  <p className="p-4 text-gray-600 text-sm">
                    {ind.industry_description}
                  </p>
                )}
                <div className="p-6">
                  <ul className="space-y-2">
                    {solutions.map((sol, i) => (
                      <li key={i} className="flex flex-col gap-1 text-gray-700">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-blue-600" />
                          <span className="font-semibold">{sol.title}</span>
                        </div>
                        {sol.description && (
                          <p className="ml-5 text-sm text-gray-500">
                            {sol.description}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
      
    </section>
  );
}

export default function Solution() {
  const [services, setServices] = useState({ loading: true, data: [] });
  const [productsPage, setProductsPage] = useState(null);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [industries, setIndustries] = useState([]);
  const [pageNum, setPageNum] = useState(1);

  useEffect(() => {
    let mounted = true;

    // Fetch services
    fetchServices()
      .then((res) => {
        const data = Array.isArray(res?.data) ? res.data : [];
        if (mounted) setServices({ loading: false, data });
      })
      .catch(() => mounted && setServices({ loading: false, data: [] }));

    // Fetch products
    fetchPublicProducts({ per_page: 9, page: pageNum })
      .then((data) => mounted && setProductsPage(data))
      .catch(() => mounted && setProductsPage(null))
      .finally(() => mounted && setLoadingProducts(false));

    // Fetch industries
    fetchPublicIndustries()
      .then((data) => {
        if (mounted) setIndustries(data);
      })
      .catch(() => mounted && setIndustries([]));

    return () => (mounted = false);
  }, [pageNum]);

  return (
    <div className="min-h-screen bg-gray-50">
      <SolutionHero />

      <main className="max-w-7xl mx-auto px-6 py-24">
        {/* Services */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Our Solutions
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="p-4 bg-gray-100 rounded-xl animate-pulse h-60"
                  />
                ))
              : services.data.map((s) => (
                  <ServiceCard key={s.id} service={s} />
                ))}
          </div>
        </section>

        {/* Products */}
        <ProductList perPage={9} />

        {/* Industries */}
        {industries.length > 0 && (
          <SolutionByIndustry industries={industries} />
        )}
      </main>
    </div>
  );
}
