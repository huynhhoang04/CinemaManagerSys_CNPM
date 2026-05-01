import { useState, useEffect } from 'react';
import { createUserApi, updateUserApi } from './authApi';
import { Modal } from '../../components/Modal';

const UserForm = ({ isOpen, onClose, user, refreshData }) => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        fullName: '',
        email: '',
        role: 'Staff'
    });
    const [error, setError] = useState(null);

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username || '',
                password: '',
                fullName: user.fullName || '',
                email: user.email || '',
                role: user.role || 'Staff'
            });
        } else {
            setFormData({ username: '', password: '', fullName: '', email: '', role: 'Staff' });
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
                await updateUserApi(user.userId, formData);
            } else {
                await createUserApi(formData);
            }
            refreshData();
            onClose();
        } catch (err) {
            setError('Operation failed');
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={user ? "Edit User" : "Add User"}>
            {error && <div className="p-3 mb-4 text-white bg-red-500 rounded">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block mb-2 font-bold text-gray-700">Username</label>
                    <input type="text" name="username" value={formData.username} onChange={handleChange} className="w-full px-3 py-2 border rounded" required />
                </div>
                {!user && (
                    <div className="mb-4">
                        <label className="block mb-2 font-bold text-gray-700">Password</label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full px-3 py-2 border rounded" required />
                    </div>
                )}
                <div className="mb-4">
                    <label className="block mb-2 font-bold text-gray-700">Full Name</label>
                    <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full px-3 py-2 border rounded" required />
                </div>
                <div className="mb-4">
                    <label className="block mb-2 font-bold text-gray-700">Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-3 py-2 border rounded" required />
                </div>
                <div className="mb-4">
                    <label className="block mb-2 font-bold text-gray-700">Role</label>
                    <select name="role" value={formData.role} onChange={handleChange} className="w-full px-3 py-2 border rounded">
                        <option value="Staff">Staff</option>
                        <option value="Admin">Admin</option>
                    </select>
                </div>
                <button type="submit" className="w-full px-4 py-2 font-bold text-white bg-blue-600 rounded">Save</button>
            </form>
        </Modal>
    );
};

export default UserForm;