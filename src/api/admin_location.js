import api from "./index";

// Fetch all countries with nested offices, phones, emails, websites
export const fetchCountries = (params = {}) =>
  api
    .get("/public/location-system", { params })
    .then((res) => {
      const payload = Array.isArray(res?.data)
        ? res.data
        : res?.data?.countries || res?.data || [];
      return payload;
    })
    .catch((err) => {
      console.error(
        "fetchCountries error:",
        err?.response?.statusText || err.message || err
      );
      return [];
    });
