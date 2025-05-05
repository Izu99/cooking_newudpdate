// src/config/axios.config.js
import axios from 'axios';
import authService from '../services/auth.service';

const api = axios.create({
  baseURL: 'http://localhost:8080/api'
});

api.interceptors.request.use(config => {
  const user = authService.getCurrentUser();
  if (user?.accessToken) {
    config.headers.Authorization = `Bearer ${user.accessToken}`;
  }
  return config;
});

export default api;