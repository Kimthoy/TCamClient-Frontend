import React from "react"; // optional with plugin, safe to keep
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // if using router
import "./index.css";
import App from "./App";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      {" "}
      {/* put BrowserRouter here or inside App */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
