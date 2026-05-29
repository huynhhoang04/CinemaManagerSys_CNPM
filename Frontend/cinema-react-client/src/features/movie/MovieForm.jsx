import { useState, useEffect } from 'react';
import { createMovieApi, updateMovieApi, getAllGenresApi } from './movieApi';
import { 
    getAllActorsApi, 
    getAllDirectorsApi, 
    getActorsByMovieApi, 
    getDirectorsByMovieApi, 
    assignActorsToMovieApi, 
    assignDirectorsToMovieApi 
} from '../cast/castApi';
import { Modal } from '../../components/Modal';

const MovieForm = ({ isOpen, onClose, movie, refreshData }) => {
    // --- BASIC MOVIE STATE ---
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        posterUrl: '',
        trailerUrl: '',
        duration: 0,
        releaseDate: '',
        movieStatus: 'Active',
        genreIds: []
    });

    // --- CATALOGS ---
    const [genres, setGenres] = useState([]);
    const [allActors, setAllActors] = useState([]);
    const [allDirectors, setAllDirectors] = useState([]);

    // --- SELECTIONS ---
    const [selectedDirectors, setSelectedDirectors] = useState([]); // [id1, id2]
    const [selectedActors, setSelectedActors] = useState([]); // [{ actorId, characterName }]

    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // 1. FETCH CATALOGS ON OPEN
    useEffect(() => {
        const fetchCatalogs = async () => {
            try {
                const [genresRes, actorsRes, directorsRes] = await Promise.all([
                    getAllGenresApi(),
                    getAllActorsApi(),
                    getAllDirectorsApi()
                ]);
                setGenres(genresRes.data);
                setAllActors(actorsRes.data);
                setAllDirectors(directorsRes.data);
            } catch (err) {
                setError('Không thể tải danh sách danh mục (Thể loại, Diễn viên, Đạo diễn).');
            }
        };
        if (isOpen) fetchCatalogs();
    }, [isOpen]);

    // 2. SET INITIAL FORM DATA & MOVIE CAST
    useEffect(() => {
        const fetchMovieCast = async (movieId) => {
            try {
                const [actorsRes, directorsRes] = await Promise.all([
                    getActorsByMovieApi(movieId),
                    getDirectorsByMovieApi(movieId)
                ]);
                setSelectedActors(actorsRes.data.map(a => ({ actorId: a.id, characterName: a.characterName })));
                setSelectedDirectors(directorsRes.data.map(d => d.id));
            } catch (err) {
                console.error("Error fetching cast:", err);
            }
        };

        if (movie && isOpen) {
            setFormData({
                title: movie.title || '',
                description: movie.description || '',
                posterUrl: movie.posterUrl || '',
                trailerUrl: movie.trailerUrl || '',
                duration: movie.duration || 0,
                releaseDate: movie.releaseDate ? movie.releaseDate.split('T')[0] : '',
                movieStatus: movie.movieStatus || 'Active',
                genreIds: movie.genres?.map(g => g.genreId) || []
            });
            fetchMovieCast(movie.movieId);
        } else {
            setFormData({ 
                title: '', description: '', posterUrl: '', trailerUrl: '',
                duration: 0, releaseDate: '', movieStatus: 'Active', genreIds: [] 
            });
            setSelectedActors([]);
            setSelectedDirectors([]);
        }
        setError(null);
    }, [movie, isOpen]);

    // --- HANDLERS ---
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'duration' ? parseInt(value) || 0 : value }));
    };

    const toggleGenre = (genreId) => {
        setFormData(prev => ({
            ...prev,
            genreIds: prev.genreIds.includes(genreId)
                ? prev.genreIds.filter(id => id !== genreId)
                : [...prev.genreIds, genreId]
        }));
    };

    const toggleDirector = (directorId) => {
        setSelectedDirectors(prev => 
            prev.includes(directorId) 
                ? prev.filter(id => id !== directorId) 
                : [...prev, directorId]
        );
    };

    const addActorRow = () => {
        setSelectedActors([...selectedActors, { actorId: '', characterName: '' }]);
    };

    const removeActorRow = (index) => {
        setSelectedActors(selectedActors.filter((_, i) => i !== index));
    };

    const handleActorRowChange = (index, field, value) => {
        const updated = [...selectedActors];
        updated[index][field] = field === 'actorId' ? parseInt(value) : value;
        setSelectedActors(updated);
    };

    // --- SUBMIT LOGIC (TRANSACTIONAL) ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            // STEP 1: Create/Update Movie
            let movieId = movie?.movieId;
            if (movie) {
                await updateMovieApi(movie.movieId, formData);
            } else {
                const res = await createMovieApi(formData);
                movieId = res.data.movieId;
            }

            // STEP 2: Assign Cast
            try {
                // Filter out empty actor selections
                const validActors = selectedActors.filter(a => a.actorId !== '');
                
                await Promise.all([
                    assignDirectorsToMovieApi(movieId, selectedDirectors),
                    assignActorsToMovieApi(movieId, validActors)
                ]);
            } catch (castErr) {
                throw new Error("Lưu phim thành công nhưng lỗi gán Diễn viên/Đạo diễn.");
            }

            refreshData();
            onClose();
        } catch (err) {
            setError(err.message || err.response?.data?.message || 'Thao tác thất bại. Vui lòng thử lại.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={movie ? "Cập nhật thông tin phim" : "Thêm phim mới"}>
            {error && (
                <div className="p-3 mb-6 text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-lg font-bold">
                    ⚠️ {error}
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6 max-h-[75vh] overflow-y-auto px-2 custom-scrollbar">
                {/* 1. THÔNG TIN CƠ BẢN */}
                <section>
                    <h3 className="text-sm font-black text-indigo-600 uppercase tracking-widest mb-4 border-b pb-2">1. Thông tin cơ bản</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block mb-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tiêu đề phim</label>
                            <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-semibold" required />
                        </div>
                        <div>
                            <label className="block mb-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Thời lượng (phút)</label>
                            <input type="number" name="duration" value={formData.duration} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all" required />
                        </div>
                        <div>
                            <label className="block mb-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ngày phát hành</label>
                            <input type="date" name="releaseDate" value={formData.releaseDate} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all" required />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block mb-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mô tả phim</label>
                            <textarea name="description" value={formData.description} onChange={handleChange} rows="2" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"></textarea>
                        </div>
                    </div>
                </section>

                {/* 2. MEDIA & TRẠNG THÁI */}
                <section>
                    <h3 className="text-sm font-black text-indigo-600 uppercase tracking-widest mb-4 border-b pb-2">2. Media & Trạng thái</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Poster URL</label>
                            <input type="text" name="posterUrl" value={formData.posterUrl} onChange={handleChange} placeholder="https://..." className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                        </div>
                        <div>
                            <label className="block mb-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Trailer URL</label>
                            <input type="text" name="trailerUrl" value={formData.trailerUrl} onChange={handleChange} placeholder="https://youtube.com/..." className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block mb-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Trạng thái</label>
                            <select name="movieStatus" value={formData.movieStatus} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg font-bold text-indigo-600">
                                <option value="Active">Đang chiếu (Active)</option>
                                <option value="Inactive">Ngưng chiếu (Inactive)</option>
                            </select>
                        </div>
                    </div>
                </section>

                {/* 3. THỂ LOẠI */}
                <section>
                    <h3 className="text-sm font-black text-indigo-600 uppercase tracking-widest mb-4 border-b pb-2">3. Thể loại</h3>
                    <div className="flex flex-wrap gap-2">
                        {genres.map(g => (
                            <button key={g.genreId} type="button" onClick={() => toggleGenre(g.genreId)}
                                className={`px-3 py-1 rounded-full text-[10px] font-black transition-all border ${
                                    formData.genreIds.includes(g.genreId)
                                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-md'
                                    : 'bg-white border-slate-200 text-slate-500 hover:border-indigo-300'
                                }`}
                            >
                                {g.genreName.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </section>

                {/* 4. ĐẠO DIỄN (MULTIPLE SELECT) */}
                <section>
                    <h3 className="text-sm font-black text-emerald-600 uppercase tracking-widest mb-4 border-b pb-2">4. Đạo diễn</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {allDirectors.map(d => (
                            <label key={d.id} className={`flex items-center p-2 border rounded-lg cursor-pointer transition-all ${selectedDirectors.includes(d.id) ? 'bg-emerald-50 border-emerald-500' : 'bg-white border-slate-100 hover:bg-slate-50'}`}>
                                <input type="checkbox" checked={selectedDirectors.includes(d.id)} onChange={() => toggleDirector(d.id)} className="hidden" />
                                <img src={d.avatar || 'https://via.placeholder.com/40'} className="w-6 h-6 rounded-full mr-2 object-cover" />
                                <span className={`text-xs font-bold ${selectedDirectors.includes(d.id) ? 'text-emerald-700' : 'text-slate-600'}`}>{d.name}</span>
                            </label>
                        ))}
                    </div>
                </section>

                {/* 5. DIỄN VIÊN (DYNAMIC ROWS) */}
                <section>
                    <div className="flex justify-between items-center mb-4 border-b pb-2">
                        <h3 className="text-sm font-black text-rose-600 uppercase tracking-widest">5. Diễn viên & Vai diễn</h3>
                        <button type="button" onClick={addActorRow} className="text-[10px] font-black bg-rose-500 text-white px-2 py-1 rounded-md hover:bg-rose-600 tracking-tighter uppercase">+ Thêm dòng</button>
                    </div>
                    <div className="space-y-3">
                        {selectedActors.map((row, index) => (
                            <div key={index} className="flex gap-2 items-end bg-slate-50 p-3 rounded-xl border border-slate-100 animate-in fade-in slide-in-from-top-1">
                                <div className="flex-1">
                                    <label className="block mb-1 text-[9px] font-black text-slate-400 uppercase">Diễn viên</label>
                                    <select 
                                        value={row.actorId} 
                                        onChange={(e) => handleActorRowChange(index, 'actorId', e.target.value)}
                                        className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-md text-xs font-bold outline-none focus:ring-1 focus:ring-rose-500"
                                    >
                                        <option value="">-- Chọn --</option>
                                        {allActors.map(a => (
                                            <option key={a.id} value={a.id}>{a.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex-1">
                                    <label className="block mb-1 text-[9px] font-black text-slate-400 uppercase">Tên vai diễn</label>
                                    <input 
                                        type="text" 
                                        value={row.characterName} 
                                        onChange={(e) => handleActorRowChange(index, 'characterName', e.target.value)}
                                        placeholder="VD: Iron Man"
                                        className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-md text-xs outline-none focus:ring-1 focus:ring-rose-500"
                                    />
                                </div>
                                <button type="button" onClick={() => removeActorRow(index)} className="bg-rose-100 text-rose-600 p-1.5 rounded-md hover:bg-rose-200 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                        {selectedActors.length === 0 && (
                            <p className="text-center py-4 text-xs text-slate-400 italic">Chưa có diễn viên nào được gán cho phim này.</p>
                        )}
                    </div>
                </section>

                {/* STICKY FOOTER */}
                <div className="pt-6 sticky bottom-0 bg-white border-t mt-4 pb-2">
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className={`w-full px-4 py-3 font-black text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all uppercase tracking-widest text-sm ${
                            isLoading ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                    >
                        {isLoading ? 'Đang xử lý Transaction...' : (movie ? 'Lưu thay đổi toàn hệ thống' : 'Thêm phim & Gán Cast')}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default MovieForm;