const service = require("../services/notification.service");
const { validationResult } = require("express-validator");

exports.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const notification = await service.createNotification(
      req.user.userId,
      req.body
    );
    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const notifications = await service.getNotifications(req.user.userId);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.read = async (req, res) => {
  try {
    await service.markAsRead(req.params.id, req.user.userId);
    res.json({ message: "Notification marked as read" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.readAll = async (req, res) => {
  try {
    await service.markAllAsRead(req.user.userId);
    res.json({ message: "All notifications marked as read" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    await service.deleteNotification(req.params.id, req.user.userId);
    res.json({ message: "Notification deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.unreadCount = async (req, res) => {
  try {
    const count = await service.getUnreadCount(req.user.userId);
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
