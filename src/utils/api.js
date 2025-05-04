import axios from 'axios';
// https://creator-dashboard-360o.onrender.com/api
// http://localhost:5000/api
const API_URL = 'https://creator-dashboard-360o.onrender.com/api'; 

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;