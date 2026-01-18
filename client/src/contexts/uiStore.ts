import { create } from 'zustand';

interface UIStore {
    isTaskModalOpen: boolean;
    openTaskModal: () => void;
    closeTaskModal: () => void;
    toggleTaskModal: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
    isTaskModalOpen: false,
    openTaskModal: () => set({ isTaskModalOpen: true }),
    closeTaskModal: () => set({ isTaskModalOpen: false }),
    toggleTaskModal: () => set((state) => ({ isTaskModalOpen: !state.isTaskModalOpen })),
}));
