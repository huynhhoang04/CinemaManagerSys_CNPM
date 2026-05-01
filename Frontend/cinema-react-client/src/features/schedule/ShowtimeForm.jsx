import { useState, useEffect } from 'react';
import { createShowtimeApi, updateShowtimeApi, getRoomsByTheatreApi } from './scheduleApi';
import { Modal } from '../../components/Modal';

const ShowtimeForm = ({ isOpen, onClose, showtime, movies, theatres, currentRoomId, refreshData }) => {
    const [formData, setFormData] = useState({
        movieId: '',
        theatreId: '',
        roomId: currentRoomId || '',
        started: '',
        price: 0
    });
    const [rooms, setRooms] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (showtime && isOpen) {
            setFormData({
                movieId: showtime.movieId || '',
                theatreId: showtime.theatreId || '', 
                roomId: showtime.roomId || currentRoomId || '',
                started: showtime.started ? new Date(showtime.started).toISOString().slice(0, 16) : '',
                price: showtime.price || 0
            });
            if (showtime.theatreId) {
                loadRooms(showtime.theatreId);
            }
        } else if (isOpen) {
            setFormData({
                movieId: movies.length > 0 ? movies[0].movieId : '',
                theatreId: '',
                roomId: currentRoomId || '',
                started: '',
                price: 0
            });
            if (currentRoomId) {
                const theatre = theatres.find(t => t.rooms?.some(r => r.roomId === currentRoomId));
                if (theatre) {
                    setFormData(prev => ({ ...prev, theatreId: theatre.theatreId }));
                    loadRooms(theatre.theatreId);
                }
            }
        }
        setError(null);
    }, [showtime, isOpen, movies, theatres, currentRoomId]);

    const loadRooms = async (theatreId) => {
        try {
            const res = await getRoomsByTheatreApi(theatreId);
            setRooms(res.data);
        } catch (err) {
            setError('Lỗi truy xuất danh sách phòng');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        if (name === 'theatreId') {
            setFormData(prev => ({ ...prev, roomId: '' }));
            loadRooms(value);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        const payload = {
            movieId: parseInt(formData.movieId),
            roomId: parseInt(formData.roomId),
            started: new Date(formData.started).toISOString(),
            price: parseFloat(formData.price)
        };

        try {
            if (showtime) {
                await updateShowtimeApi(showtime.showtimeId, payload);
            } else {
                await createShowtimeApi(payload);
            }
            refreshData();
            onClose();
        } catch (err) {
            if (err.response && err.response.status === 409) {
                setError('Xung đột thời gian: Phòng chiếu đã có lịch trùng với khung giờ này.');
            } else {
                setError('Thao tác thất bại. Kiểm tra lại dữ liệu đầu vào.');
            }
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={showtime ? "Cập nhật Lịch chiếu" : "Thêm Lịch chiếu"}>
            {error && <div className="p-3 mb-4 text-white bg-red-500 rounded">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block mb-2 font-bold text-gray-700">Phim</label>
                    <select name="movieId" value={formData.movieId} onChange={handleChange} className="w-full px-3 py-2 border rounded" required>
                        <option value="">-- Chọn Phim --</option>
                        {movies.map(m => (
                            <option key={m.movieId} value={m.movieId}>{m.title}</option>
                        ))}
                    </select>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block mb-2 font-bold text-gray-700">Rạp</label>
                        <select name="theatreId" value={formData.theatreId} onChange={handleChange} className="w-full px-3 py-2 border rounded" required>
                            <option value="">-- Chọn Rạp --</option>
                            {theatres.map(t => (
                                <option key={t.theatreId} value={t.theatreId}>{t.theatreName}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block mb-2 font-bold text-gray-700">Phòng chiếu</label>
                        <select name="roomId" value={formData.roomId} onChange={handleChange} className="w-full px-3 py-2 border rounded" required disabled={!formData.theatreId}>
                            <option value="">-- Chọn Phòng --</option>
                            {rooms.map(r => (
                                <option key={r.roomId} value={r.roomId}>{r.roomName} ({r.roomType})</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="block mb-2 font-bold text-gray-700">Thời gian bắt đầu</label>
                        <input type="datetime-local" name="started" value={formData.started} onChange={handleChange} className="w-full px-3 py-2 border rounded" required />
                    </div>
                    <div>
                        <label className="block mb-2 font-bold text-gray-700">Giá vé (VND)</label>
                        <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full px-3 py-2 border rounded" required min="0" step="1000" />
                    </div>
                </div>
                <button type="submit" className="w-full px-4 py-2 font-bold text-white bg-blue-600 rounded">Lưu Dữ Liệu</button>
            </form>
        </Modal>
    );
};

export default ShowtimeForm;