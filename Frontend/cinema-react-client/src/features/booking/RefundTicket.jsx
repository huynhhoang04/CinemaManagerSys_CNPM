import { useState } from 'react';
import axiosInstance from '../../config/axios';
import { deleteTicketApi } from '../booking/bookingApi';

const RefundTicket = () => {
    const [ticketId, setTicketId] = useState('');
    const [ticketInfo, setTicketInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    const handleSearch = async () => {
        if (!ticketId) return;
        setLoading(true);
        setError(null);
        setTicketInfo(null);
        setSuccessMessage('');
        
        try {
            // 1. Lấy thông tin vé - Sử dụng path chuẩn từ Booking.API
            const ticketRes = await axiosInstance.get(`/booking/tickets/${ticketId}`);
            const ticket = ticketRes.data;

            // 2. Lấy thông tin suất chiếu
            const showtimeRes = await axiosInstance.get(`/schedule/showtimes/${ticket.showtimeId}`);
            const showtime = showtimeRes.data;

            // 3. Lấy thông tin phim
            const movieRes = await axiosInstance.get(`/movie/movies/${showtime.movieId}`);
            const movie = movieRes.data;

            // 4. Lấy thông tin phòng
            const roomRes = await axiosInstance.get(`/facility/rooms/${showtime.roomId}`);
            const room = roomRes.data;

            setTicketInfo({
                ...ticket,
                showtime,
                movie,
                room
            });
        } catch (err) {
            setError(err.response?.data?.message || "Không tìm thấy thông tin vé.");
        } finally {
            setLoading(false);
        }
    };

    const calculateRefund = (showtimeStarted, price) => {
        const now = new Date();
        const started = new Date(showtimeStarted);
        const diffMs = started - now;
        const diffHours = diffMs / (1000 * 60 * 60);
        const diffDays = diffHours / 24;

        let percent = 0;
        let reason = "";

        if (diffDays >= 3) {
            percent = 1;
            reason = "Hoàn trước 3 ngày (100%)";
        } else if (diffDays >= 1) {
            percent = 0.5;
            reason = "Hoàn trước 1 ngày (50%)";
        } else if (diffHours >= 6) {
            percent = 0.3;
            reason = "Hoàn trước 6 tiếng (30%)";
        } else {
            percent = 0;
            reason = diffHours > 0 ? "Còn dưới 6 tiếng (0%)" : "Suất chiếu đã bắt đầu/kết thúc (0%)";
        }

        return {
            amount: price * percent,
            percent: percent * 100,
            reason
        };
    };

    const handleRefund = async () => {
        if (!ticketInfo) return;
        
        const refundData = calculateRefund(ticketInfo.showtime.started, ticketInfo.showtime.price);
        if (refundData.percent === 0) {
            alert("Vé này không đủ điều kiện hoàn tiền (0%).");
            return;
        }

        if (!window.confirm(`Bạn có chắc muốn hoàn vé này?\nSố tiền hoàn lại: ${refundData.amount.toLocaleString()} VND (${refundData.reason})`)) {
            return;
        }

        setLoading(true);
        try {
            await deleteTicketApi(ticketInfo.ticketId);
            setSuccessMessage(`Hoàn vé thành công! Số tiền hoàn lại: ${refundData.amount.toLocaleString()} VND`);
            setTicketInfo(null);
            setTicketId('');
        } catch (err) {
            setError("Lỗi khi thực hiện hoàn vé.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-black text-slate-800 mb-8 flex items-center">
                <span className="mr-3">🔄</span> HOÀN VÉ HỆ THỐNG
            </h1>

            <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 mb-8">
                <div className="flex gap-4">
                    <div className="flex-1">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Nhập mã vé (Ticket ID)</label>
                        <input 
                            type="text" 
                            value={ticketId}
                            onChange={(e) => setTicketId(e.target.value)}
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold text-lg"
                            placeholder="Ví dụ: 1025..."
                        />
                    </div>
                    <button 
                        onClick={handleSearch}
                        disabled={loading}
                        className="self-end px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl transition-all shadow-lg shadow-indigo-100"
                    >
                        {loading ? 'ĐANG TÌM...' : 'TÌM VÉ'}
                    </button>
                </div>
            </div>

            {error && (
                <div className="p-4 mb-6 bg-rose-50 text-rose-600 border border-rose-100 rounded-2xl font-medium animate-shake">
                    ⚠️ {error}
                </div>
            )}

            {successMessage && (
                <div className="p-6 mb-6 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-2xl font-bold text-center text-lg">
                    ✅ {successMessage}
                </div>
            )}

            {ticketInfo && (
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 animate-slideIn">
                    <div className="bg-indigo-700 p-6 text-white">
                        <h2 className="text-xl font-black uppercase tracking-tight">Chi tiết vé: #{ticketInfo.ticketId}</h2>
                    </div>
                    
                    <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase">Phim</p>
                                <p className="text-lg font-black text-slate-800">{ticketInfo.movie.title}</p>
                            </div>
                            <div className="flex gap-12">
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase">Ngày chiếu</p>
                                    <p className="font-bold text-slate-800">{new Date(ticketInfo.showtime.started).toLocaleDateString('vi-VN')}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase">Giờ chiếu</p>
                                    <p className="font-bold text-slate-800">{new Date(ticketInfo.showtime.started).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                </div>
                            </div>
                            <div className="flex gap-12">
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase">Phòng</p>
                                    <p className="font-bold text-slate-800">{ticketInfo.room.roomName}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase">Ghế</p>
                                    <p className="text-2xl font-black text-indigo-600">{ticketInfo.seatNumber}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-6">
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase">Giá vé gốc</p>
                                <p className="text-2xl font-black text-slate-800">{ticketInfo.showtime.price.toLocaleString()} VND</p>
                            </div>
                            
                            {(() => {
                                const refund = calculateRefund(ticketInfo.showtime.started, ticketInfo.showtime.price);
                                return (
                                    <>
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 uppercase">Chính sách hoàn tiền</p>
                                            <p className={`text-lg font-black ${refund.percent > 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                                                {refund.reason}
                                            </p>
                                        </div>
                                        <div className="pt-4 border-t border-slate-200">
                                            <p className="text-xs font-bold text-slate-400 uppercase">Số tiền hoàn lại</p>
                                            <p className="text-3xl font-black text-indigo-600">{refund.amount.toLocaleString()} VND</p>
                                        </div>
                                        <button 
                                            onClick={handleRefund}
                                            disabled={refund.percent === 0 || loading}
                                            className={`w-full py-4 rounded-2xl font-black text-white transition-all shadow-lg ${refund.percent > 0 ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-100' : 'bg-slate-300 cursor-not-allowed shadow-none'}`}
                                        >
                                            {loading ? 'ĐANG XỬ LÝ...' : 'XÁC NHẬN HOÀN VÉ'}
                                        </button>
                                    </>
                                );
                            })()}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RefundTicket;