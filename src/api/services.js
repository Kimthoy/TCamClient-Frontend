// src/api/service.js
import api from "./index";

export const fetchServiceBanners = (params = {}) =>
  api
    .get("/banners/public", { params: { page: "services", ...params } })
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
export const fetchPublicServices = (params = {}) =>
  api
    .get("/services/public", { params })
    .then((res) => {
      return Array.isArray(res?.data)
        ? res.data
        : res?.data?.data || res?.data || [];
    })
    .catch((err) => {
      console.error(
        "fetchPublicServices error:",
        err?.response?.statusText || err?.message || err
      );
      return [];
    });

/**
 * Try to fetch a single public service.
 * If you don't have a dedicated endpoint, you can fetch the list and find by id.
 */
export const fetchPublicService = async (id) => {
  try {
    const res = await api.get(`/services/${id}`);
    return res?.data || null;
  } catch (err) {
    // fallback: try to get list and find the item
    try {
      const list = await fetchPublicServices();
      return list.find((s) => String(s.id) === String(id)) || null;
    } catch (e) {
      console.error("fetchPublicService fallback failed:", e);
      return null;
    }
  }
};

export default { fetchPublicServices, fetchPublicService, fetchServiceBanners };
