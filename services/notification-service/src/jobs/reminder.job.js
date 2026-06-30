/**
 * Reminder Engine
 * Queries the notification-service's own DB for a reminder token (system token),
 * then queries the Academic Service for upcoming assignments and exams,
 * and creates notifications for users who have items due soon.
 *
 * Runs daily at 08:00 via node-cron.
 */

const prisma = require("../config/prisma");
const notificationService = require("../services/notification.service");

const ACADEMIC_SERVICE_URL = process.env.ACADEMIC_SERVICE_URL || "http://localhost:5002";
const SYSTEM_TOKEN = process.env.SYSTEM_TOKEN || null;

/**
 * Fetch all upcoming assignments from academic-service using a system token.
 * Returns an empty array if SYSTEM_TOKEN is not configured.
 */
const fetchUpcomingAssignments = async () => {
  if (!SYSTEM_TOKEN) return [];
  try {
    const res = await fetch(`${ACADEMIC_SERVICE_URL}/api/academic/assignments?status=PENDING`, {
      headers: { Authorization: `Bearer ${SYSTEM_TOKEN}` }
    });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
};

const fetchUpcomingExams = async () => {
  if (!SYSTEM_TOKEN) return [];
  try {
    const res = await fetch(`${ACADEMIC_SERVICE_URL}/api/academic/exams?status=UPCOMING`, {
      headers: { Authorization: `Bearer ${SYSTEM_TOKEN}` }
    });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
};

const getDaysRemaining = (dateStr) => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  return Math.round((target - now) / (1000 * 60 * 60 * 24));
};

const hasTodayNotification = async (userId, type, title) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const existing = await prisma.notification.findFirst({
    where: { userId, type, title, createdAt: { gte: today } }
  });
  return !!existing;
};

// Assignment due-tomorrow reminders
const runAssignmentReminders = async () => {
  const assignments = await fetchUpcomingAssignments();
  for (const assignment of assignments) {
    const days = getDaysRemaining(assignment.dueDate);
    if (days === 1) {
      const userId = assignment.userId;
      const title = "Assignment Due Tomorrow";
      const alreadySent = await hasTodayNotification(userId, "ASSIGNMENT", title);
      if (!alreadySent) {
        await notificationService.createNotification(userId, {
          title,
          message: `"${assignment.title}" is due tomorrow. Don't forget to submit!`,
          type: "ASSIGNMENT",
          priority: "HIGH"
        });
        console.log(`[Reminder] Assignment notification created for user ${userId}`);
      }
    }
  }
};

// Exam in 3-days reminders
const runExamReminders = async () => {
  const exams = await fetchUpcomingExams();
  for (const exam of exams) {
    const days = getDaysRemaining(exam.examDate);
    if (days === 3) {
      const userId = exam.userId;
      const title = "Upcoming Exam in 3 Days";
      const alreadySent = await hasTodayNotification(userId, "EXAM", title);
      if (!alreadySent) {
        await notificationService.createNotification(userId, {
          title,
          message: `"${exam.title}" is scheduled in 3 days. Start revising now!`,
          type: "EXAM",
          priority: "HIGH"
        });
        console.log(`[Reminder] Exam notification created for user ${userId}`);
      }
    }
  }
};

const runAllReminders = async () => {
  console.log("[Reminder] Running scheduled reminders...");
  await runAssignmentReminders().catch((e) =>
    console.error("[Reminder] Assignment error:", e.message)
  );
  await runExamReminders().catch((e) =>
    console.error("[Reminder] Exam error:", e.message)
  );
  console.log("[Reminder] Done.");
};

module.exports = { runAllReminders };
