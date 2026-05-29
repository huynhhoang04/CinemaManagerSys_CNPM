import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../config/axios';
import useTheatreStore from '../../store/theatreStore';

const TheatreSelection = () => {
    const [theatres, setTheatres] = useState([]);
    const [cities, setCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState('');
    const [loading, setLoading] = useState(true);
    const { setTheatre } = useTheatreStore();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Lấy tất cả rạp để trích xuất danh sách thành phố
                const res = await axiosInstance.get('/facility/theatres');
                const allTheatres = res.data;
                setTheatres(allTheatres);
                
                const uniqueCities = [...new Set(allTheatres.map(t => t.city).filter(c => c))];
                setCities(uniqueCities);
            } catch (err) {
                console.error("Lỗi tải danh sách rạp:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleCityChange = async (city) => {
        setSelectedCity(city);
        setLoading(true);
        try {
            if (city) {
                const res = await axiosInstance.get(`/facility/theatres/city/${city}`);
                setTheatres(res.data);
            } else {
                const res = await axiosInstance.get('/facility/theatres');
                setTheatres(res.data);
            }
        } catch (err) {
            console.error("Lỗi lọc rạp theo thành phố:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectTheatre = (theatre) => {
        setTheatre(theatre);
        navigate('/staff/booking');
    };

    if (loading && theatres.length === 0) {
        return <div className="flex items-center justify-center min-h-screen">Đang tải danh sách rạp...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">CHỌN RẠP LÀM VIỆC</h1>
                
                <div className="mb-8 flex justify-center">
                    <div className="w-full max-w-xs">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Lọc theo thành phố</label>
                        <select 
                            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            value={selectedCity}
                            onChange={(e) => handleCityChange(e.target.value)}
                        >
                            <option value="">Tất cả thành phố</option>
                            {cities.map(city => (
                                <option key={city} value={city}>{city}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {theatres.map(theatre => (
                        <div 
                            key={theatre.theatreId}
                            className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => handleSelectTheatre(theatre)}
                        >
                            <div className="h-40 bg-gray-200 relative">
                                {theatre.previewUrl ? (
                                    <img src={theatre.previewUrl} alt={theatre.theatreName} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">Không có ảnh</div>
                                )}
                                <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                                    {theatre.city}
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="text-xl font-bold text-gray-800 mb-2">{theatre.theatreName}</h3>
                                <p className="text-sm text-gray-600 mb-4 flex items-start">
                                    <span className="mr-2">📍</span> {theatre.location}
                                </p>
                                <button className="w-full py-2 bg-blue-50 text-blue-600 font-bold rounded-lg border border-blue-200 hover:bg-blue-600 hover:text-white transition-colors">
                                    Vào làm việc
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {theatres.length === 0 && !loading && (
                    <div className="text-center py-20 text-gray-500">
                        Không tìm thấy rạp nào tại khu vực này.
                    </div>
                )}
            </div>
        </div>
    );
};

export default TheatreSelection;