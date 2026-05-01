import { Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import AuthLayout from '../layouts/AuthLayout';
import AdminLayout from '../layouts/AdminLayout';
import StaffLayout from '../layouts/StaffLayout';
import Login from '../features/auth/Login';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const token = useAuthStore((state) => state.token);
    const user = useAuthStore((state) => state.user);

    if (!token) return <Navigate to="/login" replace />;
    if (allowedRoles && !allowedRoles.includes(user?.role)) return <Navigate to="/unauthorized" replace />;
    return children;
};

const AppRouter = () => {
    return (
        <Routes>
            <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
            </Route>

            <Route path="/admin" element={
                <ProtectedRoute allowedRoles={['Admin']}>
                    <AdminLayout />
                </ProtectedRoute>
            }>
                <Route index element={<Navigate to="movies" replace />} />
                <Route path="movies" element={<div className="p-8 font-bold">Movie Management Module</div>} />
            </Route>

            <Route path="/staff" element={
                <ProtectedRoute allowedRoles={['Staff', 'Admin']}>
                    <StaffLayout />
                </ProtectedRoute>
            }>
                <Route index element={<Navigate to="booking" replace />} />
                <Route path="booking" element={<div className="p-8 font-bold">Booking POS Module</div>} />
            </Route>

            <Route path="/unauthorized" element={<div className="p-8 text-2xl font-bold text-red-600">403 - Forbidden</div>} />
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
};

export default AppRouter;