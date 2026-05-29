import { useState, useEffect, useRef } from 'react';
import axiosInstance from '../../config/axios';

const StaffSchedule = () => {
    const [movies, setMovies] = useState([]);
    const [activeMovies, setActiveMovies] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [cast, setCast] = useState({ actors: [], directors: [] });
    const [loading, setLoading] = useState(true);
    const playerRef = useRef(null);
    const scriptLoadedRef = useRef(false);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const res = await axiosInstance.get('/movie/movies');
                setMovies(res.data);
                const active = res.data.filter(m => m.movieStatus === 'Active');
                setActiveMovies(active);
                
                if (active.length > 0) {
                    handleSelectMovie(active[0]);
                } else if (res.data.length > 0) {
                    handleSelectMovie(res.data[0]);
                }
            } catch (err) {
                console.error("Lỗi tải danh sách phim:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchMovies();
    }, []);

    // Tự động load YouTube IFrame API
    useEffect(() => {
        if (!scriptLoadedRef.current) {
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
            scriptLoadedRef.current = true;
        }

        window.onYouTubeIframeAPIReady = () => {
            console.log("YouTube API Ready");
        };
    }, []);

    // Khởi tạo Player khi selectedMovie thay đổi
    useEffect(() => {
        if (selectedMovie && selectedMovie.trailerUrl) {
            const initPlayer = () => {
                if (playerRef.current) {
                    playerRef.current.destroy();
                }

                playerRef.current = new window.YT.Player('youtube-player', {
                    events: {
                        'onStateChange': (event) => {
                            if (event.data === window.YT.PlayerState.ENDED) {
                                handleNextMovie();
                            }
                        }
                    }
                });
            };

            if (window.YT && window.YT.Player) {
                initPlayer();
            } else {
                // Đợi API sẵn sàng nếu chưa có
                const checkInterval = setInterval(() => {
                    if (window.YT && window.YT.Player) {
                        initPlayer();
                        clearInterval(checkInterval);
                    }
                }, 500);
            }
        }

        return () => {
            if (playerRef.current) {
                playerRef.current.destroy();
                playerRef.current = null;
            }
        };
    }, [selectedMovie]);

    const handleNextMovie = () => {
        if (activeMovies.length <= 1) return;

        setActiveMovies(prevActive => {
            const currentIndex = prevActive.findIndex(m => m.movieId === selectedMovie?.movieId);
            const nextIndex = (currentIndex + 1) % prevActive.length;
            handleSelectMovie(prevActive[nextIndex]);
            return prevActive;
        });
    };

    const handleSelectMovie = async (movie) => {
        setSelectedMovie(movie);
        try {
            const [actorsRes, directorsRes] = await Promise.all([
                axiosInstance.get(`/cast/actors/movie/${movie.movieId}`),
                axiosInstance.get(`/cast/directors/movie/${movie.movieId}`)
            ]);
            setCast({
                actors: actorsRes.data,
                directors: directorsRes.data
            });
        } catch (err) {
            console.error("Lỗi tải thông tin diễn viên/đạo diễn:", err);
            setCast({ actors: [], directors: [] });
        }
    };

    const getEmbedUrl = (url) => {
        if (!url) return "";
        let embedUrl = url;
        if (url.includes("youtube.com/watch?v=")) {
            embedUrl = url.replace("watch?v=", "embed/");
        } else if (url.includes("youtu.be/")) {
            embedUrl = url.replace("youtu.be/", "youtube.com/embed/");
        }
        
        // Thêm các tham số để điều khiển bằng API và tự động phát
        const separator = embedUrl.includes("?") ? "&" : "?";
        return `${embedUrl}${separator}autoplay=1&mute=1&enablejsapi=1&origin=${window.location.origin}`;
    };

    if (loading) return <div className="p-10 text-center">Đang tải dữ liệu quảng cáo...</div>;

    return (
        <div className="flex flex-col gap-6 h-full">
            {/* Movie Selector Tabs */}
            <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-hide">
                {movies.map(m => (
                    <button 
                        key={m.movieId}
                        onClick={() => handleSelectMovie(m)}
                        className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${selectedMovie?.movieId === m.movieId ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
                    >
                        {m.title}
                    </button>
                ))}
            </div>

            {selectedMovie && (
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 flex flex-col">
                    {/* Top Section: Poster & Trailer */}
                    <div className="flex flex-col md:flex-row h-[500px]">
                        {/* Poster (30%) */}
                        <div className="w-full md:w-[30%] h-full bg-slate-900 relative">
                            <img 
                                src={selectedMovie.posterUrl} 
                                alt={selectedMovie.title} 
                                className="w-full h-full object-cover opacity-80"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                            <div className="absolute bottom-6 left-6 text-white">
                                <h1 className="text-3xl font-black mb-2 uppercase tracking-tight">{selectedMovie.title}</h1>
                                <div className="flex gap-2">
                                    <span className="px-2 py-1 bg-rose-600 rounded text-[10px] font-bold">{selectedMovie.movieStatus}</span>
                                    <span className="px-2 py-1 bg-white/20 backdrop-blur-md rounded text-[10px] font-bold">{selectedMovie.duration} PHÚT</span>
                                </div>
                            </div>
                        </div>

                        {/* Trailer (70%) */}
                        <div className="w-full md:w-[70%] h-full bg-black">
                            {selectedMovie.trailerUrl ? (
                                <iframe 
                                    id="youtube-player"
                                    className="w-full h-full"
                                    src={getEmbedUrl(selectedMovie.trailerUrl)} 
                                    title="YouTube video player" 
                                    frameBorder="0" 
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                    allowFullScreen
                                ></iframe>
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-slate-500">
                                    <div className="text-6xl mb-4">🎬</div>
                                    <p className="font-bold">Trailer hiện chưa có sẵn</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Bottom Section: Details & Cast */}
                    <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Movie Info */}
                        <div className="lg:col-span-1">
                            <h2 className="text-xl font-black text-slate-800 mb-4 border-b-4 border-indigo-600 inline-block pb-1">THÔNG TIN CHI TIẾT</h2>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Mô tả</p>
                                    <p className="text-slate-600 leading-relaxed text-sm mt-1">{selectedMovie.description || "Chưa có mô tả chi tiết cho phim này."}</p>
                                </div>
                                <div className="flex justify-between py-3 border-b border-slate-50">
                                    <span className="text-sm font-bold text-slate-500">Ngày phát hành</span>
                                    <span className="text-sm font-black text-slate-800">{new Date(selectedMovie.releaseDate).toLocaleDateString('vi-VN')}</span>
                                </div>
                                <div className="flex justify-between py-3 border-b border-slate-50">
                                    <span className="text-sm font-bold text-slate-500">Thể loại</span>
                                    <div className="flex gap-1">
                                        {selectedMovie.genres?.map(genre => (
                                            <span key={genre.genreId} className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                                                {genre.genreName}
                                            </span>
                                        ))}
                                        {(!selectedMovie.genres || selectedMovie.genres.length === 0) && <span className="text-xs text-slate-400 italic">Đang cập nhật...</span>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Cast & Crew */}
                        <div className="lg:col-span-2">
                            <h2 className="text-xl font-black text-slate-800 mb-6 border-b-4 border-emerald-500 inline-block pb-1 uppercase">Đạo diễn & Diễn viên</h2>
                            
                            <div className="space-y-8">
                                {/* Directors */}
                                <div>
                                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Đạo diễn</h3>
                                    <div className="flex flex-wrap gap-6">
                                        {cast.directors.map(d => (
                                            <div key={d.id} className="flex items-center gap-3">
                                                <img 
                                                    src={d.avatar || "https://ui-avatars.com/api/?name=" + d.name} 
                                                    className="w-14 h-14 rounded-full object-cover border-2 border-slate-100 shadow-sm"
                                                    alt={d.name}
                                                />
                                                <div>
                                                    <p className="font-black text-slate-800 text-sm leading-none">{d.name}</p>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Director</p>
                                                </div>
                                            </div>
                                        ))}
                                        {cast.directors.length === 0 && <p className="text-sm text-slate-400">Thông tin đang cập nhật...</p>}
                                    </div>
                                </div>

                                {/* Actors */}
                                <div>
                                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Diễn viên chính</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                        {cast.actors.map(a => (
                                            <div key={a.id} className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                                                <img 
                                                    src={a.avatar || "https://ui-avatars.com/api/?name=" + a.name} 
                                                    className="w-12 h-12 rounded-xl object-cover shadow-sm"
                                                    alt={a.name}
                                                />
                                                <div>
                                                    <p className="font-black text-slate-800 text-xs leading-none">{a.name}</p>
                                                    <p className="text-[9px] font-bold text-slate-400 uppercase mt-1 italic">{a.characterName || "Cast Member"}</p>
                                                </div>
                                            </div>
                                        ))}
                                        {cast.actors.length === 0 && <p className="text-sm text-slate-400">Thông tin đang cập nhật...</p>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StaffSchedule;