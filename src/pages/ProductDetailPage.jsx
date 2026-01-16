// src/pages/ProductDetailPage.jsx
import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Zap,
  Shield,
  Globe,
  Users,
  Cpu,
  CheckCircle,
  ChevronRight,
} from "lucide-react";
import { fetchPublicProducts } from "../api/products";

// Reuse exact same brightness analyzer
function analyzeImageBrightness(imgElement) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = imgElement.naturalWidth;
  canvas.height = imgElement.naturalHeight;
  ctx.drawImage(imgElement, 0, 0);

  const centerX = Math.floor(canvas.width / 2);
  const centerY = Math.floor(canvas.height / 2);
  const size = 20;

  try {
    const data = ctx.getImageData(
      centerX - size / 2,
      centerY - size / 2,
      size,
      size
    ).data;
    let colorSum = 0;
    const pixelCount = size * size;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
      colorSum += luminance;
    }
    return colorSum / pixelCount < 128;
  } catch (error) {
    console.warn("Could not analyze image brightness:", error);
    return true;
  }
}

// Same global styles as ProductPage
const GLOBAL_STYLES = `
  .hero-parallax { will-change: transform; transition: transform 0.1s linear; }
  .hero-overlay {
    background: linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0.3) 50%, transparent);
  }
  .hero-overlay--light {
    background: linear-gradient(to top, rgba(0,0,0,0.65), rgba(0,0,0,0.2) 50%, transparent);
  }
  .title-shadow { text-shadow: 0 4px 12px rgba(0, 0, 0, 0.6); }
  .title-shadow-strong { text-shadow: 0 6px 16px rgba(0, 0, 0, 0.9); }
  .title-stroke--light {
    color: white;
    -webkit-text-stroke: 1.5px #10b981;
    text-stroke: 1.5px #10b981;
    text-shadow: 0 0 10px rgba(0,0,0,0.3);
  }
  .style-pill {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 9999px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  .style-pill button {
    padding: 0.5rem 1rem;
    color: white;
    font-size: 0.875rem;
    font-weight: 500;
    border-radius: 9999px;
    transition: background-color 0.2s;
  }
  .style-pill button:hover { background: rgba(255, 255, 255, 0.2); }
  .style-pill button.active { background: white; color: #059669; box-shadow: 0 2px 8px rgba(0,0,0,0.2); }
`;

// Main Product Detail Page
export default function ProductDetailPage() {
  const { id } = useParams(); // From URL: /products/123
  const [product, setProduct] = useState(null);
  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [titleStyle, setTitleStyle] = useState("both");

  useEffect(() => {
    document.title = "Loading... • TCAM Solutions";
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [banners, productsResponse] = await Promise.all([
          fetchPublicProducts({ per_page: 50, page: 1 }), // Fetch enough to find product
        ]);

        // Use the SAME banner as the main products page
        const mainBanner = banners.length > 0 ? banners[0] : null;
        setBanner(mainBanner);

        // Find current product from list
        const foundProduct = productsResponse.data.find(
          (p) => p.id === parseInt(id)
        );
        if (!foundProduct) throw new Error("Product not found");

        setProduct(foundProduct);
        document.title = `${foundProduct.title} • TCAM Solutions`;
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-2xl text-gray-600">Loading product...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Product Not Found
          </h1>
          <Link to="/products" className="text-emerald-600 hover:underline">
            ← Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const features = [
    {
      icon: Zap,
      title: "High Performance",
      desc: "Lightning-fast processing and real-time analytics",
    },
    {
      icon: Shield,
      title: "Secure by Design",
      desc: "Enterprise-grade security and compliance",
    },
    {
      icon: Globe,
      title: "Global Ready",
      desc: "Multi-language, multi-currency, scalable worldwide",
    },
    {
      icon: Users,
      title: "User Friendly",
      desc: "Intuitive interface with minimal learning curve",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{GLOBAL_STYLES}</style>

      {/* Same Hero Banner as Products Page */}
      <Hero
        banner={banner}
        titleStyle={titleStyle}
        onToggleStyle={setTitleStyle}
      />

      {/* Back Link */}
      <div className="max-w-7xl mx-auto px-6 pt-8">
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to All Products
        </Link>
      </div>

      {/* Product Details */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Image */}
          <div>
            <div className="rounded-2xl overflow-hidden shadow-2xl bg-white">
              <img
                src={
                  product.feature_image_url ||
                  "/images/placeholder-product-detail.png"
                }
                alt={product.title}
                className="w-full h-auto object-cover"
                onError={(e) =>
                  (e.currentTarget.src =
                    "/images/placeholder-product-detail.png")
                }
              />
            </div>
          </div>

          {/* Content */}
          <div>
            <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">
              {product.title}
            </h1>

            {product.short_description && (
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                {product.short_description}
              </p>
            )}

            {product.long_description && (
              <div
                className="prose prose-lg max-w-none text-gray-700 mb-12 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: product.long_description }}
              />
            )}

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 mb-12">
              <a
                href="/contact"
                className="inline-flex items-center gap-3 px-8 py-4 bg-emerald-600 text-white font-bold rounded-full hover:bg-emerald-700 transition shadow-lg"
              >
                Request Demo
                <ArrowRight className="w-5 h-5" />
              </a>
              <a
                href={product.brochure_url || "#"}
                className="inline-flex items-center gap-3 px-8 py-4 border-2 border-emerald-600 text-emerald-600 font-bold rounded-full hover:bg-emerald-50 transition"
              >
                Download Brochure
                <ChevronRight className="w-5 h-5" />
              </a>
            </div>

            {/* Features */}
            <div className="grid sm:grid-cols-2 gap-8">
              {features.map((f, i) => {
                const Icon = f.icon;
                return (
                  <div key={i} className="flex gap-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon className="w-7 h-7 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{f.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{f.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-emerald-600 py-20">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-emerald-100 mb-10">
            Transform your business with {product.title}
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-3 px-10 py-5 bg-white text-emerald-600 font-bold text-lg rounded-full hover:bg-gray-100 transition shadow-xl"
          >
            Contact Sales Team
            <ArrowRight className="w-6 h-6" />
          </a>
        </div>
      </section>
    </div>
  );
}
