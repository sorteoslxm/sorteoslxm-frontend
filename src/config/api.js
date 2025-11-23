// FILE: /Users/mustamusic/web/sorteos-lxm/src/config/api.js

// PRIORIDAD 1: Variable de entorno
// PRIORIDAD 2: URL del backend en Render
const API_URL =
  process.env.REACT_APP_API_URL ||
  "https://sorteoslxm-server-clean.onrender.com";

export default API_URL;
