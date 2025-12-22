// src/api/event.js
import api from "./index";

// Fetch banners related to events
export const fetchEventBanners = () =>
api
   .get("/banners/public", { params: { page: "events" } })
   .then((res) => {
   const payload = Array.isArray(res?.data)
      ? res.data
      : res?.data?.data || res?.data || [];
   return payload;
   })
   .catch((err) => {
   console.error(
      "fetchEventBanners error:",
      err?.response?.statusText || err.message || err
   );
   return [];
   });

// Fetch all public events
export const fetchPublicEvents = (params = {}) =>
api
   .get("/public/events", { params })
   .then((res) => {
   const data = res?.data;
   if (!data) return data;

   if (Array.isArray(data.data)) {
      const normalized = data.data.map((e) => ({
         ...e,
         image_url:
         e.poster_image ||
         e.feature_image_url ||
         e.feature_image ||
         e.logo_url ||
         null,
      }));
      return { ...data, data: normalized };
   }

   if (Array.isArray(data)) {
      return data.map((e) => ({
         ...e,
         image_url:
         e.poster_image ||
         e.feature_image_url ||
         e.feature_image ||
         e.logo_url ||
         null,
      }));
   }

   return data;
   })
   .catch((err) => {
   console.error(
      "fetchPublicEvents error:",
      err?.response?.data || err.message
   );
   throw err;
   });

// Fetch a single public event by ID
export const fetchPublicEvent = (id) =>
api
   .get(`/events/public/${id}`)
   .then((res) => {
   const e = res?.data;
   if (!e) return e;
   return {
      ...e,
      image_url:
         e.poster_image ||
         e.feature_image_url ||
         e.feature_image ||
         e.logo_url ||
         null,
   };
   })
   .catch((err) => {
   console.error(
      "fetchPublicEvent error:",
      err?.response?.data || err.message
   );
   throw err;
   });

export default {
fetchEventBanners,
fetchPublicEvents,
fetchPublicEvent,
};
