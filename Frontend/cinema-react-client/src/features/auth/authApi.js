import axiosInstance from '../../config/axios';

export const loginApi = (credentials) => axiosInstance.post('/identity/auth/login', credentials);
export const getAllUsersApi = () => axiosInstance.get('/identity/users');
export const createUserApi = (userData) => axiosInstance.post('/identity/users', userData);
export const updateUserApi = (id, userData) => axiosInstance.put(`/identity/users/${id}`, userData);
export const promoteUserApi = (id) => axiosInstance.patch(`/identity/users/${id}/promote`);
export const deleteUserApi = (id) => axiosInstance.delete(`/identity/users/${id}`);