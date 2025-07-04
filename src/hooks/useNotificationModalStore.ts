import { create } from "zustand";

interface NotificationModalStore {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

export const useNotificationModalStore = create<NotificationModalStore>((set) => ({
  isOpen: false,
  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false }),
}));