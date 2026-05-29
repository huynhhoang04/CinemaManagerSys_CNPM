import React, { useState, useEffect } from 'react';
import { getAllMoviesApi, deleteMovieApi } from './movieApi';
import MovieForm from './MovieForm';

const MovieManagement = () => {
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState(null);

    const fetchMovies = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await getAllMoviesApi();
            setMovies(res.data);
        } catch (err) {
            console.error("Fetch movies error:", err);
            setError('Không thể tải danh sách phim. Vui lòng kiểm tra kết nối.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMovies();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa phim này không?")) return;
        try {
            await deleteMovieApi(id);
            fetchMovies();
        } catch (err) {
            alert('Xóa phim thất bại. Phim có thể đang được sử dụng trong lịch chiếu.');
        }
    };

    const openAddModal = () => {
        setSelectedMovie(null);
        setIsModalOpen(true);
    };

    const openEditModal = (movie) => {
        setSelectedMovie(movie);
        setIsModalOpen(true);
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">Quản lý Phim</h2>
                    <p className="text-slate-500 text-sm">Danh sách phim đang chiếu và sắp chiếu tại hệ thống</p>
                </div>
                <button 
                    onClick={openAddModal}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl transition-all font-bold shadow-lg shadow-indigo-200 flex items-center"
                >
                    <span className="mr-2 text-xl">+</span> THÊM PHIM MỚI
                </button>
            </div>

            {error && (
                <div className="bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 rounded-xl mb-6 font-medium">
                    ⚠️ {error}
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">ID</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Thông tin phim</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Thời lượng</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Ngày phát hành</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Trạng thái</th>
                            <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-widest">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-100">
                        {isLoading ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-10 text-center text-slate-400 italic">Đang tải dữ liệu...</td>
                            </tr>
                        ) : movies.length > 0 ? (
                            movies.map((movie) => (
                                <tr key={movie.movieId} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400 font-mono">#{movie.movieId}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            {movie.posterUrl && (
                                                <img className="h-12 w-9 object-cover rounded shadow-sm mr-3" src={movie.posterUrl} alt="" />
                                            )}
                                            <div>
                                                <div className="text-sm font-black text-slate-800">{movie.title}</div>
                                                <div className="text-xs text-slate-400 truncate max-w-xs">{movie.genres?.map(g => g.genreName).join(', ')}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-medium">{movie.duration} phút</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                        {new Date(movie.releaseDate).toLocaleDateString('vi-VN')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-bold rounded-full uppercase tracking-tighter ${
                                            movie.movieStatus === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                                        }`}>
                                            {movie.movieStatus === 'Active' ? 'Đang chiếu' : 'Ngưng chiếu'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                        <div className="flex justify-center space-x-2">
                                            <button 
                                                onClick={() => openEditModal(movie)}
                                                className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                title="Chỉnh sửa"
                                            >
                                                ✏️
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(movie.movieId)}
                                                className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                                title="Xóa"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="px-6 py-10 text-center text-slate-400 italic">
                                    Không tìm thấy phim nào trong hệ thống.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <MovieForm 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                movie={selectedMovie} 
                refreshData={fetchMovies} 
            />
        </div>
    );
};

export default MovieManagement;