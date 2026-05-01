import { useState, useEffect } from 'react';
import { getShowtimesByRoomApi, deleteShowtimeApi, getMoviesApi, getTheatresApi, getRoomsByTheatreApi } from './scheduleApi';
import { Table } from '../../components/Table';
import ShowtimeForm from './ShowtimeForm';

const ScheduleManagement = () => {
    const [movies, setMovies] = useState([]);
    const [theatres, setTheatres] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [showtimes, setShowtimes] = useState([]);
    
    const [selectedTheatreId, setSelectedTheatreId] = useState('');
    const [selectedRoomId, setSelectedRoomId] = useState('');
    
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeShowtime, setActiveShowtime] = useState(null);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [moviesRes, theatresRes] = await Promise.all([
                    getMoviesApi(),
                    getTheatresApi()
                ]);
                setMovies(moviesRes.data);
                setTheatres(theatresRes.data);
            } catch (err) {
                setError('Lỗi tải dữ liệu danh mục ban đầu.');
            }
        };
        fetchInitialData();
    }, []);

    useEffect(() => {
        const fetchRooms = async () => {
            if (!selectedTheatreId) {
                setRooms([]);
                setSelectedRoomId('');
                return;
            }
            try {
                const res = await getRoomsByTheatreApi(selectedTheatreId);
                setRooms(res.data);
            } catch (err) {
                setError('Lỗi tải danh sách phòng chiếu.');
            }
        };
        fetchRooms();
    }, [selectedTheatreId]);

    const fetchShowtimes = async () => {
        if (!selectedRoomId) {
            setShowtimes([]);
            return;
        }
        try {
            const res = await getShowtimesByRoomApi(selectedRoomId);
            setShowtimes(res.data);
        } catch (err) {
            setError('Lỗi tải lịch chiếu.');
        }
    };

    useEffect(() => {
        fetchShowtimes();
    }, [selectedRoomId]);

    const handleDelete = async (id) => {
        if (!window.confirm("Xác nhận xóa suất chiếu này? Hành động này sẽ bị từ chối nếu đã có vé được bán.")) return;
        try {
            await deleteShowtimeApi(id);
            fetchShowtimes();
        } catch (err) {
            setError('Không thể xóa. Có thể vé đã được bán cho suất chiếu này.');
        }
    };

    const openAddModal = () => {
        setActiveShowtime(null);
        setIsModalOpen(true);
    };

    const openEditModal = (showtime) => {
        setActiveShowtime(showtime);
        setIsModalOpen(true);
    };

    const getMovieTitle = (movieId) => {
        const movie = movies.find(m => m.movieId === movieId);
        return movie ? movie.title : 'N/A';
    };

    return (
        <div className="p-6">
            <h2 className="mb-6 text-2xl font-bold text-gray-800">Quản lý Lịch chiếu (Schedule)</h2>
            {error && <div className="p-3 mb-4 text-white bg-red-500 rounded">{error}</div>}

            <div className="p-4 mb-6 bg-white border rounded shadow-sm">
                <h3 className="mb-4 font-bold text-gray-700">Bộ lọc Lịch chiếu</h3>
                <div className="flex space-x-4">
                    <div className="flex-1">
                        <select className="w-full px-3 py-2 border rounded" value={selectedTheatreId} onChange={(e) => setSelectedTheatreId(e.target.value)}>
                            <option value="">-- Chọn Rạp --</option>
                            {theatres.map(t => (
                                <option key={t.theatreId} value={t.theatreId}>{t.theatreName}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex-1">
                        <select className="w-full px-3 py-2 border rounded" value={selectedRoomId} onChange={(e) => setSelectedRoomId(e.target.value)} disabled={!selectedTheatreId}>
                            <option value="">-- Chọn Phòng chiếu --</option>
                            {rooms.map(r => (
                                <option key={r.roomId} value={r.roomId}>{r.roomName} ({r.roomType})</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="mb-4">
                <button 
                    onClick={openAddModal} 
                    disabled={!selectedRoomId}
                    className={`px-4 py-2 font-bold text-white rounded ${selectedRoomId ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-400 cursor-not-allowed'}`}
                >
                    Thêm Suất chiếu Mới
                </button>
            </div>

            {selectedRoomId ? (
                <Table 
                    headers={['ID', 'Phim', 'Thời gian bắt đầu', 'Giá vé', 'Thao tác']}
                    data={showtimes}
                    renderRow={(s) => (
                        <>
                            <td className="px-4 py-3">{s.showtimeId}</td>
                            <td className="px-4 py-3 font-semibold text-blue-800">{getMovieTitle(s.movieId)}</td>
                            <td className="px-4 py-3">{new Date(s.started).toLocaleString()}</td>
                            <td className="px-4 py-3 font-medium text-green-700">{s.price.toLocaleString()} VND</td>
                            <td className="px-4 py-3 space-x-2">
                                <button onClick={() => openEditModal({ ...s, theatreId: selectedTheatreId })} className="px-3 py-1 text-white bg-blue-500 rounded hover:bg-blue-600">Sửa</button>
                                <button onClick={() => handleDelete(s.showtimeId)} className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600">Xóa</button>
                            </td>
                        </>
                    )}
                />
            ) : (
                <div className="py-8 text-center text-gray-500 bg-white border rounded">
                    Vui lòng chọn Rạp và Phòng chiếu để xem lịch.
                </div>
            )}

            <ShowtimeForm 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                showtime={activeShowtime} 
                movies={movies}
                theatres={theatres}
                currentRoomId={selectedRoomId}
                refreshData={fetchShowtimes} 
            />
        </div>
    );
};

export default ScheduleManagement;