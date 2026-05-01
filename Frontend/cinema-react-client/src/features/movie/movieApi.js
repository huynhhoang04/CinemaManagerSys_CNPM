import axiosInstance from '../../config/axios';

export const getAllGenresApi = () => axiosInstance.get('/genre');
export const getAllMoviesApi = () => axiosInstance.get('/movie');
export const getMovieByIdApi = (id) => axiosInstance.get(`/movie/${id}`);
export const createMovieApi = (movieData) => axiosInstance.post('/movie', movieData);
export const updateMovieApi = (id, movieData) => axiosInstance.put(`/movie/${id}`, movieData);
export const deleteMovieApi = (id) => axiosInstance.delete(`/movie/${id}`);