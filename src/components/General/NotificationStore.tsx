import { create } from 'zustand';

type Notification = {
    message: string;
    severity?: 'success' | 'error' | 'warning' | 'info';
}

interface NotificationStore {
    notification: Notification | null;
    showNotification: (notification: Notification) => void;
    clearNotification: () => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
    notification: null,
    showNotification: (notification) => set({ notification }),
    clearNotification: () => set({ notification: null }),
}));