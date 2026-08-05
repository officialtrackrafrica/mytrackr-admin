// src/services/api.ts
import axios from 'axios';

// 1. Create the Axios instance
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  // your cookies with every request to the backend.
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Request Interceptor (Optional now, but good for logging or other headers)
api.interceptors.request.use(
  (config) => {
    // No need to manually attach a token here anymore! 
    // The browser attaches the cookie automatically because of `withCredentials: true`.
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. Response Interceptor: Handle global errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // If the API says unauthorized (cookie expired or missing),
      // kick them back to the login screen.
      window.location.href = '/'; 
    }
    
    return Promise.reject(error);
  }
);