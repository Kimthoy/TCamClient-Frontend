// save token
export const setToken = (token) => {
  localStorage.setItem("token", token);
};

// get token
export const getToken = () => {
  return localStorage.getItem("token");
};

// remove token
export const removeToken = () => {
  localStorage.removeItem("token");
};
