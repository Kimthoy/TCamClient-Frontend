import React, { useEffect, useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { fetchWidgets } from "../api/widget";
import { FaTelegram, FaFacebook, FaYoutube } from "react-icons/fa";
import { fetchCountries } from "../api/admin_location";
const Footer = () => {
  const [widget, setWidget] = useState(null);
  const [countries, setCountries] = useState([]);
  useEffect(() => {
    const loadWidget = async () => {
      try {
        const res = await fetchWidgets();
        if (res.data?.data?.length > 0) {
          setWidget(res.data.data[0]); // assuming single widget
        }
      } catch (error) {
        console.error("Failed to fetch footer widget:", error);
      }
    };
    loadWidget();
  }, []);

  useEffect(() => {
    loadCountries();
  }, []);

  const loadCountries = async () => {
    const data = await fetchCountries();
    setCountries(data);
  };
  const getColorClass = (color) => {
    switch (color?.toLowerCase()) {
      case "blue":
        return "text-blue-600";
      case "red":
        return "text-red-600";
      case "yellow":
        return "text-yellow-500";
      default:
        return "text-gray-800";
    }
  };
  const cambodia = countries.filter((c) => c.country_name === "Cambodia")[0];
  return (
    <footer className="bg-slate-200 text-black">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 border-b border-gray-700 pb-10">
          {/* Logo & Slogan */}
          <div className="col-span-2 lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              {widget?.app_logo_url ? (
                <img
                  src={widget.app_logo_url}
                  alt="Current Logo"
                  className="h-12 "
                />
              ) : (
                <div className="w-12 h-12 rounded-md bg-gradient-to-br from-teal-600 to-emerald-500 text-slate-700 flex items-center justify-center font-bold text-sm">
                  TC
                </div>
              )}

              <span className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-emerald-400">
                {widget?.app_name || "TCAM Solution"}
              </span>
            </Link>
            <p className="text-sm text-slate-700 max-w-xs mt-4">
              {widget?.abstract_desc ||
                "Your partner in digital transformation, delivering innovative cloud, data, and security solutions for business excellence."}
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold text-slate-700 mb-4 uppercase">
              Mores
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/events"
                  className="text-slate-700 hover:text-emerald-400 transition text-sm"
                >
                  Recently Events
                </Link>
              </li>
              <li>
                <Link
                  to="/partners"
                  className="text-slate-700 hover:text-emerald-400 transition text-sm"
                >
                  Partners
                </Link>
              </li>
              <li>
                <Link
                  to="/customers"
                  className="text-slate-700 hover:text-emerald-400 transition text-sm"
                >
                  Customers
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8">
          <div className="text-sm text-gray-500 mb-4 md:mb-0">
            {widget?.footer_ownership || "TCAM Solution"}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
