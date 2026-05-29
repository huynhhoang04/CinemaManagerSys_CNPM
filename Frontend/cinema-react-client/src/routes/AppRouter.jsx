import { Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

// Layouts
import AuthLayout from '../layouts/AuthLayout';
import AdminLayout from '../layouts/AdminLayout';
import StaffLayout from '../layouts/StaffLayout';

// Features - Auth
import Login from '../features/auth/Login';
import UserManagement from '../features/auth/UserManagement';

// Features - Movie
import MovieManagement from '../features/movie/MovieManagement';

// Features - Schedule
import ScheduleManagement from '../features/schedule/ScheduleManagement';
import StaffSchedule from '../features/schedule/StaffSchedule';

// Features - Facility
import FacilityManagement from '../features/facility/FacilityManagement';
import TheatreSelection from '../features/facility/TheatreSelection';

// Features - Cast
import CastManagement from '../features/cast/CastManagement';

// Features - Booking (POS)
import POSScreen from '../features/booking/POSScreen';
import RefundTicket from '../features/booking/RefundTicket';

/**
 * PROTECTED ROUTE COMPONENT
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
    const { isAuthenticated, user, token } = useAuthStore();

    if (!isAuthenticated || !token) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user?.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

const AppRouter = () => {
    return (
        <Routes>
            {/* PUBLIC ROUTES */}
            <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
            </Route>

            {/* ADMIN ROUTES */}
            <Route path="/admin" element={
                <ProtectedRoute allowedRoles={['Admin']}>
                    <AdminLayout />
                </ProtectedRoute>
            }>
                <Route index element={<Navigate to="movies" replace />} />
                <Route path="movies" element={<MovieManagement />} />
                <Route path="schedule" element={<ScheduleManagement />} />
                <Route path="facility" element={<FacilityManagement />} />
                <Route path="cast" element={<CastManagement />} />
                <Route path="users" element={<UserManagement />} />
            </Route>

            {/* STAFF ROUTES */}
            <Route path="/staff" element={
                <ProtectedRoute allowedRoles={['Staff', 'Admin']}>
                    <StaffLayout />
                </ProtectedRoute>
            }>
                <Route index element={<Navigate to="select-theatre" replace />} />
                <Route path="select-theatre" element={<TheatreSelection />} />
                <Route path="booking" element={<POSScreen />} />
                <Route path="refund" element={<RefundTicket />} />
                <Route path="schedule" element={<StaffSchedule />} />
            </Route>

            {/* GLOBAL ERROR ROUTES */}
            <Route path="/unauthorized" element={
                <div className="flex flex-col items-center justify-center min-h-screen bg-rose-50 p-4">
                    <div className="text-9xl mb-4">🚫</div>
                    <h1 className="text-4xl font-black text-rose-600">403 - TRUY CẬP BỊ CHẶN</h1>
                    <p className="text-xl text-rose-800 mt-2 font-semibold text-center">
                        Tài khoản của bạn không có quyền truy cập vào khu vực này.
                    </p>
                    <button 
                        onClick={() => window.location.href = '/login'}
                        className="mt-8 px-8 py-3 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 shadow-lg shadow-rose-200 transition-all"
                    >
                        Quay lại Đăng nhập
                    </button>
                </div>
            } />
            
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
};

export default AppRouter;