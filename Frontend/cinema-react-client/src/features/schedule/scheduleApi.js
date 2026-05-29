import axiosInstance from '../../config/axios';

export const getShowtimesByRoomApi = (roomId) => axiosInstance.get(`schedule/showtimes/room/${roomId}`);
export const getShowtimesByMovieApi = (movieId) => axiosInstance.get(`schedule/showtimes/movie/${movieId}`);
export const createShowtimeApi = (data) => axiosInstance.post('schedule/showtimes', data);
export const updateShowtimeApi = (id, data) => axiosInstance.put(`schedule/showtimes/${id}`, data);
export const deleteShowtimeApi = (id) => axiosInstance.delete(`schedule/showtimes/${id}`);

export const getMoviesApi = () => axiosInstance.get('movie/movies');
export const getTheatresApi = () => axiosInstance.get('/facility/theatres');
export const getRoomsByTheatreApi = (theatreId) => axiosInstance.get(`/facility/rooms/theatre/${theatreId}`);