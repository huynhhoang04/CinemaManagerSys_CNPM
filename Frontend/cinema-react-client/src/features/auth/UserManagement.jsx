import { useState, useEffect } from 'react';
import { getAllUsersApi, deleteUserApi, promoteUserApi } from './authApi';
import { Table } from '../../components/Table';
import UserForm from './UserForm';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const fetchUsers = async () => {
        try {
            const res = await getAllUsersApi();
            setUsers(res.data);
        } catch (err) {
            setError('Failed to fetch users');
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (id) => {
        try {
            await deleteUserApi(id);
            fetchUsers();
        } catch (err) {
            setError('Failed to delete user');
        }
    };

    const handlePromote = async (id) => {
        try {
            await promoteUserApi(id);
            fetchUsers();
        } catch (err) {
            setError('Failed to promote user');
        }
    };

    const openAddModal = () => {
        setSelectedUser(null);
        setIsModalOpen(true);
    };

    const openEditModal = (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    return (
        <div className="p-6">
            <h2 className="mb-6 text-2xl font-bold text-gray-800">User Management</h2>
            {error && <div className="p-3 mb-4 text-white bg-red-500 rounded">{error}</div>}
            
            <div className="mb-4">
                <button onClick={openAddModal} className="px-4 py-2 font-bold text-white bg-green-500 rounded hover:bg-green-600">
                    Add New User
                </button>
            </div>

            <Table 
                headers={['ID', 'Username', 'Full Name', 'Email', 'Role', 'Actions']}
                data={users}
                renderRow={(user, index) => (
                    <>
                        <td className="px-6 py-4 text-sm text-slate-500 font-mono">#{user.id}</td>
                        <td className="px-6 py-4 font-bold text-slate-800">{user.username}</td>
                        <td className="px-6 py-4 text-slate-600">{user.fullname}</td>
                        <td className="px-6 py-4 text-slate-500 text-sm">{user.email}</td>
                        <td className="px-6 py-4">
                            <span className={`px-2 py-1 text-xs font-bold rounded-full uppercase tracking-tighter ${
                                user.role === 'Admin' ? 'bg-purple-100 text-purple-700' : 'bg-emerald-100 text-emerald-700'
                            }`}>
                                {user.role}
                            </span>
                        </td>
                        <td className="px-6 py-4 space-x-2">
                            <button onClick={() => openEditModal(user)} className="px-3 py-1 text-white bg-indigo-500 rounded hover:bg-indigo-600 transition-colors text-xs font-bold uppercase">Sửa</button>
                            {user.role !== 'Admin' && (
                                <button onClick={() => handlePromote(user.id)} className="px-3 py-1 text-white bg-amber-500 rounded hover:bg-amber-600 transition-colors text-xs font-bold uppercase">Thăng cấp</button>
                            )}
                            <button onClick={() => handleDelete(user.id)} className="px-3 py-1 text-white bg-rose-500 rounded hover:bg-rose-600 transition-colors text-xs font-bold uppercase">Xóa</button>
                        </td>
                    </>
                )}
            />

            <UserForm 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                user={selectedUser} 
                refreshData={fetchUsers} 
            />
        </div>
    );
};

export default UserManagement;