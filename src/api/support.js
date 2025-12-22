import api from "./index";

/**
 * Fetch Support System (Public)
 */
export const fetchSupport = (params = {}) =>
  api
    .get("/public/support", { params })
    .then((res) => {
      const payload = Array.isArray(res?.data)
        ? res.data
        : res?.data?.data || res?.data || {};
      return payload;
    })
    .catch((err) => {
      console.error(
        "Support fetch error:",
        err?.response?.statusText || err.message || err
      );
      return {};
    });

/**
 * Fetch Support Plans only (optional helper)
 */
export const fetchSupportPlans = () =>
  api
    .get("/public/support", { params: { type: "plans" } })
    .then((res) => {
      const payload = Array.isArray(res?.data?.plans) ? res.data.plans : [];
      return payload;
    })
    .catch((err) => {
      console.error(
        "Support plans error:",
        err?.response?.statusText || err.message || err
      );
      return [];
    });

/**
 * Fetch Support Options only (optional helper)
 */
export const fetchSupportOptions = () =>
  api
    .get("/public/support", { params: { type: "options" } })
    .then((res) => {
      const payload = Array.isArray(res?.data?.options) ? res.data.options : [];
      return payload;
    })
    .catch((err) => {
      console.error(
        "Support options error:",
        err?.response?.statusText || err.message || err
      );
      return [];
    });
