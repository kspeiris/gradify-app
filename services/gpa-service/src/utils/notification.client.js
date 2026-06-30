const NOTIFICATION_SERVICE_URL = process.env.NOTIFICATION_SERVICE_URL || "http://localhost:5004";

exports.createNotification = async (userId, title, message, type, priority, token) => {
  try {
    const url = `${NOTIFICATION_SERVICE_URL}/api/notifications`;
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ title, message, type, priority })
    });
  } catch (error) {
    console.error("Failed to send notification:", error.message);
  }
};
