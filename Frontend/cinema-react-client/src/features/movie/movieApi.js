import axiosInstance from '../../config/axios';

export const getAllGenresApi = () => axiosInstance.get('/movie/genres');
export const getAllMoviesApi = () => axiosInstance.get('/movie/movies');
export const getMovieByIdApi = (id) => axiosInstance.get(`/movie/movies/${id}`);
export const createMovieApi = (movieData) => axiosInstance.post('/movie/movies', movieData);
export const updateMovieApi = (id, movieData) => axiosInstance.put(`/movie/movies/${id}`, movieData);
export const deleteMovieApi = (id) => axiosInstance.delete(`/movie/movies/${id}`);