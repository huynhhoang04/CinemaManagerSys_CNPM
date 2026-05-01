import axiosInstance from '../../config/axios';

export const getMoviesForBookingApi = () => axiosInstance.get('/movie');
export const getShowtimesByMovieApi = (movieId) => axiosInstance.get(`/showtime/movie/${movieId}`);
export const getRoomByIdApi = (roomId) => axiosInstance.get(`/room/${roomId}`);
export const getSoldSeatsApi = (showtimeId) => axiosInstance.get(`/ticket/showtime/${showtimeId}`);
export const createBookingApi = (data) => axiosInstance.post('/booking', data);