// src/api/customers.js
import api from "./index";

/**
 * Fetches customer banners for the customers page.
 * GET /banners/public?page=customers
 */
export const fetchCustomerBanners = (params = {}) =>
  api
    .get("/banners/public", { params: { page: "customers", ...params } })
    .then((res) => {
      const payload = Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res?.data?.data)
        ? res.data.data
        : res?.data || [];
      return payload;
    })
    .catch((err) => {
      console.error(
        "fetchCustomerBanners error:",
        err?.response?.statusText || err?.message || err
      );
      return [];
    });

/**
 * Fetch paginated public customers.
 * GET /customers/public
 * Returns either an array or a paginated wrapper { data: [...], current_page, last_page, ... }
 */
export const fetchPublicCustomers = (params = {}) =>
  api
    .get("/customers/public", { params })
    .then((res) => {
      const data = res?.data;
      if (!data) return { data: [], current_page: 1, last_page: 1 };

      // If wrapper { data: [...] }
      if (Array.isArray(data.data)) {
        const normalized = data.data.map((c) => ({
          ...c,
          image_url: c.logo_url || c.image_url || c.image || null,
          title: c.title || c.name || c.company || "",
          short_description:
            c.short_description || c.summary || c.description || "",
        }));
        return { ...data, data: normalized };
      }

      // If direct array
      if (Array.isArray(data)) {
        return data.map((c) => ({
          ...c,
          image_url: c.logo_url || c.image_url || c.image || null,
          title: c.title || c.name || c.company || "",
          short_description:
            c.short_description || c.summary || c.description || "",
        }));
      }

      // Unknown shape — return as-is
      return data;
    })
    .catch((err) => {
      console.error(
        "fetchPublicCustomers error:",
        err?.response?.data || err.message || err
      );
      throw err;
    });

/**
 * Optional: fetch customer categories if you need filtering.
 */
export const fetchCustomerCategories = (params = {}) =>
  api
    .get("/customer-categories/public", {
      params: { per_page: 100, ...params },
    })
    .then((res) => {
      const data = res?.data;
      const list = Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data)
        ? data
        : [];
      return list.map((cat) => ({ id: String(cat.id), name: cat.name }));
    })
    .catch((err) => {
      console.error(
        "fetchCustomerCategories error:",
        err?.response?.statusText || err?.message || err
      );
      return [];
    });

export default {
  fetchCustomerBanners,
  fetchPublicCustomers,
  fetchCustomerCategories,
};
