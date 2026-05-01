import { Outlet, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const AdminLayout = () => {
    const logout = useAuthStore((state) => state.logout);
    const user = useAuthStore((state) => state.user);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-gray-50">
            <aside className="flex flex-col w-64 text-white bg-slate-800">
                <div className="p-4 text-xl font-bold border-b border-slate-700">Cinema Admin</div>
                <nav className="flex-1 p-4 space-y-2">
                    <div className="px-4 py-2 rounded cursor-pointer hover:bg-slate-700" onClick={() => navigate('/admin/movies')}>Movies</div>
                    <div className="px-4 py-2 rounded cursor-pointer hover:bg-slate-700" onClick={() => navigate('/admin/schedule')}>Schedule</div>
                </nav>
                <div className="p-4 border-t border-slate-700">
                    <p className="mb-2 text-sm text-slate-300">{user?.username}</p>
                    <button onClick={handleLogout} className="w-full px-4 py-2 bg-red-600 rounded hover:bg-red-700">Logout</button>
                </div>
            </aside>
            <main className="flex-1 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;