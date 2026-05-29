import { useState, useEffect } from 'react';
import { createDirectorApi, updateDirectorApi } from './castApi';
import { Modal } from '../../components/Modal';

const DirectorForm = ({ isOpen, onClose, director, refreshData }) => {
    const [formData, setFormData] = useState({
        name: '',
        avatar: '',
        bio: ''
    });
    const [error, setError] = useState(null);

    useEffect(() => {
        if (director) {
            setFormData({
                name: director.name || '',
                avatar: director.avatar || '',
                bio: director.bio || ''
            });
        } else {
            setFormData({ name: '', avatar: '', bio: '' });
        }
        setError(null);
    }, [director, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            if (director) {
                await updateDirectorApi(director.id, formData);
            } else {
                await createDirectorApi(formData);
            }
            refreshData();
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Thao tác thất bại');
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={director ? "Cập nhật Đạo diễn" : "Thêm Đạo diễn"}>
            {error && <div className="p-3 mb-4 text-white bg-red-500 rounded">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block mb-2 font-bold text-gray-700">Tên Đạo diễn</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 border rounded" required />
                </div>
                <div className="mb-4">
                    <label className="block mb-2 font-bold text-gray-700">URL Ảnh đại diện</label>
                    <input type="text" name="avatar" value={formData.avatar} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
                </div>
                <div className="mb-4">
                    <label className="block mb-2 font-bold text-gray-700">Tiểu sử (Bio)</label>
                    <textarea name="bio" value={formData.bio} onChange={handleChange} className="w-full px-3 py-2 border rounded" rows="4"></textarea>
                </div>
                <button type="submit" className="w-full px-4 py-2 font-bold text-white bg-blue-600 rounded">Lưu Dữ Liệu</button>
            </form>
        </Modal>
    );
};

export default DirectorForm;