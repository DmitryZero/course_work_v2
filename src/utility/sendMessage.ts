import { useNotificationStore } from "../components/General/NotificationStore";

export default function sendMessage(msg: string, severity: 'success' | 'error' | 'warning' | 'info' = "success") {
    const { showNotification } = useNotificationStore.getState();
    showNotification({ message: msg, severity: severity });
}