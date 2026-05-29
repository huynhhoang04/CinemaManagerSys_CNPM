import { useState, useEffect } from 'react';
import { createTheatreApi, updateTheatreApi, getRoomsByTheatreApi, createRoomApi, updateRoomApi, deleteRoomApi } from './facilityApi';
import { Modal } from '../../components/Modal';

const TheatreForm = ({ isOpen, onClose, theatre, refreshData }) => {
    const [theatreData, setTheatreData] = useState({
        theatreName: '', location: '', city: '', previewUrl: '', info: '', theatreStatus: 'Active', coordinates: ''
    });
    
    const [rooms, setRooms] = useState([]);
    const [deletedRoomIds, setDeletedRoomIds] = useState([]);
    
    const [newRoom, setNewRoom] = useState({
        roomName: '', roomType: '2D', capacity: 0, roomStatus: 'Active'
    });

    const [error, setError] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        const fetchRooms = async (theatreId) => {
            try {
                const res = await getRoomsByTheatreApi(theatreId);
                setRooms(res.data);
            } catch (err) {
                setError('Lỗi tải danh sách phòng');
            }
        };

        if (theatre && isOpen) {
            setTheatreData({
                theatreName: theatre.theatreName || '', location: theatre.location || '', city: theatre.city || '',
                previewUrl: theatre.previewUrl || '', info: theatre.info || '', theatreStatus: theatre.theatreStatus || 'Active',
                coordinates: theatre.coordinates || ''
            });
            fetchRooms(theatre.theatreId);
        } else {
            setTheatreData({ theatreName: '', location: '', city: '', previewUrl: '', info: '', theatreStatus: 'Active', coordinates: '' });
            setRooms([]);
        }
        setDeletedRoomIds([]);
        setNewRoom({ roomName: '', roomType: '2D', capacity: 0, roomStatus: 'Active' });
        setError(null);
    }, [theatre, isOpen]);

    const handleTheatreChange = (e) => {
        const { name, value } = e.target;
        setTheatreData(prev => ({ ...prev, [name]: value }));
    };

    const handleNewRoomChange = (e) => {
        const { name, value } = e.target;
        setNewRoom(prev => ({ ...prev, [name]: value }));
    };

    const handleAddRoomLocal = () => {
        if (!newRoom.roomName || newRoom.capacity <= 0) {
            alert("Vui lòng nhập đầy đủ Tên và Sức chứa (> 0)");
            return;
        }
        setRooms([...rooms, { ...newRoom, tempId: Date.now() }]);
        setNewRoom({ roomName: '', roomType: '2D', capacity: 0, roomStatus: 'Active' });
    };

    const handleRemoveRoomLocal = (index, room) => {
        if (room.roomId) {
            setDeletedRoomIds([...deletedRoomIds, room.roomId]);
        }
        const updatedRooms = [...rooms];
        updatedRooms.splice(index, 1);
        setRooms(updatedRooms);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsProcessing(true);

        try {
            let currentTheatreId = theatre?.theatreId;

            if (currentTheatreId) {
                await updateTheatreApi(currentTheatreId, theatreData);
            } else {
                const res = await createTheatreApi(theatreData);
                currentTheatreId = res.data.theatreId; 
            }

            for (let id of deletedRoomIds) {
                await deleteRoomApi(id);
            }

            for (let room of rooms) {
                const roomPayload = {
                    theatreId: currentTheatreId,
                    roomName: room.roomName,
                    roomType: room.roomType,
                    capacity: parseInt(room.capacity),
                    roomStatus: room.roomStatus
                };

                if (room.roomId) {
                    await updateRoomApi(room.roomId, roomPayload);
                } else {
                    await createRoomApi(roomPayload);
                }
            }

            refreshData();
            onClose();
        } catch (err) {
            setError('Giao dịch thất bại. Hãy kiểm tra lại kết nối mạng hoặc API.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={theatre ? "Cập nhật Rạp & Phòng chiếu" : "Tạo Rạp & Phòng chiếu"}>
            {error && <div className="p-3 mb-4 text-white bg-red-500 rounded">{error}</div>}
            <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[80vh] px-2">
                <h3 className="pb-2 mb-4 text-lg font-bold border-b text-slate-800">1. Thông tin Rạp</h3>
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="col-span-2">
                        <label className="block mb-1 font-bold text-gray-700">Tên Rạp</label>
                        <input type="text" name="theatreName" value={theatreData.theatreName} onChange={handleTheatreChange} className="w-full px-3 py-2 border rounded" required />
                    </div>
                    <div>
                        <label className="block mb-1 font-bold text-gray-700">Thành phố</label>
                        <input type="text" name="city" value={theatreData.city} onChange={handleTheatreChange} className="w-full px-3 py-2 border rounded" required />
                    </div>
                    <div>
                        <label className="block mb-1 font-bold text-gray-700">Trạng thái Rạp</label>
                        <select name="theatreStatus" value={theatreData.theatreStatus} onChange={handleTheatreChange} className="w-full px-3 py-2 border rounded">
                            <option value="Active">Hoạt động</option>
                            <option value="Maintenance">Bảo trì</option>
                            <option value="Closed">Đóng cửa</option>
                        </select>
                    </div>
                    <div className="col-span-2">
                        <label className="block mb-1 font-bold text-gray-700">Địa chỉ cụ thể</label>
                        <input type="text" name="location" value={theatreData.location} onChange={handleTheatreChange} className="w-full px-3 py-2 border rounded" required />
                    </div>
                    <div className="col-span-2">
                        <label className="block mb-1 font-bold text-gray-700">Link ảnh đại diện (Preview URL)</label>
                        <input type="text" name="previewUrl" value={theatreData.previewUrl} onChange={handleTheatreChange} className="w-full px-3 py-2 border rounded" placeholder="https://..." />
                    </div>
                    <div>
                        <label className="block mb-1 font-bold text-gray-700">Tọa độ (Lat, Lng)</label>
                        <input type="text" name="coordinates" value={theatreData.coordinates} onChange={handleTheatreChange} className="w-full px-3 py-2 border rounded" placeholder="10.123, 106.456" />
                    </div>
                    <div className="col-span-2">
                        <label className="block mb-1 font-bold text-gray-700">Thông tin thêm (Info)</label>
                        <textarea name="info" value={theatreData.info} onChange={handleTheatreChange} className="w-full px-3 py-2 border rounded" rows="2" placeholder="Mô tả rạp..."></textarea>
                    </div>
                </div>

                <h3 className="pb-2 mb-4 text-lg font-bold border-b text-slate-800">2. Quản lý Phòng chiếu</h3>
                <div className="p-4 mb-4 bg-gray-50 rounded-xl">
                    <div className="grid grid-cols-5 gap-2 mb-2 text-xs font-bold text-gray-600">
                        <div className="col-span-2">Tên Phòng</div>
                        <div>Loại</div>
                        <div>Sức chứa</div>
                        <div>Thao tác</div>
                    </div>
                    <div className="grid grid-cols-5 gap-2 mb-4">
                        <div className="col-span-2">
                            <input type="text" name="roomName" value={newRoom.roomName} onChange={handleNewRoomChange} placeholder="Tên..." className="w-full px-2 py-1 border rounded" />
                        </div>
                        <div>
                            <select name="roomType" value={newRoom.roomType} onChange={handleNewRoomChange} className="w-full px-2 py-1 border rounded">
                                <option value="2D">2D</option><option value="3D">3D</option><option value="IMAX">IMAX</option>
                            </select>
                        </div>
                        <div>
                            <input type="number" name="capacity" value={newRoom.capacity} onChange={handleNewRoomChange} placeholder="Ghế" className="w-full px-2 py-1 border rounded" />
                        </div>
                        <div>
                            <button type="button" onClick={handleAddRoomLocal} className="w-full px-2 py-1 font-bold text-white bg-green-500 rounded hover:bg-green-600">+</button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        {rooms.map((room, index) => (
                            <div key={room.roomId || room.tempId} className="grid items-center grid-cols-5 gap-2 px-2 py-2 bg-white border rounded text-sm">
                                <div className="col-span-2 font-semibold text-gray-800 truncate">{room.roomName}</div>
                                <div className="text-gray-600">{room.roomType}</div>
                                <div className="text-gray-600">{room.capacity}</div>
                                <div>
                                    <button type="button" onClick={() => handleRemoveRoomLocal(index, room)} className="px-2 py-1 text-[10px] text-white bg-red-500 rounded hover:bg-red-600">Xóa</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="pt-4 border-t">
                    <button type="submit" disabled={isProcessing} className="w-full px-4 py-2 font-bold text-white bg-blue-600 rounded disabled:bg-gray-400">
                        {isProcessing ? 'Đang xử lý Transaction...' : 'Lưu Toàn Bộ Hệ Thống'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default TheatreForm;