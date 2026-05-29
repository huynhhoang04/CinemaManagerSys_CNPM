import { Outlet, useNavigate, NavLink } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const AdminLayout = () => {
    const logout = useAuthStore((state) => state.logout);
    const user = useAuthStore((state) => state.user);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { path: '/admin/movies', label: 'Quản lý Phim', icon: '🎬' },
        { path: '/admin/schedule', label: 'Lịch chiếu', icon: '📅' },
        { path: '/admin/facility', label: 'Rạp & Phòng', icon: '🏢' },
        { path: '/admin/cast', label: 'Diễn viên/Đạo diễn', icon: '🎭' },
        { path: '/admin/users', label: 'Quản lý Nhân viên', icon: '👥' },
    ];

    return (
        <div className="flex h-screen bg-slate-50">
            {/* Sidebar */}
            <aside className="flex flex-col w-64 text-white bg-slate-900 shadow-xl">
                <div className="p-6 text-2xl font-black tracking-tighter border-b border-slate-800 bg-indigo-600">
                    CINEMA ADMIN
                </div>
                
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto mt-4">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => 
                                `flex items-center px-4 py-3 rounded-lg transition-all duration-200 group ${
                                    isActive 
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' 
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                }`
                            }
                        >
                            <span className="mr-3 text-xl group-hover:scale-110 transition-transform">{item.icon}</span>
                            <span className="font-semibold">{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-800 bg-slate-900/50">
                    <div className="flex items-center mb-4 px-2">
                        <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-white mr-3">
                            {user?.username?.charAt(0).toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold truncate">{user?.fullname || user?.username}</p>
                            <p className="text-xs text-slate-500 uppercase tracking-widest">{user?.role}</p>
                        </div>
                    </div>
                    <button 
                        onClick={handleLogout} 
                        className="w-full flex items-center justify-center px-4 py-2 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-lg hover:bg-rose-500 hover:text-white transition-all font-bold"
                    >
                        <span>Đăng xuất</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="min-h-screen">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;