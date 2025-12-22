// src/api/home.js
import api from "./index";

export const fetchHomeBanners = (params = {}) =>
  api
    .get("/banners/public", { params: { page: "home", ...params } })
    .then((res) => {
      const payload = Array.isArray(res?.data)
        ? res.data
        : res?.data?.data || res?.data || [];
      return payload;
    })
    .catch((err) => {
      console.error(" error:", err?.response?.statusText || err.message || err);
      return [];
    });

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
