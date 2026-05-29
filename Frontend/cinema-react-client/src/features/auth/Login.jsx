import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginApi } from './authApi';
import useAuthStore from '../../store/authStore';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    
    const { login, isAuthenticated, user } = useAuthStore();
    const navigate = useNavigate();

    // Nếu đã đăng nhập thì tự động đá về trang tương ứng
    useEffect(() => {
        if (isAuthenticated && user) {
            const path = user.role === 'Admin' ? '/admin/movies' : '/staff/select-theatre';
            navigate(path);
        }
    }, [isAuthenticated, user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        console.log("--- AUTH DEBUG START ---");
        console.log("Requesting login for:", username);

        try {
            const res = await loginApi({ username, password });
            
            // Console log toàn bộ response để debug theo yêu cầu
            console.log("API Response Raw:", res);

            // Backend returns: { token, role, fullname }
            const { token, role, fullname } = res.data;

            if (!token) {
                throw new Error("Không nhận được AccessToken từ hệ thống.");
            }

            console.log("Extracted Data:", { token: "********", role, fullname });

            // Lưu vào Store (Zustand sẽ tự lưu vào localStorage)
            login({ username, role, fullname }, token);

            // Điều hướng dựa trên Role
            const targetRoute = role === 'Admin' ? '/admin/movies' : '/staff/select-theatre';
            console.log("Redirecting to:", targetRoute);
            navigate(targetRoute);

        } catch (err) {
            console.error("Login Error:", err);
            const message = err.response?.data?.message || err.message || "Lỗi kết nối máy chủ";
            setError(message);
        } finally {
            setIsLoading(false);
            console.log("--- AUTH DEBUG END ---");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-100 p-4">
            <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg border border-slate-200">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-extrabold text-slate-800">Cinema Management</h1>
                    <p className="text-slate-500 mt-2">Vui lòng đăng nhập để tiếp tục</p>
                </div>

                {error && (
                    <div className="p-3 mb-6 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg animate-pulse">
                        <strong>Lỗi:</strong> {error}
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block mb-2 text-sm font-semibold text-slate-700">Tên đăng nhập</label>
                        <input 
                            type="text" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                            placeholder="Nhập username..."
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-2 text-sm font-semibold text-slate-700">Mật khẩu</label>
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                            placeholder="Nhập password..."
                            required
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className={`w-full py-3 px-4 font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none shadow-md shadow-indigo-200 transition-all ${
                            isLoading ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                    >
                        {isLoading ? 'Đang xác thực...' : 'ĐĂNG NHẬP HỆ THỐNG'}
                    </button>
                </form>

                <div className="mt-8 text-center text-xs text-slate-400 uppercase tracking-widest">
                    Cinema Management System v1.0
                </div>
            </div>
        </div>
    );
};

export default Login;