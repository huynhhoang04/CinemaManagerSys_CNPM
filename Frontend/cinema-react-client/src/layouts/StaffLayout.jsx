import { Outlet, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const StaffLayout = () => {
    const logout = useAuthStore((state) => state.logout);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            <header className="flex items-center justify-between p-4 text-white bg-blue-800 shadow-md">
                <div className="text-xl font-bold">Cinema POS</div>
                <button onClick={handleLogout} className="px-4 py-2 bg-red-600 rounded hover:bg-red-700">Logout</button>
            </header>
            <main className="flex-1 overflow-hidden">
                <Outlet />
            </main>
        </div>
    );
};

export default StaffLayout;