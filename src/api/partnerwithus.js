import api from "./index";

/**
 * Fetch all partner with us sections (public)
 * @param {Object} params - Optional query parameters
 * @returns {Promise<Array>}
 */
export const fetchPartnerWithUsSections = (params = {}) =>
  api
    .get("/public/partner-with-us", { params })
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

/**
 * Get a single section by ID
 * @param {number|string} id - Section ID
 * @returns {Promise}
 */
export const getPartnerWithUsSectionById = (id) => {
  return api.get(`/public/partner-with-us/${id}`);
};
