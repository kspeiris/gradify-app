const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const app = express();

const notificationRoutes = require("./routes/notification.routes");

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

app.use("/api/notifications", notificationRoutes);

app.get("/health", (req, res) => {
  res.json({
    service: "Notification Service",
    status: "Running"
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

module.exports = app;
