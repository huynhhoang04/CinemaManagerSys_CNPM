import axios from 'axios';

/**
 * CẤU HÌNH AXIOS INSTANCE
 * Gateway: http://localhost:5000
 * BaseURL: http://localhost:5000/api
 */
const axiosInstance = axios.create({
    // baseURL: 'http://localhost:5000/api',
    baseURL: 'http://localhost:5000/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Request Interceptor: Tự động gắn Bearer Token vào header mỗi khi gọi API
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            const cleanToken = token.trim();
            config.headers.Authorization = `Bearer ${cleanToken}`;
            console.log("--- REQUEST DEBUG ---");
            console.log("Target URL:", config.url);
            console.log("Auth Header Length:", config.headers.Authorization.length);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: Xử lý tập trung các mã lỗi trả về
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        // Bắt lỗi 401 (Unauthorized)
        if (error.response && error.response.status === 401) {
            // Chỉ thực hiện Logout và Redirect nếu KHÔNG PHẢI đang ở trang Login
            if (!window.location.pathname.includes('/login')) {
                console.warn("Hết hạn phiên làm việc hoặc Token không hợp lệ. Đang chuyển hướng về Login...");
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;