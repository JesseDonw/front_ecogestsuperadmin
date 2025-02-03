import axios from "axios";

const api = axios.create({
  baseURL: "https://votre-api-backend.com/api", // Remplacez par l'URL de votre backend
  timeout: 5000, // Timeout en millisecondes
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Intercepteur pour ajouter un token d'authentification (si nécessaire)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token"); // Remplacez par la méthode d'accès à votre token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs globalement
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Gestion des erreurs
    if (error.response) {
      console.error(
        `Erreur API: ${error.response.status} - ${error.response.data.message}`
      );
    } else {
      console.error("Erreur réseau ou autre problème :", error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
