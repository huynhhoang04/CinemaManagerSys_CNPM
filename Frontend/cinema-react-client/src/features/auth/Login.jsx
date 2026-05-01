import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginApi } from './authApi';
import useAuthStore from '../../store/authStore';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const { login } = useAuthStore();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const res = await loginApi({ username, password });
            login({ username: res.data.username, role: res.data.role }, res.data.token);
            navigate(res.data.role === 'Admin' ? '/admin/movies' : '/staff/booking');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="w-full max-w-sm p-8 bg-white rounded-lg shadow-md">
                <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">System Login</h2>
                {error && <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded">{error}</div>}
                
                <div className="mb-4">
                    <label className="block mb-2 text-sm font-bold text-gray-700">Username</label>
                    <input 
                        type="text" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label className="block mb-2 text-sm font-bold text-gray-700">Password</label>
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <button 
                    type="submit" 
                    className="w-full px-4 py-2 font-bold text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none"
                >
                    Login
                </button>
            </form>
        </div>
    );
};

export default Login;