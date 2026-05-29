import axiosInstance from '../../config/axios';

export const getAllTheatresApi = () => axiosInstance.get('facility/theatres');
export const createTheatreApi = (data) => axiosInstance.post('facility/theatres', data);
export const updateTheatreApi = (id, data) => axiosInstance.put(`facility/theatres/${id}`, data);
export const deleteTheatreApi = (id) => axiosInstance.delete(`facility/theatres/${id}`);

export const getRoomsByTheatreApi = (theatreId) => axiosInstance.get(`facility/rooms/theatre/${theatreId}`);
export const createRoomApi = (data) => axiosInstance.post('facility/rooms', data);
export const updateRoomApi = (id, data) => axiosInstance.put(`facility/rooms/${id}`, data);
export const deleteRoomApi = (id) => axiosInstance.delete(`facility/rooms/${id}`);