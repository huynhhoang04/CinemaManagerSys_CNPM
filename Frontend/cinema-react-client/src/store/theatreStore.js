import { create } from 'zustand';

const useTheatreStore = create((set) => {
    const getStoredTheatre = () => {
        try {
            const theatreJson = localStorage.getItem('selectedTheatre');
            if (theatreJson) {
                return JSON.parse(theatreJson);
            }
        } catch (err) {
            console.error("Lỗi khi đọc LocalStorage (theatre):", err);
        }
        return null;
    };

    return {
        selectedTheatre: getStoredTheatre(),
        
        setTheatre: (theatre) => {
            localStorage.setItem('selectedTheatre', JSON.stringify(theatre));
            set({ selectedTheatre: theatre });
        },
        
        clearTheatre: () => {
            localStorage.removeItem('selectedTheatre');
            set({ selectedTheatre: null });
        }
    };
});

export default useTheatreStore;