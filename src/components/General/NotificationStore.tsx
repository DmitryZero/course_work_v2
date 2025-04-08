import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

type Notification = {
    message: string;
    severity?: 'success' | 'error' | 'warning' | 'info';
}

interface NotificationStore {
    notifications: Notification[];
    showNotification: (notification: Notification) => void;
    removeNotification: () => void;
}

export const useNotificationStore = create<NotificationStore>()(devtools(immer((set) => ({
    notifications: [],
    showNotification: (notification) =>
        set((state) => ({ notifications: [...state.notifications, notification] })),
    removeNotification: () =>
        set((state) => ({ notifications: state.notifications.slice(1) })),
}))));
