// src/api/axios.js

import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://manajemen-pkl-production.up.railway.app/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    // --- TAMBAHKAN LOG UNTUK DEBUGGING ---
    console.log('Interceptor berjalan untuk request:', config.url);

    const token = localStorage.getItem('token');
    
    if (token) {
      console.log('Token DITEMUKAN:', token);
      config.headers['Authorization'] = `Bearer ${token}`;
    } else {
      console.log('Token TIDAK DITEMUKAN di localStorage.');
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;