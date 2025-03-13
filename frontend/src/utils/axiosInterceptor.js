import axios from "axios";

import store from "@redux/store"; // Import your Redux store
import { loginSuccess, logout } from "@redux/Slice/UserSlice";

// Create an Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
    
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    // Get token from Redux store instead of localStorage
    const state = store.getState();
    const token = state.user.token;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    //console.log(error.response?.status)
    // If token expired and it's not a retry request
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Call refresh token endpoint
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/auth/refresh-token`,
          { withCredentials: true }
        );

        // Dispatch new token to Redux store
        //console.log(data)
        store.dispatch(loginSuccess(data));

        // Update the original request with new token
        originalRequest.headers.Authorization = `Bearer ${data.token}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        
        // Dispatch logout action to clear Redux store
        store.dispatch(logout());
        
        // // Redirect to login page
        // window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    switch (error.response?.status) {
      case 403:
        store.dispatch(logout());
        console.error('Forbidden access');
        break;
      case 400:
        console.error('Bad Request');
        if(error.response?.data?.message){
          error.message = error.response?.data?.message;
        }
        break;
      case 409:
        if(error.response?.data?.message){
          error.message = error.response?.data?.message;
        }
        break;  
      default:
        if(error.response?.data?.message){
          error.message = error.response?.data?.message;
        }else{
          error.message = error.message;
        }
        break;
    }

    return Promise.reject(error);
  }
);

// Optional: Add response interceptor for general error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle specific error cases
    switch (error.response?.status) {
      case 403:
        store.dispatch(logout());
        console.error('Forbidden access');
        break;
      case 404:
        console.error('Resource not found');
        break;
      case 500:
        console.error('Server error');
        break;
      default:
        console.error('An error occurred:', error);
    }
    return Promise.reject(error);
  }
);

export default api;