import { useState, useEffect } from 'react';
import { createActorApi, updateActorApi } from './castApi';
import { Modal } from '../../components/Modal';

const ActorForm = ({ isOpen, onClose, actor, refreshData }) => {
    const [formData, setFormData] = useState({
        actorName: '',
        avatarUrl: '',
        bio: ''
    });
    const [error, setError] = useState(null);

    useEffect(() => {
        if (actor) {
            setFormData({
                actorName: actor.actorName || '',
                avatarUrl: actor.avatarUrl || '',
                bio: actor.bio || ''
            });
        } else {
            setFormData({ actorName: '', avatarUrl: '', bio: '' });
        }
        setError(null);
    }, [actor, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            if (actor) {
                await updateActorApi(actor.actorId, formData);
            } else {
                await createActorApi(formData);
            }
            refreshData();
            onClose();
        } catch (err) {
            setError('Thao tác thất bại');
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={actor ? "Cập nhật Diễn viên" : "Thêm Diễn viên"}>
            {error && <div className="p-3 mb-4 text-white bg-red-500 rounded">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block mb-2 font-bold text-gray-700">Tên Diễn viên</label>
                    <input type="text" name="actorName" value={formData.actorName} onChange={handleChange} className="w-full px-3 py-2 border rounded" required />
                </div>
                <div className="mb-4">
                    <label className="block mb-2 font-bold text-gray-700">URL Ảnh đại diện</label>
                    <input type="text" name="avatarUrl" value={formData.avatarUrl} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
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

export default ActorForm;