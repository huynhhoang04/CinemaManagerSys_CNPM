import { useState, useEffect } from 'react';
import { 
    getMoviesForBookingApi, 
    getShowtimesByMovieApi, 
    getRoomByIdApi, 
    getSoldSeatsApi, 
    createBookingApi 
} from './bookingApi';
import useAuthStore from '../../store/authStore';

const POSScreen = () => {
    const user = useAuthStore(state => state.user);
    const [movies, setMovies] = useState([]);
    const [selectedMovieId, setSelectedMovieId] = useState('');
    
    const [showtimes, setShowtimes] = useState([]);
    const [selectedShowtime, setSelectedShowtime] = useState(null);
    
    const [room, setRoom] = useState(null);
    const [soldSeats, setSoldSeats] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);
    
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const res = await getMoviesForBookingApi();
                setMovies(res.data.filter(m => m.movieStatus === 'Active'));
            } catch (err) {
                setError('Lỗi tải danh sách phim');
            }
        };
        fetchMovies();
    }, []);

    useEffect(() => {
        const fetchShowtimes = async () => {
            if (!selectedMovieId) {
                setShowtimes([]);
                setSelectedShowtime(null);
                return;
            }
            try {
                const res = await getShowtimesByMovieApi(selectedMovieId);
                setShowtimes(res.data);
            } catch (err) {
                setError('Lỗi tải lịch chiếu');
            }
        };
        fetchShowtimes();
    }, [selectedMovieId]);

    useEffect(() => {
        const fetchSeatData = async () => {
            if (!selectedShowtime) {
                setRoom(null);
                setSoldSeats([]);
                setSelectedSeats([]);
                return;
            }
            try {
                const [roomRes, seatsRes] = await Promise.all([
                    getRoomByIdApi(selectedShowtime.roomId),
                    getSoldSeatsApi(selectedShowtime.showtimeId)
                ]);
                setRoom(roomRes.data);
                setSoldSeats(seatsRes.data.map(s => s.seatNumber));
                setSelectedSeats([]);
            } catch (err) {
                setError('Lỗi tải sơ đồ ghế');
            }
        };
        fetchSeatData();
    }, [selectedShowtime]);

    const handleSeatClick = (seatNumber) => {
        if (soldSeats.includes(seatNumber)) return;
        
        if (selectedSeats.includes(seatNumber)) {
            setSelectedSeats(selectedSeats.filter(s => s !== seatNumber));
        } else {
            setSelectedSeats([...selectedSeats, seatNumber]);
        }
    };

    const handleCheckout = async () => {
        if (selectedSeats.length === 0) return;
        setIsProcessing(true);
        setError(null);
        setSuccessMessage('');

        const totalPayment = selectedSeats.length * selectedShowtime.price;

        const payload = {
            userId: user?.userId || 1, 
            showtimeId: selectedShowtime.showtimeId,
            seatNumbers: selectedSeats,
            totalPayment: totalPayment,
            paymentMethod: 'Cash'
        };

        try {
            await createBookingApi(payload);
            setSuccessMessage(`Thanh toán thành công ${selectedSeats.length} vé. Tổng tiền: ${totalPayment.toLocaleString()} VND`);
            
            const seatsRes = await getSoldSeatsApi(selectedShowtime.showtimeId);
            setSoldSeats(seatsRes.data.map(s => s.seatNumber));
            setSelectedSeats([]);
        } catch (err) {
            setError('Giao dịch thất bại. Vui lòng thử lại.');
        } finally {
            setIsProcessing(false);
        }
    };

    const renderSeatMap = () => {
        if (!room) return null;
        
        const capacity = room.capacity || 0;
        const seatsPerRow = 10;
        const rows = Math.ceil(capacity / seatsPerRow);
        const seatElements = [];

        for (let r = 0; r < rows; r++) {
            const rowLabel = String.fromCharCode(65 + r);
            const rowSeats = [];
            
            for (let c = 1; c <= seatsPerRow; c++) {
                const seatIndex = r * seatsPerRow + c;
                if (seatIndex > capacity) break;

                const seatNumber = `${rowLabel}${c}`;
                const isSold = soldSeats.includes(seatNumber);
                const isSelected = selectedSeats.includes(seatNumber);

                let seatClass = "w-10 h-10 m-1 text-xs font-bold rounded cursor-pointer flex items-center justify-center transition-colors ";
                if (isSold) {
                    seatClass += "bg-gray-400 text-gray-700 cursor-not-allowed";
                } else if (isSelected) {
                    seatClass += "bg-green-500 text-white hover:bg-green-600";
                } else {
                    seatClass += "bg-blue-100 text-blue-800 border border-blue-300 hover:bg-blue-300";
                }

                rowSeats.push(
                    <div 
                        key={seatNumber} 
                        className={seatClass}
                        onClick={() => handleSeatClick(seatNumber)}
                    >
                        {seatNumber}
                    </div>
                );
            }
            
            seatElements.push(
                <div key={`row-${rowLabel}`} className="flex justify-center">
                    <div className="flex items-center justify-center w-8 font-bold text-gray-500">{rowLabel}</div>
                    <div className="flex">{rowSeats}</div>
                </div>
            );
        }

        return (
            <div className="p-6 bg-white border rounded shadow">
                <div className="w-full py-2 mb-8 font-bold text-center text-white bg-slate-800 rounded-xl">
                    MÀN HÌNH
                </div>
                <div className="space-y-2">
                    {seatElements}
                </div>
                <div className="flex justify-center mt-8 space-x-6 text-sm">
                    <div className="flex items-center"><div className="w-4 h-4 mr-2 bg-gray-400 rounded"></div> Đã bán</div>
                    <div className="flex items-center"><div className="w-4 h-4 mr-2 bg-blue-100 border border-blue-300 rounded"></div> Trống</div>
                    <div className="flex items-center"><div className="w-4 h-4 mr-2 bg-green-500 rounded"></div> Đang chọn</div>
                </div>
            </div>
        );
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <div className="w-1/3 p-4 overflow-y-auto bg-white border-r shadow-sm">
                <h2 className="mb-4 text-xl font-bold text-gray-800">1. Chọn Phim & Suất Chiếu</h2>
                
                <div className="mb-6">
                    <label className="block mb-2 font-bold text-gray-700">Phim đang chiếu</label>
                    <select 
                        className="w-full px-3 py-2 border rounded"
                        value={selectedMovieId}
                        onChange={(e) => setSelectedMovieId(e.target.value)}
                    >
                        <option value="">-- Chọn Phim --</option>
                        {movies.map(m => <option key={m.movieId} value={m.movieId}>{m.title}</option>)}
                    </select>
                </div>

                {showtimes.length > 0 && (
                    <div>
                        <label className="block mb-2 font-bold text-gray-700">Suất chiếu trong ngày</label>
                        <div className="space-y-2">
                            {showtimes.map(st => (
                                <div 
                                    key={st.showtimeId} 
                                    className={`p-3 border rounded cursor-pointer transition-all ${selectedShowtime?.showtimeId === st.showtimeId ? 'bg-blue-50 border-blue-500 shadow-md' : 'hover:bg-gray-50'}`}
                                    onClick={() => setSelectedShowtime(st)}
                                >
                                    <div className="font-bold text-blue-800">{new Date(st.started).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                    <div className="text-sm text-gray-600">Phòng ID: {st.roomId} - Giá: {st.price.toLocaleString()} VND</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {selectedMovieId && showtimes.length === 0 && (
                    <div className="text-gray-500">Không có suất chiếu nào cho phim này.</div>
                )}
            </div>

            <div className="flex flex-col w-2/3 p-4 overflow-y-auto">
                <h2 className="mb-4 text-xl font-bold text-gray-800">2. Sơ đồ Ghế (Seat Map)</h2>
                {error && <div className="p-3 mb-4 text-white bg-red-500 rounded">{error}</div>}
                {successMessage && <div className="p-3 mb-4 text-white bg-green-500 rounded">{successMessage}</div>}

                {!selectedShowtime ? (
                    <div className="flex items-center justify-center flex-1 text-gray-500 border-2 border-dashed rounded-lg">
                        Vui lòng chọn suất chiếu để hiển thị sơ đồ ghế.
                    </div>
                ) : (
                    <>
                        <div className="flex-1 mb-4">
                            {renderSeatMap()}
                        </div>

                        <div className="p-6 bg-white border rounded shadow">
                            <h3 className="mb-4 text-lg font-bold border-b text-slate-800">Thông tin Thanh toán</h3>
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-600">Ghế đã chọn:</span>
                                <span className="font-bold">{selectedSeats.length > 0 ? selectedSeats.join(', ') : 'Chưa chọn'}</span>
                            </div>
                            <div className="flex justify-between mb-4">
                                <span className="text-gray-600">Tổng tiền:</span>
                                <span className="text-xl font-bold text-red-600">{(selectedSeats.length * selectedShowtime.price).toLocaleString()} VND</span>
                            </div>
                            <button 
                                onClick={handleCheckout}
                                disabled={selectedSeats.length === 0 || isProcessing}
                                className={`w-full py-3 font-bold text-white rounded text-lg ${selectedSeats.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                            >
                                {isProcessing ? 'Đang xử lý...' : 'THANH TOÁN & IN VÉ'}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default POSScreen;