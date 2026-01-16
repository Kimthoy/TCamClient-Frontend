// src/api/request_demo.js
import api from "./index";

/**
 * Submit a demo request (Public)
 * @param {Object} payload
 * @returns {Promise<Object|null>}
 */
export const submitRequestDemo = (payload) =>
  api
    .post("/public/request-demo", payload)
    .then((res) => {
      return res?.data || null;
    })
    .catch((err) => {
      console.error(
        "submitRequestDemo error:",
        err?.response?.data || err?.response?.statusText || err.message
      );
      throw err;
    });

export default {
  submitRequestDemo,
};
