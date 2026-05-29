import { Outlet, useNavigate, NavLink, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import useAuthStore from '../store/authStore';
import useTheatreStore from '../store/theatreStore';

const StaffLayout = () => {
    const logout = useAuthStore((state) => state.logout);
    const user = useAuthStore((state) => state.user);
    const { selectedTheatre, clearTheatre } = useTheatreStore();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!selectedTheatre && location.pathname !== '/staff/select-theatre') {
            navigate('/staff/select-theatre');
        }
    }, [selectedTheatre, navigate, location.pathname]);

    const handleLogout = () => {
        logout();
        clearTheatre();
        navigate('/login');
    };

    const handleChangeTheatre = () => {
        clearTheatre();
        navigate('/staff/select-theatre');
    };

    return (
        <div className="flex flex-col h-screen bg-slate-100">
            {/* Header / Navbar */}
            <header className="bg-indigo-700 text-white shadow-lg z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <div className="text-xl font-black tracking-widest mr-8">
                                CINEMA <span className="text-indigo-200">POS</span>
                            </div>
                            <nav className="flex space-x-4">
                                <NavLink 
                                    to="/staff/booking" 
                                    className={({ isActive }) => 
                                        `px-4 py-2 rounded-md text-sm font-bold transition-all ${
                                            isActive 
                                            ? 'bg-indigo-800 text-white shadow-inner' 
                                            : 'text-indigo-100 hover:bg-indigo-600'
                                        }`
                                    }
                                >
                                    🎫 BÁN VÉ (POS)
                                </NavLink>
                                <NavLink 
                                    to="/staff/schedule" 
                                    className={({ isActive }) => 
                                        `px-4 py-2 rounded-md text-sm font-bold transition-all ${
                                            isActive 
                                            ? 'bg-indigo-800 text-white shadow-inner' 
                                            : 'text-indigo-100 hover:bg-indigo-600'
                                        }`
                                    }
                                >
                                    🎬 QUẢNG CÁO
                                </NavLink>
                                <NavLink 
                                    to="/staff/refund" 
                                    className={({ isActive }) => 
                                        `px-4 py-2 rounded-md text-sm font-bold transition-all ${
                                            isActive 
                                            ? 'bg-indigo-800 text-white shadow-inner' 
                                            : 'text-indigo-100 hover:bg-indigo-600'
                                        }`
                                    }
                                >
                                    🔄 HOÀN VÉ
                                </NavLink>
                            </nav>
                        </div>
                        <div className="flex items-center space-x-4">
                            {selectedTheatre && (
                                <div 
                                    className="hidden lg:flex items-center bg-indigo-800 px-3 py-1.5 rounded-lg border border-indigo-500 cursor-pointer hover:bg-indigo-600 transition-colors mr-2"
                                    onClick={handleChangeTheatre}
                                >
                                    <span className="mr-2">🏢</span>
                                    <div className="text-left">
                                        <p className="text-[10px] uppercase font-bold text-indigo-300 leading-none">Rạp đang chọn</p>
                                        <p className="text-xs font-bold">{selectedTheatre.theatreName}</p>
                                    </div>
                                </div>
                            )}
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold leading-none">{user?.fullname || user?.username}</p>
                                <p className="text-xs text-indigo-300 uppercase tracking-tighter">Nhân viên phòng vé</p>
                            </div>
                            <button 
                                onClick={handleLogout} 
                                className="px-4 py-2 bg-indigo-600 hover:bg-rose-500 text-white text-xs font-bold rounded-lg transition-all border border-indigo-500 hover:border-rose-400"
                            >
                                ĐĂNG XUẤT
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 overflow-auto p-4 md:p-6">
                <div className="max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default StaffLayout;