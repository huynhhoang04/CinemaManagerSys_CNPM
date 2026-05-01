import { useState, useEffect } from 'react';
import { createMovieApi, updateMovieApi, getAllGenresApi } from './movieApi';
import { Modal } from '../../components/Modal';

const MovieForm = ({ isOpen, onClose, movie, refreshData }) => {
    const [formData, setFormData] = useState({
        title: '',
        duration: 0,
        releaseDate: '',
        movieStatus: 'Active',
        genreIds: []
    });
    const [genres, setGenres] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const res = await getAllGenresApi();
                setGenres(res.data);
            } catch (err) {
                setError('Fetch genres failed');
            }
        };
        if (isOpen) fetchGenres();
    }, [isOpen]);

    useEffect(() => {
        if (movie) {
            setFormData({
                title: movie.title || '',
                duration: movie.duration || 0,
                releaseDate: movie.releaseDate ? movie.releaseDate.split('T')[0] : '',
                movieStatus: movie.movieStatus || 'Active',
                genreIds: movie.genres?.map(g => g.genreId) || []
            });
        } else {
            setFormData({ title: '', duration: 0, releaseDate: '', movieStatus: 'Active', genreIds: [] });
        }
        setError(null);
    }, [movie, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleGenreChange = (e) => {
        const value = Array.from(e.target.selectedOptions, option => parseInt(option.value));
        setFormData(prev => ({ ...prev, genreIds: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            if (movie) {
                await updateMovieApi(movie.movieId, formData);
            } else {
                await createMovieApi(formData);
            }
            refreshData();
            onClose();
        } catch (err) {
            setError('Operation failed');
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={movie ? "Edit Movie" : "Add Movie"}>
            {error && <div className="p-3 mb-4 text-white bg-red-500 rounded">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block mb-2 font-bold text-gray-700">Title</label>
                    <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full px-3 py-2 border rounded" required />
                </div>
                <div className="mb-4">
                    <label className="block mb-2 font-bold text-gray-700">Duration (mins)</label>
                    <input type="number" name="duration" value={formData.duration} onChange={handleChange} className="w-full px-3 py-2 border rounded" required />
                </div>
                <div className="mb-4">
                    <label className="block mb-2 font-bold text-gray-700">Release Date</label>
                    <input type="date" name="releaseDate" value={formData.releaseDate} onChange={handleChange} className="w-full px-3 py-2 border rounded" required />
                </div>
                <div className="mb-4">
                    <label className="block mb-2 font-bold text-gray-700">Status</label>
                    <select name="movieStatus" value={formData.movieStatus} onChange={handleChange} className="w-full px-3 py-2 border rounded">
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block mb-2 font-bold text-gray-700">Genres</label>
                    <select multiple name="genreIds" value={formData.genreIds} onChange={handleGenreChange} className="w-full px-3 py-2 border rounded" required>
                        {genres.map(g => (
                            <option key={g.genreId} value={g.genreId}>{g.genreName}</option>
                        ))}
                    </select>
                </div>
                <button type="submit" className="w-full px-4 py-2 font-bold text-white bg-blue-600 rounded">Save</button>
            </form>
        </Modal>
    );
};

export default MovieForm;