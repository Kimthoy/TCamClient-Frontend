import api from "./index";

export const fetchPartnerBanners = (params = {}) =>
  api
    .get("/banners/public", { params: { page: "jobs", ...params } })
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
export const fetchJob = () =>
  api
    .get("/jobs/public", { params: { page: "jobs" } })
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
export const getJobById = (id) => {
  return api.get(`/jobs/public/${id}`);
};
