import React from "react";
import MainLayout from "./layouts/MainLayout";
import { Routes, Route, Navigate } from "react-router-dom";

import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import Solution from "./pages/Solution";
import ProductDetailPage from "./pages/ProductDetailPage";
import ServicePage from "./pages/ServicePage";
import PartnerPage from "./pages/PartnerPage";
import CustomersPage from "./pages/CustomersPage";
import ContactPage from "./pages/ContactPage";
import Job from "./pages/Job";
import JobDetail from "./pages/JobDetail";
import ApplyCV from "./pages/ApplyCV";
import CertificationEventsList from "./pages/CertificationEvent";
import SubProductDetail from "./components/SubProductDetail";
import EachSubDetail from "./components/EachSubDetail";

export default function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/solution" element={<Solution />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/services" element={<ServicePage />} />
        <Route path="/partners" element={<PartnerPage />} />
        <Route path="/customers" element={<CustomersPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/events" element={<CertificationEventsList />} />
        <Route path="/jobs" element={<Job />} />
        <Route path="/jobs/:id" element={<JobDetail />} />
        <Route path="/jobs/:id/apply" element={<ApplyCV />} />
        <Route
          path="/products/:productId/sub-products"
          element={<SubProductDetail />}
        />
        <Route path="/sub-products/:subProductId" element={<EachSubDetail />} />

        {/* Redirect all unknown routes to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </MainLayout>
  );
}
