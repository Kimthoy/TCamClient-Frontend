// src/api/partners.js
import api from "./index";

/**
 * Fetch partner banners (uses /banners/public?page=partners)
 * Returns an array (or empty array on error).
 */
export const fetchPartnerBanners = (params = {}) =>
  api
    .get("/banners/public", { params: { page: "partners", ...params } })
    .then((res) => {
      const payload = Array.isArray(res?.data)
        ? res.data
        : res?.data?.data || res?.data || [];
      return payload;
    })
    .catch((err) => {
      console.error(
        "fetchPartnerBanners error:",
        err?.response?.statusText || err.message || err
      );
      return [];
    });

/**
 * Fetch public partners list (GET /partners/public)
 * Normalizes image/logo field into `image_url` for the UI.
 * If backend returns { data: [...] } it will preserve wrapper shape but normalize items.
 * On network / API error this function throws (same behavior as fetchPublicProducts).
 */
export const fetchPublicPartners = (params = {}) =>
  api
    .get("/partners/public", { params })
    .then((res) => {
      const data = res?.data;
      if (!data) return data;

      // If response is paginated wrapper { data: [...] , meta: ... }
      if (Array.isArray(data.data)) {
        const normalized = data.data.map((p) => ({
          ...p,
          image_url:
            p.image_url ||
            p.logo_url ||
            p.image ||
            p.feature_image_url ||
            p.feature_image ||
            null,
          website: p.link || p.website || p.url || null,
          short_description:
            p.short_description || p.description || p.summary || null,
        }));
        return { ...data, data: normalized };
      }

      // If API returns array directly
      if (Array.isArray(data)) {
        return data.map((p) => ({
          ...p,
          image_url:
            p.image_url ||
            p.logo_url ||
            p.image ||
            p.feature_image_url ||
            p.feature_image ||
            null,
          website: p.link || p.website || p.url || null,
          short_description:
            p.short_description || p.description || p.summary || null,
        }));
      }

      // Unexpected shape - return as-is
      return data;
    })
    .catch((err) => {
      console.error(
        "fetchPublicPartners error:",
        err?.response?.data || err.message || err
      );
      throw err;
    });

/**
 * Fetch single partner (GET /partners/public/:id)
 * Normalizes to include image_url and website fields.
 */
export const fetchPublicPartner = (id) =>
  api
    .get(`/partners/public/${id}`)
    .then((res) => {
      const p = res?.data;
      if (!p) return p;
      return {
        ...p,
        image_url:
          p.image_url ||
          p.logo_url ||
          p.image ||
          p.feature_image_url ||
          p.feature_image ||
          null,
        website: p.link || p.website || p.url || null,
        short_description:
          p.short_description || p.description || p.summary || null,
      };
    })
    .catch((err) => {
      console.error(
        "fetchPublicPartner error:",
        err?.response?.data || err.message || err
      );
      throw err;
    });

export default {
  fetchPartnerBanners,
  fetchPublicPartners,
  fetchPublicPartner,
};
