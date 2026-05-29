import { useState, useEffect } from 'react';
import { 
    getMoviesForBookingApi, 
    getShowtimesByMovieApi, 
    getRoomByIdApi, 
    getSoldSeatsApi, 
    createBookingApi 
} from './bookingApi';
import useAuthStore from '../../store/authStore';
import useTheatreStore from '../../store/theatreStore';
import { jsPDF } from 'jspdf';

const POSScreen = () => {
    const user = useAuthStore(state => state.user);
    const { selectedTheatre } = useTheatreStore();
    
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
    
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('Tiền mặt');

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
                setSoldSeats(Array.isArray(seatsRes.data) ? seatsRes.data : []);
                setSelectedSeats([]);
            } catch (err) {
                setError('Lỗi tải sơ đồ ghế');
            }
        };
        fetchSeatData();
    }, [selectedShowtime]);

    const generateTicketPDF = (bookingData) => {
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: [80, 150]
        });

        const movieTitle = movies.find(m => m.movieId == selectedMovieId)?.title || "N/A";
        const dateStr = new Date(selectedShowtime.started).toLocaleDateString('vi-VN');
        const timeStr = new Date(selectedShowtime.started).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        // Header
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text("CINEMA TICKET", 40, 15, { align: "center" });
        
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.text(selectedTheatre?.theatreName || "Cinema System", 40, 20, { align: "center" });
        doc.text(selectedTheatre?.location || "Address", 40, 24, { align: "center" });

        doc.setLineWidth(0.5);
        doc.line(5, 28, 75, 28);

        // Body
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text("PHIM: " + movieTitle.toUpperCase(), 5, 38);

        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.text(`Ngay: ${dateStr}`, 5, 46);
        doc.text(`Gio: ${timeStr}`, 45, 46);
        doc.text(`Phong: ${room?.roomName || selectedShowtime.roomId}`, 5, 52);

        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text(`GHE: ${selectedSeats.join(", ")}`, 40, 65, { align: "center" });

        doc.setLineWidth(0.2);
        doc.line(5, 75, 75, 75);

        // Footer
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        
        // Liệt kê chi tiết Ticket ID cho từng ghế
        let yPos = 85;
        doc.text("CHI TIET VE (TICKET IDS):", 5, yPos);
        yPos += 5;
        
        if (bookingData.tickets && Array.isArray(bookingData.tickets)) {
            bookingData.tickets.forEach((t, idx) => {
                doc.text(`- Ghe ${t.seatNumber}: ID ${t.ticketId}`, 8, yPos);
                yPos += 4;
            });
        }

        doc.text(`PT Thanh toan: ${paymentMethod}`, 5, yPos + 2);
        doc.text(`Nhan vien: ${user?.fullname || user?.username}`, 5, yPos + 7);

        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        const total = selectedSeats.length * selectedShowtime.price;
        doc.text(`TONG TIEN: ${total.toLocaleString()} VND`, 40, yPos + 20, { align: "center" });

        doc.setFontSize(7);
        doc.setFont("helvetica", "italic");
        doc.text("Chuc quy khach xem phim vui ve!", 40, yPos + 30, { align: "center" });

        // Barcode placeholder
        doc.rect(20, yPos + 35, 40, 10);
        doc.setFontSize(6);
        doc.text(`*BK-${bookingData.bookingId || "0000"}*`, 40, yPos + 47, { align: "center" });

        doc.save(`Ve_Xem_Phim_${bookingData.bookingId}.pdf`);
    };

    const handleSeatClick = (seatNumber) => {
        if (soldSeats.includes(seatNumber)) return;
        
        if (selectedSeats.includes(seatNumber)) {
            setSelectedSeats(selectedSeats.filter(s => s !== seatNumber));
        } else {
            setSelectedSeats([...selectedSeats, seatNumber]);
        }
    };

    const handleCheckout = async () => {
        setIsProcessing(true);
        setError(null);
        setSuccessMessage('');

        const totalPayment = selectedSeats.length * selectedShowtime.price;

        const payload = {
            userId: user?.userId || 1, 
            showtimeId: selectedShowtime.showtimeId,
            seatNumbers: selectedSeats,
            total: totalPayment,
            paymentMethod: paymentMethod
        };

        try {
            const res = await createBookingApi(payload);
            const bookingData = res.data;
            
            setSuccessMessage(`Thanh toán thành công ${selectedSeats.length} vé. Tổng tiền: ${totalPayment.toLocaleString()} VND`);
            setShowPaymentModal(false);
            
            // Tự động in vé
            generateTicketPDF(bookingData);
            
            // Refresh seats
            const seatsRes = await getSoldSeatsApi(selectedShowtime.showtimeId);
            setSoldSeats(Array.isArray(seatsRes.data) ? seatsRes.data : []);
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
            
            const startSeatIndex = r * seatsPerRow + 1;
            const endSeatIndex = Math.min((r + 1) * seatsPerRow, capacity);
            const actualSeatsInRow = endSeatIndex - startSeatIndex + 1;

            for (let c = 1; c <= seatsPerRow; c++) {
                const seatIndex = r * seatsPerRow + c;
                if (seatIndex > capacity) break;

                const seatNumber = `${rowLabel}${c}`;
                const isSold = soldSeats.includes(seatNumber);
                const isSelected = selectedSeats.includes(seatNumber);

                let seatClass = "w-10 h-10 m-1 text-xs font-bold rounded cursor-pointer flex items-center justify-center transition-all duration-200 ";
                if (isSold) {
                    seatClass = "w-10 h-10 m-1 text-xs font-bold rounded flex items-center justify-center bg-slate-200 text-slate-400 cursor-not-allowed border-2 border-slate-300 pointer-events-none";
                } else if (isSelected) {
                    seatClass += "bg-emerald-500 text-white shadow-md transform scale-105 border-2 border-emerald-200";
                } else {
                    seatClass += "bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-50 hover:border-indigo-400 shadow-sm";
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
                <div key={`row-${rowLabel}`} className="flex justify-center items-center">
                    <div className="w-8 font-black text-slate-400 text-sm">{rowLabel}</div>
                    <div className={`flex ${actualSeatsInRow < seatsPerRow ? 'justify-center' : ''}`}>
                        {rowSeats}
                    </div>
                    <div className="w-8 font-black text-slate-400 text-sm text-right">{rowLabel}</div>
                </div>
            );
        }

        return (
            <div className="p-8 bg-slate-50 border rounded-2xl shadow-inner">
                <div className="w-4/5 mx-auto h-2 bg-gradient-to-r from-slate-300 via-slate-500 to-slate-300 rounded-full mb-2 shadow-sm"></div>
                <p className="text-center text-[10px] font-bold text-slate-400 mb-12 tracking-[1em]">MÀN HÌNH</p>
                
                <div className="space-y-1">
                    {seatElements}
                </div>

                <div className="flex justify-center mt-12 space-x-8 text-xs font-bold uppercase tracking-wider">
                    <div className="flex items-center"><div className="w-4 h-4 mr-2 bg-gray-400 rounded-sm"></div> Đã bán</div>
                    <div className="flex items-center"><div className="w-4 h-4 mr-2 bg-white border border-indigo-200 rounded-sm"></div> Ghế trống</div>
                    <div className="flex items-center"><div className="w-4 h-4 mr-2 bg-emerald-500 rounded-sm"></div> Đang chọn</div>
                </div>
            </div>
        );
    };

    return (
        <div className="flex h-[calc(100vh-120px)] gap-6">
            <div className="w-1/3 flex flex-col gap-6">
                <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-200">
                    <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                        <span className="bg-indigo-100 text-indigo-600 w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2">1</span>
                        Chọn Phim
                    </h2>
                    <select 
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
                        value={selectedMovieId}
                        onChange={(e) => setSelectedMovieId(e.target.value)}
                    >
                        <option value="">-- Danh sách phim đang chiếu --</option>
                        {movies.map(m => <option key={m.movieId} value={m.movieId}>{m.title}</option>)}
                    </select>
                </div>

                <div className="flex-1 p-6 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                    <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                        <span className="bg-indigo-100 text-indigo-600 w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2">2</span>
                        Suất Chiếu
                    </h2>
                    
                    <div className="flex-1 overflow-y-auto pr-2 space-y-3">
                        {showtimes.length > 0 ? (
                            showtimes.map(st => (
                                <div 
                                    key={st.showtimeId} 
                                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedShowtime?.showtimeId === st.showtimeId ? 'bg-indigo-50 border-indigo-500 shadow-md ring-2 ring-indigo-200' : 'bg-slate-50 border-slate-100 hover:border-indigo-300'}`}
                                    onClick={() => setSelectedShowtime(st)}
                                >
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-xl font-black text-indigo-600">
                                            {new Date(st.started).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                        <span className="px-2 py-1 bg-white rounded-lg text-[10px] font-bold text-slate-500 border border-slate-100">
                                            PHÒNG {st.roomId}
                                        </span>
                                    </div>
                                    <div className="text-sm font-bold text-slate-600">
                                        Giá vé: <span className="text-rose-500">{st.price.toLocaleString()} VND</span>
                                    </div>
                                </div>
                            ))
                        ) : selectedMovieId ? (
                            <div className="text-center py-10 text-slate-400">Không có suất chiếu.</div>
                        ) : (
                            <div className="text-center py-10 text-slate-400">Vui lòng chọn phim trước.</div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h2 className="text-lg font-bold text-slate-800 flex items-center">
                        <span className="bg-indigo-100 text-indigo-600 w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2">3</span>
                        Sơ đồ Ghế
                    </h2>
                    {selectedShowtime && (
                        <div className="flex gap-4">
                            <div className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold">
                                {selectedSeats.length} Ghế đã chọn
                            </div>
                            <div className="px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-xs font-bold">
                                {(selectedSeats.length * selectedShowtime.price).toLocaleString()} VND
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex-1 p-6 overflow-y-auto">
                    {error && <div className="p-4 mb-4 bg-rose-50 text-rose-600 border border-rose-100 rounded-xl font-medium">{error}</div>}
                    {successMessage && <div className="p-4 mb-4 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl font-medium">{successMessage}</div>}

                    {!selectedShowtime ? (
                        <div className="flex flex-col items-center justify-center h-full text-slate-300">
                            <div className="text-8xl mb-4">💺</div>
                            <p className="text-xl font-bold">Vui lòng chọn phim và suất chiếu</p>
                            <p className="text-sm">Sơ đồ ghế sẽ được hiển thị tại đây.</p>
                        </div>
                    ) : (
                        renderSeatMap()
                    )}
                </div>

                {selectedSeats.length > 0 && (
                    <div className="p-6 bg-slate-50 border-t border-slate-100">
                        <button 
                            onClick={() => setShowPaymentModal(true)}
                            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl text-lg shadow-lg shadow-indigo-200 transition-all flex items-center justify-center space-x-2"
                        >
                            <span>TIẾN HÀNH THANH TOÁN</span>
                            <span className="bg-indigo-500 px-2 py-0.5 rounded-lg text-sm">{(selectedSeats.length * selectedShowtime.price).toLocaleString()}đ</span>
                        </button>
                    </div>
                )}
            </div>

            {showPaymentModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl transform transition-all">
                        <div className="p-6 bg-indigo-700 text-white flex justify-between items-center">
                            <h3 className="text-xl font-black">CHI TIẾT THANH TOÁN</h3>
                            <button onClick={() => setShowPaymentModal(false)} className="text-indigo-200 hover:text-white text-2xl">×</button>
                        </div>
                        
                        <div className="p-8">
                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between items-center text-slate-500 font-medium">
                                    <span>Rạp:</span>
                                    <span className="text-slate-800 font-bold">{selectedTheatre?.theatreName}</span>
                                </div>
                                <div className="flex justify-between items-center text-slate-500 font-medium">
                                    <span>Suất chiếu:</span>
                                    <span className="text-slate-800 font-bold">
                                        {new Date(selectedShowtime.started).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-slate-500 font-medium">
                                    <span>Ghế đã chọn:</span>
                                    <div className="flex gap-1 flex-wrap justify-end max-w-[200px]">
                                        {selectedSeats.map(s => <span key={s} className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold">{s}</span>)}
                                    </div>
                                </div>
                                <div className="h-px bg-slate-100 my-4"></div>
                                
                                <div>
                                    <p className="text-sm font-bold text-slate-500 mb-3">PHƯƠNG THỨC THANH TOÁN</p>
                                    <div className="grid grid-cols-2 gap-3">
                                        {['Tiền mặt', 'Chuyển khoản', 'Thẻ ATM', 'Momo'].map(method => (
                                            <div 
                                                key={method}
                                                onClick={() => setPaymentMethod(method)}
                                                className={`p-3 border-2 rounded-xl cursor-pointer text-center font-bold text-sm transition-all ${paymentMethod === method ? 'border-indigo-600 bg-indigo-50 text-indigo-600 shadow-sm' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}
                                            >
                                                {method}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="h-px bg-slate-100 my-4"></div>
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-bold text-slate-800">TỔNG TIỀN</span>
                                    <span className="text-3xl font-black text-rose-500">
                                        {(selectedSeats.length * selectedShowtime.price).toLocaleString()}đ
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <button 
                                    onClick={() => setShowPaymentModal(false)}
                                    className="py-4 border-2 border-slate-100 rounded-2xl text-slate-400 font-bold hover:bg-slate-50 transition-all"
                                >
                                    HỦY
                                </button>
                                <button 
                                    onClick={handleCheckout}
                                    disabled={isProcessing}
                                    className="py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-2xl shadow-lg shadow-emerald-100 transition-all"
                                >
                                    {isProcessing ? 'ĐANG XỬ LÝ...' : 'XÁC NHẬN'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default POSScreen;