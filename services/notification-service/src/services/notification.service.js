const prisma = require("../config/prisma");

exports.createNotification = async (userId, data) => {
    return await prisma.notification.create({
        data: {
            userId,
            title: data.title,
            message: data.message,
            type: data.type,
            priority: data.priority
        }
    });
};

exports.getNotifications = async (userId) => {
    return await prisma.notification.findMany({
        where: {
            userId
        },
        orderBy: {
            createdAt: "desc"
        }
    });
};

exports.markAsRead = async (id, userId) => {
    return await prisma.notification.updateMany({
        where: {
            id: Number(id),
            userId
        },
        data: {
            isRead: true
        }
    });
};

exports.markAllAsRead = async (userId) => {
    return await prisma.notification.updateMany({
        where: {
            userId,
            isRead: false
        },
        data: {
            isRead: true
        }
    });
};

exports.deleteNotification = async (id, userId) => {
    return await prisma.notification.deleteMany({
        where: {
            id: Number(id),
            userId
        }
    });
};

exports.getUnreadCount = async (userId) => {
    return await prisma.notification.count({
        where: {
            userId,
            isRead: false
        }
    });
};
