// src/App.jsx

import React from "react";

import MainLayout from "./layouts/MainLayout";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ProductPage from "./pages/ProductPage";
// 1. Import the new detail page
import ProductDetailPage from "./pages/ProductDetailPage";
import ServicePage from "./pages/ServicePage";
import PartnerPage from "./pages/PartnerPage";
import CustomersPage from "./pages/CustomersPage";
import ContactPage from "./pages/ContactPage";

export default function App() {
  return (
    <MainLayout>
      {" "}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/products" element={<ProductPage />} />
        {/* 2. Add the dynamic route for product details */}
        <Route path="/products/:id" element={<ProductDetailPage />} />{" "}
        <Route path="/services" element={<ServicePage />} />
        <Route path="/partners" element={<PartnerPage />} />
        <Route path="/customers" element={<CustomersPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>{" "}
    </MainLayout>
  );
}
