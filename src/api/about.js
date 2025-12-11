// src/api/about.js
import api from "./index";

export const fetchAboutBanners = () =>
  api
    .get("/banners/public", { params: { page: "about" } })
    .then((res) => {
      const payload = Array.isArray(res?.data)
        ? res.data
        : res?.data?.data || res?.data || [];
      return payload;
    })
    .catch((err) => {
      console.error(
        "fetchAboutBanners error:",
        err?.response?.statusText || err.message || err
      );
      return [];
    });

export const fetchAboutPost = (opts = {}) => {
  const params = {
    category: opts.category ?? "Home",
    per_page: opts.per_page ?? 1,
    sort: opts.sort ?? "-published_at",
    ...opts.params,
  };

  return api
    .get("/posts/public", { params })
    .then((res) => {
      const items = Array.isArray(res?.data)
        ? res.data
        : res?.data?.data || res?.data || [];
      return items;
    })
    .catch((err) => {
      console.error(
        "fetchAboutPost error:",
        err?.response?.statusText || err.message || err
      );
      return [];
    });
};

export const fetchSingleAboutPost = async (opts = {}) => {
  const items = await fetchAboutPost(opts);
  return items.length > 0 ? items[0] : null;
};

export default {
  fetchAboutBanners,
  fetchAboutPost,
  fetchSingleAboutPost,
};
