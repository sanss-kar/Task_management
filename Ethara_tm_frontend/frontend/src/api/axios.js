// src/api/axios.js
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

API.interceptors.request.use((config) => {   // ← API → api (lowercase)
    const token = localStorage.getItem("access");
    if (token){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default API;
