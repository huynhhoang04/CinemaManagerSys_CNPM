import { useState, useEffect } from 'react';
import { getAllMoviesApi, deleteMovieApi } from './movieApi';
import { Table } from '../../components/Table';
import MovieForm from './MovieForm';

const MovieManagement = () => {
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState(null);

    const fetchMovies = async () => {
        try {
            const res = await getAllMoviesApi();
            setMovies(res.data);
        } catch (err) {
            setError('Fetch movies failed');
        }
    };

    useEffect(() => {
        fetchMovies();
    }, []);

    const handleDelete = async (id) => {
        try {
            await deleteMovieApi(id);
            fetchMovies();
        } catch (err) {
            setError('Delete movie failed');
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
            <h2 className="mb-6 text-2xl font-bold text-gray-800">Movie Management</h2>
            {error && <div className="p-3 mb-4 text-white bg-red-500 rounded">{error}</div>}
            
            <div className="mb-4">
                <button onClick={openAddModal} className="px-4 py-2 font-bold text-white bg-green-500 rounded hover:bg-green-600">
                    Add New Movie
                </button>
            </div>

            <Table 
                headers={['ID', 'Title', 'Duration', 'Release Date', 'Status', 'Actions']}
                data={movies}
                renderRow={(movie, index) => (
                    <>
                        <td className="px-6 py-4">{movie.movieId}</td>
                        <td className="px-6 py-4 font-semibold text-gray-900">{movie.title}</td>
                        <td className="px-6 py-4">{movie.duration} mins</td>
                        <td className="px-6 py-4">{new Date(movie.releaseDate).toLocaleDateString()}</td>
                        <td className="px-6 py-4">
                            <span className={`px-2 py-1 text-sm font-semibold rounded ${movie.movieStatus === 'Active' ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-800'}`}>
                                {movie.movieStatus}
                            </span>
                        </td>
                        <td className="px-6 py-4 space-x-2">
                            <button onClick={() => openEditModal(movie)} className="px-3 py-1 text-white bg-blue-500 rounded hover:bg-blue-600">Edit</button>
                            <button onClick={() => handleDelete(movie.movieId)} className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600">Delete</button>
                        </td>
                    </>
                )}
            />

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