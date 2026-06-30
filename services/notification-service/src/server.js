require("dotenv").config();

const app = require("./app");
const cron = require("node-cron");
const { runAllReminders } = require("./jobs/reminder.job");

const PORT = process.env.PORT || 5004;

app.listen(PORT, () => {
  console.log("Notification Service running on port " + PORT);

  // Schedule reminders to run every day at 8:00 AM
  cron.schedule("0 8 * * *", () => {
    runAllReminders();
  });

  console.log("Reminder scheduler started — runs daily at 08:00");
});
