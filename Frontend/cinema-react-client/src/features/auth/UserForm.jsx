import { useState, useEffect } from 'react';
import { createUserApi, updateUserApi } from './authApi';
import { Modal } from '../../components/Modal';

const UserForm = ({ isOpen, onClose, user, refreshData }) => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        fullname: '',
        email: '',
        role: 'Staff'
    });
    const [error, setError] = useState(null);

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username || '',
                password: '',
                fullname: user.fullname || '',
                email: user.email || '',
                role: user.role || 'Staff'
            });
        } else {
            setFormData({ username: '', password: '', fullname: '', email: '', role: 'Staff' });
        }
        setError(null);
    }, [user, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            if (user) {
                await updateUserApi(user.id, formData);
            } else {
                await createUserApi(formData);
            }
            refreshData();
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Thao tác thất bại');
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={user ? "Cập nhật nhân viên" : "Thêm nhân viên mới"}>
            {error && <div className="p-3 mb-4 text-white bg-rose-500 rounded-lg text-sm font-bold shadow-lg shadow-rose-200">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1 text-sm font-bold text-slate-700">Tên đăng nhập</label>
                    <input 
                        type="text" 
                        name="username" 
                        value={formData.username} 
                        onChange={handleChange} 
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                        required 
                        disabled={!!user}
                    />
                </div>
                {!user && (
                    <div>
                        <label className="block mb-1 text-sm font-bold text-slate-700">Mật khẩu</label>
                        <input 
                            type="password" 
                            name="password" 
                            value={formData.password} 
                            onChange={handleChange} 
                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                            required 
                        />
                    </div>
                )}
                <div>
                    <label className="block mb-1 text-sm font-bold text-slate-700">Họ và tên</label>
                    <input 
                        type="text" 
                        name="fullname" 
                        value={formData.fullname} 
                        onChange={handleChange} 
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                        required 
                    />
                </div>
                <div>
                    <label className="block mb-1 text-sm font-bold text-slate-700">Email</label>
                    <input 
                        type="email" 
                        name="email" 
                        value={formData.email} 
                        onChange={handleChange} 
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                        required 
                    />
                </div>
                <div>
                    <label className="block mb-1 text-sm font-bold text-slate-700">Vai trò</label>
                    <select 
                        name="role" 
                        value={formData.role} 
                        onChange={handleChange} 
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-semibold"
                    >
                        <option value="Staff">Nhân viên (Staff)</option>
                        <option value="Admin">Quản trị viên (Admin)</option>
                    </select>
                </div>
                <div className="pt-4">
                    <button 
                        type="submit" 
                        className="w-full px-4 py-3 font-black text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all uppercase tracking-widest text-sm"
                    >
                        {user ? 'Lưu thay đổi' : 'Tạo tài khoản'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default UserForm;