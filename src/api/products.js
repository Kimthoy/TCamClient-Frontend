// src/api/products.js
import api from "./index";
const BASE_URL = import.meta.env.VITE_BACKEND_URL;
export const fetchSolutionBanners = () =>
  api
    .get("/banners/public", { params: { page: "solutions" } })
    .then((res) => {
      const payload = Array.isArray(res?.data)
        ? res.data
        : res?.data?.data || res?.data || [];
      return payload;
    })
    .catch((err) => {
      console.error(
        "fetchProductBanners error:",
        err?.response?.statusText || err.message || err
      );
      return [];
    });

export const fetchPublicProducts = (params = {}) =>
  api
    .get("/products/public", { params })
    .then((res) => {
      const data = res?.data;
      if (!data) return data;

      if (Array.isArray(data.data)) {
        const normalized = data.data.map((p) => ({
          ...p,
          image_url:
            p.image_url ||
            p.feature_image_url ||
            p.feature_image ||
            p.logo_url ||
            null,
        }));
        return { ...data, data: normalized };
      }

      if (Array.isArray(data)) {
        return data.map((p) => ({
          ...p,
          image_url:
            p.image_url ||
            p.feature_image_url ||
            p.feature_image ||
            p.logo_url ||
            null,
        }));
      }

      return data;
    })
    .catch((err) => {
      console.error(
        "fetchPublicProducts error:",
        err?.response?.data || err.message
      );
      throw err;
    });

export const fetchPublicProduct = (id) =>
  api
    .get(`/products/public/${id}`)
    .then((res) => {
      const p = res?.data;
      if (!p) return p;
      return {
        ...p,
        image_url:
          p.image_url ||
          p.feature_image_url ||
          p.feature_image ||
          p.logo_url ||
          null,
      };
    })
    .catch((err) => {
      console.error(
        "fetchPublicProduct error:",
        err?.response?.data || err.message
      );
      throw err;
    });

export const fetchSubProductsByProduct = (productId) => {
  return api.get(`/products/${productId}/sub-products`);
};
export default {
  fetchSolutionBanners,
  fetchPublicProducts,
  fetchPublicProduct,
  
  fetchSubProductsByProduct,
};
