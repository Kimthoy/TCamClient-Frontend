// src/api/joinus.js
import api from "./index";

/**
 * Fetch "Why Join Us" sections for the public site
 */
export const fetchWhyJoinUs = (params = {}) =>
  api
    .get("/public/whyjoinus", { params })
    .then((res) => {
      const payload = Array.isArray(res?.data)
        ? res.data
        : res?.data?.data || res?.data || [];
      return payload;
    })
    .catch((err) => {
      console.error(
        "Error fetching Why Join Us sections:",
        err?.response?.statusText || err.message || err
      );
      return [];
    });
