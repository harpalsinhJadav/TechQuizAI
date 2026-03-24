import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { useUserStore } from '../store';
import { ENV } from "../config/env";

export const apiClient = axios.create({
    baseURL: ENV.SUPABASE_URL,
    timeout: 60000,
    headers: {
        'Content-Type': 'application/json',
        'apikey': ENV.SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${ENV.SUPABASE_ANON_KEY}`
    }
});

// Request interceptor
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const fullUrl = `${config.baseURL || ''}${config.url || ''}`;
        if (__DEV__) {
            console.log("------------------ 🚀 [API Request] ------------------");
            console.log(`URL:    ${config.method?.toUpperCase()} ${fullUrl}`);
            console.log(`Headers:`, JSON.stringify(config.headers, null, 2));
            console.log(`Payload:`, config.data ? JSON.stringify(config.data, null, 2) : "No payload");
            console.log("------------------------------------------------------");
        }
        return config;
    },
    (error: AxiosError) => {
        if (__DEV__) {
            console.error(`❌ [API Request Error]`, error);
        }
        return Promise.reject(error);
    }
);

// Response interceptor
apiClient.interceptors.response.use(
    (response: AxiosResponse) => {
        const fullUrl = `${response.config.baseURL || ''}${response.config.url || ''}`;
        if (__DEV__) {
            console.log("------------------ ✅ [API Response] ------------------");
            console.log(`Status:  ${response.status} ${response.statusText}`);
            console.log(`URL:     ${response.config.method?.toUpperCase()} ${fullUrl}`);
            console.log(`Headers:`, JSON.stringify(response.headers, null, 2));
            console.log(`Data:   `, JSON.stringify(response.data, null, 2));
            console.log("-------------------------------------------------------");
        }
        return response;
    },
    (error: AxiosError) => {
        const fullUrl = `${error.config?.baseURL || ''}${error.config?.url || ''}`;
        if (error.response?.status === 401) {
            useUserStore.getState().logout();
        }

        if (__DEV__) {
            console.error("------------------ ❌ [API Error] ------------------");
            console.log(`Status:  ${error.response?.status || 'N/A'}`);
            console.log(`Method:  ${error.config?.method?.toUpperCase() || 'N/A'}`);
            console.log(`URL:     ${fullUrl || 'N/A'}`);
            console.log(`Message: ${error.message}`);
            console.log(`Headers:`, error.response?.headers ? JSON.stringify(error.response.headers, null, 2) : "No error headers");
            console.log(`Data:   `, error.response?.data ? JSON.stringify(error.response.data, null, 2) : "No error data");
            console.log("----------------------------------------------------");
        }
        return Promise.reject(error);
    }
);