import axios from "axios";

const notificationAxios = axios.create({
    baseURL: import.meta.env.VITE_NOTIFICATION_API,
    headers: {
        "Content-Type": "application/json"
    }
});

notificationAxios.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export interface Notification {
    id: number;
    userId: number;
    title: string;
    message: string;
    type: "ASSIGNMENT" | "EXAM" | "GPA" | "GOAL" | "SYSTEM";
    priority: "LOW" | "MEDIUM" | "HIGH";
    isRead: boolean;
    createdAt: string;
    updatedAt: string;
}

export const getNotifications = () =>
    notificationAxios.get<Notification[]>("/");

export const getUnreadCount = () =>
    notificationAxios.get<{ count: number }>("/unread-count");

export const createNotification = (data: {
    title: string;
    message: string;
    type: string;
    priority: string;
}) => notificationAxios.post("/", data);

export const markNotificationRead = (id: number) =>
    notificationAxios.put(`/read/${id}`);

export const markAllNotificationsRead = () =>
    notificationAxios.put("/read-all");

export const deleteNotification = (id: number) =>
    notificationAxios.delete(`/${id}`);
