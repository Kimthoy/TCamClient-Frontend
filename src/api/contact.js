// src/api/contact.js
import api from "./index";

const ENDPOINT = "/contact-messages";
export const fetchContactBanners = (params = {}) =>
  api
    .get("/banners/public", { params: { page: "contact", ...params } })
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

export async function sendContactMessage(payload) {
  return api
    .post(ENDPOINT, payload)
    .then((res) => {
      return res?.data || { success: true };
    })
    .catch((err) => {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Failed to send message";
      const e = new Error(message);
      e.response = err?.response;
      throw e;
    });
}

export async function fetchRecentMessages(limit = 6) {
  return api
    .get("/contact-messages/recent", { params: { limit } })
    .then((res) => res?.data || [])
    .catch((err) => {
      console.warn("fetchRecentMessages failed:", err);
      return [];
    });
}

export default {
  sendContactMessage,
  fetchRecentMessages,
};
