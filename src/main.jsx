import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

/**
 * Punto de entrada principal de la aplicación React.
 * Se ha retirado el proveedor de OAuth para utilizar exclusivamente
 * la autenticación nativa contra nuestro backend en Spring Boot.
 */
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
