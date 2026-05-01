import axiosInstance from '../../config/axios';

export const getShowtimesByRoomApi = (roomId) => axiosInstance.get(`/showtime/room/${roomId}`);
export const getShowtimesByMovieApi = (movieId) => axiosInstance.get(`/showtime/movie/${movieId}`);
export const createShowtimeApi = (data) => axiosInstance.post('/showtime', data);
export const updateShowtimeApi = (id, data) => axiosInstance.put(`/showtime/${id}`, data);
export const deleteShowtimeApi = (id) => axiosInstance.delete(`/showtime/${id}`);

export const getMoviesApi = () => axiosInstance.get('/movie');
export const getTheatresApi = () => axiosInstance.get('/theatre');
export const getRoomsByTheatreApi = (theatreId) => axiosInstance.get(`/room/theatre/${theatreId}`);