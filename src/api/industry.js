import api from "./index";

const ENDPOINT = "/public/industries";

/**
 * Fetch industries for public site
 */
export const fetchPublicIndustries = (params = {}) =>
  api
    .get(ENDPOINT, { params })
    .then((res) => {
      const payload = Array.isArray(res?.data)
        ? res.data
        : res?.data?.data || res?.data || [];
      return payload;
    })
    .catch((err) => {
      console.error(
        "fetchPublicIndustries error:",
        err?.response?.statusText || err.message || err
      );
      return [];
    });

export default {
  fetchPublicIndustries,
};
