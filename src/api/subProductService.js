// src/api/subProductService.js
import api from "./index";

const fetchSubProduct = (id) => {
  return api.get(`/public/sub-products/${id}`);
};

export default fetchSubProduct;
