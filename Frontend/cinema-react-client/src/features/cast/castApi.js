import axiosInstance from '../../config/axios';

export const getAllActorsApi = () => axiosInstance.get('/actor');
export const createActorApi = (data) => axiosInstance.post('/actor', data);
export const updateActorApi = (id, data) => axiosInstance.put(`/actor/${id}`, data);
export const getActorsByMovieApi = (movieId) => axiosInstance.get(`/actor/movie/${movieId}`);
export const assignActorsToMovieApi = (movieId, data) => axiosInstance.post(`/actor/movie/${movieId}`, data);

export const getAllDirectorsApi = () => axiosInstance.get('/director');
export const createDirectorApi = (data) => axiosInstance.post('/director', data);
export const updateDirectorApi = (id, data) => axiosInstance.put(`/director/${id}`, data);
export const getDirectorsByMovieApi = (movieId) => axiosInstance.get(`/director/movie/${movieId}`);
export const assignDirectorsToMovieApi = (movieId, data) => axiosInstance.post(`/director/movie/${movieId}`, data);