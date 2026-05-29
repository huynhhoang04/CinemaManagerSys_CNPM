import { create } from 'zustand';

/**
 * ZUSTAND AUTH STORE
 * Quản lý trạng thái đăng nhập, User Profile và Token.
 * Tự động Hydrate (khôi phục dữ liệu) từ localStorage khi ứng dụng khởi chạy.
 */
const useAuthStore = create((set) => {
    
    // Hàm khôi phục dữ liệu từ LocalStorage khi khởi tạo
    const getStoredAuth = () => {
        try {
            const token = localStorage.getItem('token');
            const userJson = localStorage.getItem('user');
            if (token && userJson) {
                return { token, user: JSON.parse(userJson), isAuthenticated: true };
            }
        } catch (err) {
            console.error("Lỗi khi đọc LocalStorage:", err);
            localStorage.clear();
        }
        return { token: null, user: null, isAuthenticated: false };
    };

    const initial = getStoredAuth();

    return {
        user: initial.user,
        token: initial.token,
        isAuthenticated: initial.isAuthenticated,

        /**
         * Hàm Login: Cập nhật State và lưu vào LocalStorage song song.
         * @param {Object} userData - Thông tin user (fullname, role, v.v.)
         * @param {string} token - JWT Token
         */
        login: (userData, token) => {
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
            set({ 
                user: userData, 
                token: token, 
                isAuthenticated: true 
            });
        },

        /**
         * Hàm Logout: Xóa sạch dấu vết.
         */
        logout: () => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            set({ 
                user: null, 
                token: null, 
                isAuthenticated: false 
            });
        }
    };
});

export default useAuthStore;