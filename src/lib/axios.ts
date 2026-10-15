import axios from 'axios';

export const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
    withCredentials: false, // tạm đặt false
});

// debug
console.log("Current API Base URL:", axiosClient.defaults.baseURL);

// response interceptor để bóc tách data gọn hơn
axiosClient.interceptors.response.use(
    (response) => response.data,
    (error) => {
        // xử lý lỗi chung (token hết hạn, 401, 500,...)
        return Promise.reject(error?.response?.data || error);
    }
);