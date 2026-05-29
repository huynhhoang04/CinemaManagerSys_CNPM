import axiosInstance from '../../config/axios';

export const getMoviesForBookingApi = () => axiosInstance.get('movie/movies');
export const getShowtimesByMovieApi = (movieId) => axiosInstance.get(`schedule/showtimes/movie/${movieId}`);
export const getRoomByIdApi = (roomId) => axiosInstance.get(`facility/rooms/${roomId}`);
export const getSoldSeatsApi = (showtimeId) => axiosInstance.get(`/booking/tickets/showtime/${showtimeId}`);
export const getTicketByIdApi = (id) => axiosInstance.get(`/booking/tickets/${id}`);
export const deleteTicketApi = (id) => axiosInstance.delete(`/booking/tickets/${id}`);
export const createBookingApi = (data) => axiosInstance.post('/booking/bookings', data);