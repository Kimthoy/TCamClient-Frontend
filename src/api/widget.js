import api from "./index";

/**
 * Fetch all widgets
 */
export const fetchWidgets = (params = {}) => {
  return api.get("/public/widgets", { params });
};
