import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { useUserStore } from '../store';
import { ENV } from "../config/env";

export const apiClient = axios.create({
    baseURL: ENV.SUPABASE_URL,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ENV.SUPABASE_ANON_KEY}`
    }
});

// Request interceptor
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // Here you can inject dynamic user tokens if needed
        // For now, it uses the static Anon key provided in init, but you can override here
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

// Response interceptor
apiClient.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            // Handle unauthorized (e.g. logout or refresh token)
            useUserStore.getState().logout();
        }
        
        console.error(`[API Error] ${error.config?.url}:`, error.message);
        return Promise.reject(error);
    }
);