import axiosInstance from '../../config/axios';

export const getAllTheatresApi = () => axiosInstance.get('/theatre');
export const createTheatreApi = (data) => axiosInstance.post('/theatre', data);
export const updateTheatreApi = (id, data) => axiosInstance.put(`/theatre/${id}`, data);
export const deleteTheatreApi = (id) => axiosInstance.delete(`/theatre/${id}`);

export const getRoomsByTheatreApi = (theatreId) => axiosInstance.get(`/room/theatre/${theatreId}`);
export const createRoomApi = (data) => axiosInstance.post('/room', data);
export const updateRoomApi = (id, data) => axiosInstance.put(`/room/${id}`, data);
export const deleteRoomApi = (id) => axiosInstance.delete(`/room/${id}`);