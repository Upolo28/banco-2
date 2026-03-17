import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/global.css";

// Mount inside phone shell on desktop, fallback to #root on mobile
const mountTarget =
  document.getElementById("root-inner") || document.getElementById("root");

ReactDOM.createRoot(mountTarget).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
