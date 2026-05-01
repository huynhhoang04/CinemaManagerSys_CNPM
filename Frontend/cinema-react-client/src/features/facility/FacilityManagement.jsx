import { useState, useEffect } from 'react';
import { getAllTheatresApi, deleteTheatreApi } from './facilityApi';
import { Table } from '../../components/Table';
import TheatreForm from './TheatreForm';

const FacilityManagement = () => {
    const [theatres, setTheatres] = useState([]);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTheatre, setActiveTheatre] = useState(null);

    const fetchTheatres = async () => {
        try {
            const res = await getAllTheatresApi();
            setTheatres(res.data);
        } catch (err) {
            setError('Lỗi kết nối Server');
        }
    };

    useEffect(() => {
        fetchTheatres();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Cảnh báo: Xóa Rạp sẽ xóa toàn bộ Phòng chiếu bên trong. Xác nhận?")) return;
        try {
            await deleteTheatreApi(id);
            fetchTheatres();
        } catch (err) {
            setError('Không thể xóa rạp đang có lịch chiếu.');
        }
    };

    return (
        <div className="p-6">
            <h2 className="mb-6 text-2xl font-bold text-gray-800">Quản lý Cơ sở vật chất (Rạp & Phòng)</h2>
            {error && <div className="p-3 mb-4 text-white bg-red-500 rounded">{error}</div>}

            <div className="mb-4">
                <button onClick={() => { setActiveTheatre(null); setIsModalOpen(true); }} className="px-4 py-2 font-bold text-white bg-green-500 rounded hover:bg-green-600">Thêm Rạp Mới</button>
            </div>

            <Table 
                headers={['ID Rạp', 'Tên Rạp', 'Thành phố', 'Địa chỉ', 'Trạng thái', 'Thao tác']}
                data={theatres}
                renderRow={(t) => (
                    <>
                        <td className="px-4 py-3">{t.theatreId}</td>
                        <td className="px-4 py-3 font-semibold">{t.theatreName}</td>
                        <td className="px-4 py-3">{t.city}</td>
                        <td className="px-4 py-3">{t.location}</td>
                        <td className="px-4 py-3">
                            <span className={`px-2 py-1 text-xs font-semibold rounded ${t.theatreStatus === 'Active' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                                {t.theatreStatus}
                            </span>
                        </td>
                        <td className="px-4 py-3 space-x-2">
                            <button onClick={() => { setActiveTheatre(t); setIsModalOpen(true); }} className="px-3 py-1 text-white bg-blue-500 rounded hover:bg-blue-600">Sửa / Xem Phòng</button>
                            <button onClick={() => handleDelete(t.theatreId)} className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600">Xóa</button>
                        </td>
                    </>
                )}
            />

            <TheatreForm isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} theatre={activeTheatre} refreshData={fetchTheatres} />
        </div>
    );
};

export default FacilityManagement;