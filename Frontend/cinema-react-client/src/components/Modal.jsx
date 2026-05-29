export const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-white/20 animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                    <h3 className="text-xl font-black text-slate-800 tracking-tight">{title}</h3>
                    <button 
                        onClick={onClose} 
                        className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all"
                    >
                        &times;
                    </button>
                </div>
                <div className="p-6">{children}</div>
            </div>
        </div>
    );
};