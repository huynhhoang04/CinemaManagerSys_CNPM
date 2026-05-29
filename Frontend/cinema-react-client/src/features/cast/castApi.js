import axiosInstance from '../../config/axios';

export const getAllActorsApi = () => axiosInstance.get('cast/actors');
export const createActorApi = (data) => axiosInstance.post('cast/actors', data);
export const updateActorApi = (id, data) => axiosInstance.put(`/cast/actors/${id}`, data);
export const deleteActorApi = (id) => axiosInstance.delete(`/cast/actors/${id}`);
export const getActorsByMovieApi = (movieId) => axiosInstance.get(`/cast/actors/movie/${movieId}`);
export const assignActorsToMovieApi = (movieId, data) => axiosInstance.post(`/cast/actors/movie/${movieId}`, data);

export const getAllDirectorsApi = () => axiosInstance.get('/cast/directors');
export const createDirectorApi = (data) => axiosInstance.post('/cast/directors', data);
export const updateDirectorApi = (id, data) => axiosInstance.put(`/cast/directors/${id}`, data);
export const deleteDirectorApi = (id) => axiosInstance.delete(`/cast/directors/${id}`);
export const getDirectorsByMovieApi = (movieId) => axiosInstance.get(`/cast/directors/movie/${movieId}`);
export const assignDirectorsToMovieApi = (movieId, data) => axiosInstance.post(`/cast/directors/movie/${movieId}`, data);