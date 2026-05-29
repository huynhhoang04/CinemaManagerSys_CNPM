import { useState, useEffect } from 'react';
import { getAllActorsApi, getAllDirectorsApi, deleteActorApi, deleteDirectorApi } from './castApi';
import { Table } from '../../components/Table';
import ActorForm from './ActorForm';
import DirectorForm from './DirectorForm';

const CastManagement = () => {
    const [activeTab, setActiveTab] = useState('actors'); // 'actors' or 'directors'
    const [actors, setActors] = useState([]);
    const [directors, setDirectors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [isActorModalOpen, setIsActorModalOpen] = useState(false);
    const [activeActor, setActiveActor] = useState(null);

    const [isDirectorModalOpen, setIsDirectorModalOpen] = useState(false);
    const [activeDirector, setActiveDirector] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            if (activeTab === 'actors') {
                const res = await getAllActorsApi();
                setActors(res.data);
            } else {
                const res = await getAllDirectorsApi();
                setDirectors(res.data);
            }
        } catch (err) {
            setError('Lỗi tải dữ liệu từ server');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const openActorModal = (actor = null) => {
        setActiveActor(actor);
        setIsActorModalOpen(true);
    };

    const openDirectorModal = (director = null) => {
        setActiveDirector(director);
        setIsDirectorModalOpen(true);
    };

    const handleDeleteActor = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa diễn viên này?')) {
            try {
                await deleteActorApi(id);
                fetchData();
            } catch (err) {
                setError('Không thể xóa diễn viên này');
            }
        }
    };

    const handleDeleteDirector = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa đạo diễn này?')) {
            try {
                await deleteDirectorApi(id);
                fetchData();
            } catch (err) {
                setError('Không thể xóa đạo diễn này');
            }
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Quản lý Diễn viên & Đạo diễn</h2>
                <div className="flex space-x-2">
                    <button 
                        onClick={() => openActorModal()}
                        className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 shadow-sm"
                    >
                        + Thêm Diễn viên
                    </button>
                    <button 
                        onClick={() => openDirectorModal()}
                        className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 shadow-sm"
                    >
                        + Thêm Đạo diễn
                    </button>
                </div>
            </div>

            {error && <div className="p-3 mb-4 text-white bg-red-500 rounded-lg">{error}</div>}

            {/* TABS */}
            <div className="flex border-b mb-6 space-x-8">
                <button 
                    className={`pb-2 px-1 font-bold transition-all ${activeTab === 'actors' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
                    onClick={() => setActiveTab('actors')}
                >
                    Danh sách Diễn viên ({actors.length})
                </button>
                <button 
                    className={`pb-2 px-1 font-bold transition-all ${activeTab === 'directors' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-gray-400 hover:text-gray-600'}`}
                    onClick={() => setActiveTab('directors')}
                >
                    Danh sách Đạo diễn ({directors.length})
                </button>
            </div>

            {loading ? (
                <div className="text-center py-10 text-gray-500 italic">Đang tải dữ liệu...</div>
            ) : (
                <>
                    {activeTab === 'actors' ? (
                        <Table 
                            headers={['Avatar', 'Họ tên', 'Tiểu sử', 'Thao tác']}
                            data={actors}
                            renderRow={(a) => (
                                <>
                                    <td className="px-4 py-3">
                                        <img src={a.avatar || 'https://via.placeholder.com/150'} alt={a.name} className="w-12 h-12 rounded-full object-cover border" />
                                    </td>
                                    <td className="px-4 py-3 font-bold text-slate-700">{a.name}</td>
                                    <td className="px-4 py-3 text-sm text-gray-500 max-w-xs truncate">{a.bio || 'Chưa có tiểu sử'}</td>
                                    <td className="px-4 py-3 space-x-2">
                                        <button 
                                            onClick={() => openActorModal(a)}
                                            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 font-bold rounded-md hover:bg-blue-200"
                                        >
                                            Sửa
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteActor(a.id)}
                                            className="px-3 py-1 text-sm bg-red-100 text-red-700 font-bold rounded-md hover:bg-red-200"
                                        >
                                            Xóa
                                        </button>
                                    </td>
                                </>
                            )}
                        />
                    ) : (
                        <Table 
                            headers={['Avatar', 'Họ tên', 'Tiểu sử', 'Thao tác']}
                            data={directors}
                            renderRow={(d) => (
                                <>
                                    <td className="px-4 py-3">
                                        <img src={d.avatar || 'https://via.placeholder.com/150'} alt={d.name} className="w-12 h-12 rounded-full object-cover border" />
                                    </td>
                                    <td className="px-4 py-3 font-bold text-slate-700">{d.name}</td>
                                    <td className="px-4 py-3 text-sm text-gray-500 max-w-xs truncate">{d.bio || 'Chưa có tiểu sử'}</td>
                                    <td className="px-4 py-3 space-x-2">
                                        <button 
                                            onClick={() => openDirectorModal(d)}
                                            className="px-3 py-1 text-sm bg-emerald-100 text-emerald-700 font-bold rounded-md hover:bg-emerald-200"
                                        >
                                            Sửa
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteDirector(d.id)}
                                            className="px-3 py-1 text-sm bg-red-100 text-red-700 font-bold rounded-md hover:bg-red-200"
                                        >
                                            Xóa
                                        </button>
                                    </td>
                                </>
                            )}
                        />
                    )}
                </>
            )}

            <ActorForm 
                isOpen={isActorModalOpen} 
                onClose={() => setIsActorModalOpen(false)} 
                actor={activeActor} 
                refreshData={fetchData} 
            />

            <DirectorForm 
                isOpen={isDirectorModalOpen} 
                onClose={() => setIsDirectorModalOpen(false)} 
                director={activeDirector} 
                refreshData={fetchData} 
            />
        </div>
    );
};

export default CastManagement;