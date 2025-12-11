// src/api/home.js
import api from "./index";

export const fetchBanners = () => api.get("/banners/public");

export const fetchAboutPost = () =>
  api.get("/posts/public", {
    params: {
      category: "Home",
      per_page: 1,
      sort: "-published_at",
    },
  });

export const fetchServices = () => api.get("/services/public");
export const fetchPartners = () => api.get("/partners/public");

// <-- CORRECT endpoint
export const fetchCustomers = () => api.get("/customers/public");
