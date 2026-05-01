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
                headers={['ID', 'Username', 'Full Name', 'Role', 'Actions']}
                data={users}
                renderRow={(user, index) => (
                    <>
                        <td className="px-6 py-4">{user.userId}</td>
                        <td className="px-6 py-4">{user.username}</td>
                        <td className="px-6 py-4">{user.fullName}</td>
                        <td className="px-6 py-4">
                            <span className={`px-2 py-1 text-sm font-semibold rounded ${user.role === 'Admin' ? 'bg-purple-200 text-purple-800' : 'bg-green-200 text-green-800'}`}>
                                {user.role}
                            </span>
                        </td>
                        <td className="px-6 py-4 space-x-2">
                            <button onClick={() => openEditModal(user)} className="px-3 py-1 text-white bg-blue-500 rounded hover:bg-blue-600">Edit</button>
                            {user.role !== 'Admin' && (
                                <button onClick={() => handlePromote(user.userId)} className="px-3 py-1 text-white bg-yellow-500 rounded hover:bg-yellow-600">Promote</button>
                            )}
                            <button onClick={() => handleDelete(user.userId)} className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600">Delete</button>
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