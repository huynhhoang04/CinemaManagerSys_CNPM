import axiosInstance from '../../config/axios';

export const loginApi = (credentials) => axiosInstance.post('/auth/login', credentials);
export const getAllUsersApi = () => axiosInstance.get('/user');
export const createUserApi = (userData) => axiosInstance.post('/user', userData);
export const updateUserApi = (id, userData) => axiosInstance.put(`/user/${id}`, userData);
export const promoteUserApi = (id) => axiosInstance.patch(`/user/${id}/promote`);
export const deleteUserApi = (id) => axiosInstance.delete(`/user/${id}`);