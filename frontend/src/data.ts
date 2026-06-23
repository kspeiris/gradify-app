import { 
  UserProfile, 
  Semester, 
  Subject, 
  Assignment, 
  Exam, 
  NotificationItem,
  AcademicGoal,
  WeeklyProductivityHour,
  ActivityLog
} from './types';

export const INITIAL_PROFILE: UserProfile = {
  name: "Kavindu",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256&h=256",
  degree: "B.Sc. in Computer Science & Engineering",
  faculty: "School of Engineering & Digital Sciences",
  advisor: "Dr. Evelyn Cartwright",
  enrollmentYear: "Fall 2021",
  scholarship: "President's Merit Scholarship (Full)",
  birthDate: "August 24, 2004",
  phone: "+1 (555) 832-7290",
  email: "kavindu@success-platform.edu",
  studentId: "STU-2021-98762",
  location: "San Francisco, CA",
  gpa: 3.72,
  cgpa: 3.72
};

export const INITIAL_SEMESTERS: Semester[] = [
  {
    id: "sem-1",
    name: "Semester 1",
    duration: "Sep 2021 - Jan 2022",
    status: "completed",
    subjectsCount: 5,
    creditsEarned: 15,
    sgpa: 3.65,
    totalCredits: 15,
    completionRate: 100,
    academicYear: "2021",
    startDate: "2021-09-01",
    endDate: "2022-01-15"
  },
  {
    id: "sem-2",
    name: "Semester 2",
    duration: "Feb 2022 - Jun 2022",
    status: "completed",
    subjectsCount: 5,
    creditsEarned: 15,
    sgpa: 3.88,
    totalCredits: 15,
    completionRate: 100,
    academicYear: "2022",
    startDate: "2022-02-01",
    endDate: "2022-06-30"
  },
  {
    id: "sem-3",
    name: "Semester 3",
    duration: "Sep 2022 - Jan 2023",
    status: "completed",
    subjectsCount: 5,
    creditsEarned: 16,
    sgpa: 3.75,
    totalCredits: 16,
    completionRate: 100,
    academicYear: "2022",
    startDate: "2022-09-01",
    endDate: "2023-01-15"
  },
  {
    id: "sem-4",
    name: "Semester 4",
    duration: "Feb 2023 - Jun 2023",
    status: "completed",
    subjectsCount: 4,
    creditsEarned: 14,
    sgpa: 3.90,
    totalCredits: 14,
    completionRate: 100,
    academicYear: "2023",
    startDate: "2023-02-01",
    endDate: "2023-06-30"
  },
  {
    id: "sem-5",
    name: "Semester 5",
    duration: "Sep 2023 - Jan 2024",
    status: "active",
    subjectsCount: 4,
    creditsEarned: 12,
    sgpa: 3.82,
    totalCredits: 15,
    completionRate: 80,
    academicYear: "2023",
    startDate: "2023-09-01",
    endDate: "2024-01-15"
  },
  {
    id: "sem-6",
    name: "Semester 6",
    duration: "Feb 2024 - Jun 2024",
    status: "upcoming",
    subjectsCount: 4,
    creditsEarned: 0,
    sgpa: 0.0,
    totalCredits: 14,
    completionRate: 0,
    academicYear: "2024",
    startDate: "2024-02-01",
    endDate: "2024-06-30"
  }
];

export const INITIAL_SUBJECTS: Subject[] = [
  // Semester 5 (Active Semester)
  {
    id: "sub-501",
    code: "CSE-305",
    name: "Database Systems",
    credits: 4,
    lecturer: "Prof. Arthur Pendelton",
    grade: "A",
    score: 93,
    progress: 91,
    status: "active",
    semesterId: "sem-5",
    assignmentsProgress: 95,
    quizzesProgress: 90,
    midExamProgress: 94
  },
  {
    id: "sub-502",
    code: "CSE-402",
    name: "Software Engineering",
    credits: 4,
    lecturer: "Dr. Evelyn Cartwright",
    grade: "B+",
    score: 88,
    progress: 85,
    status: "active",
    semesterId: "sem-5",
    assignmentsProgress: 80,
    quizzesProgress: 82,
    midExamProgress: 85
  },
  {
    id: "sub-503",
    code: "CSE-310",
    name: "Computer Networks",
    credits: 3,
    lecturer: "Dr. Marcus Vance",
    grade: "B",
    score: 84,
    progress: 82,
    status: "active",
    semesterId: "sem-5",
    assignmentsProgress: 78,
    quizzesProgress: 88,
    midExamProgress: 80
  },
  {
    id: "sub-504",
    code: "CSE-420",
    name: "Machine Learning",
    credits: 4,
    lecturer: "Dr. Evelyn Cartwright",
    grade: "A-",
    score: 91,
    progress: 89,
    status: "active",
    semesterId: "sem-5",
    assignmentsProgress: 90,
    quizzesProgress: 85,
    midExamProgress: 92
  },
  {
    id: "sub-505",
    code: "CSE-225",
    name: "Web Development",
    credits: 3,
    lecturer: "Prof. Louis Sterling",
    grade: "A",
    score: 95,
    progress: 94,
    status: "active",
    semesterId: "sem-5",
    assignmentsProgress: 98,
    quizzesProgress: 92,
    midExamProgress: 96
  },
  {
    id: "sub-506",
    code: "CSE-435",
    name: "Cloud Computing",
    credits: 3,
    lecturer: "Elena Rostova",
    grade: "A-",
    score: 90,
    progress: 88,
    status: "active",
    semesterId: "sem-5",
    assignmentsProgress: 86,
    quizzesProgress: 84,
    midExamProgress: 88
  },

  // Semester 4 Completed Studies
  {
    id: "sub-401",
    code: "CSE-202",
    name: "Computer Organization & Design",
    credits: 4,
    lecturer: "Dr. Evelyn Cartwright",
    grade: "A",
    score: 94,
    progress: 100,
    status: "completed",
    semesterId: "sem-4",
    assignmentsProgress: 100,
    quizzesProgress: 100,
    midExamProgress: 100
  },
  {
    id: "sub-402",
    code: "CSE-206",
    name: "Software Engineering Principles",
    credits: 4,
    lecturer: "Prof. Arthur Pendelton",
    grade: "A-",
    score: 92,
    progress: 100,
    status: "completed",
    semesterId: "sem-4",
    assignmentsProgress: 100,
    quizzesProgress: 100,
    midExamProgress: 100
  },
  {
    id: "sub-403",
    code: "MAT-220",
    name: "Discrete Mathematics II",
    credits: 3,
    lecturer: "Dr. Sandra Wu",
    grade: "A",
    score: 97,
    progress: 100,
    status: "completed",
    semesterId: "sem-4",
    assignmentsProgress: 100,
    quizzesProgress: 100,
    midExamProgress: 100
  },
  {
    id: "sub-404",
    code: "HUM-120",
    name: "Introduction to Sociology",
    credits: 3,
    lecturer: "Prof. Louis Sterling",
    grade: "A",
    score: 95,
    progress: 100,
    status: "completed",
    semesterId: "sem-4",
    assignmentsProgress: 100,
    quizzesProgress: 100,
    midExamProgress: 100
  }
];

export const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: "asm-1",
    title: "SQL Query Optimization and Indexing Lab",
    subjectId: "sub-501",
    subjectName: "Database Systems",
    dueDate: "2026-06-25",
    progress: 75,
    status: "in_progress",
    priority: "high",
    isGroup: false,
    score: undefined,
    grade: undefined
  },
  {
    id: "asm-2",
    title: "Refactoring & Architecture Patterns Assignment",
    subjectId: "sub-502",
    subjectName: "Software Engineering",
    dueDate: "2026-06-28",
    progress: 25,
    status: "in_progress",
    priority: "medium",
    isGroup: false,
    score: undefined,
    grade: undefined
  },
  {
    id: "asm-3",
    title: "Socket Programming and Packet Analyzer Project",
    subjectId: "sub-503",
    subjectName: "Computer Networks",
    dueDate: "2026-05-12",
    progress: 100,
    status: "completed",
    priority: "critical",
    isGroup: true,
    score: 94,
    grade: "A"
  },
  {
    id: "asm-4",
    title: "Neural Network Training & Model Analysis Draft",
    subjectId: "sub-504",
    subjectName: "Machine Learning",
    dueDate: "2026-06-21",
    progress: 100,
    status: "completed",
    priority: "medium",
    isGroup: false,
    score: 98,
    grade: "A+"
  },
  {
    id: "asm-5",
    title: "Interactive React Portal component",
    subjectId: "sub-505",
    subjectName: "Web Development",
    dueDate: "2026-07-02",
    progress: 0,
    status: "pending",
    priority: "high",
    isGroup: true,
    score: undefined,
    grade: undefined
  },
  {
    id: "asm-6",
    title: "Serverless Deployments & Edge Routing Lab",
    subjectId: "sub-506",
    subjectName: "Cloud Computing",
    dueDate: "2026-07-05",
    progress: 0,
    status: "pending",
    priority: "low",
    isGroup: false,
    score: undefined,
    grade: undefined
  },
  {
    id: "asm-7",
    title: "Database Normalization Exercises",
    subjectId: "sub-501",
    subjectName: "Database Systems",
    dueDate: "2026-05-01",
    progress: 100,
    status: "completed",
    priority: "high",
    isGroup: false,
    score: 87,
    grade: "B+"
  },
  {
    id: "asm-8",
    title: "Responsive CSS Framework integration",
    subjectId: "sub-505",
    subjectName: "Web Development",
    dueDate: "2026-06-10",
    progress: 30,
    status: "overdue",
    priority: "high",
    isGroup: false,
    score: undefined,
    grade: undefined
  }
];

export const INITIAL_EXAMS: Exam[] = [
  {
    id: "ex-1",
    subjectId: "sub-501",
    subjectName: "Database Systems",
    subjectCode: "CSE-305",
    type: "Final Exam",
    date: "2026-06-29",
    timeRange: "09:00 AM - 12:00 PM",
    venue: "Main Science Hall - Room 302",
    status: "upcoming"
  },
  {
    id: "ex-2",
    subjectId: "sub-502",
    subjectName: "Software Engineering",
    subjectCode: "CSE-402",
    type: "Final Portfolio Presentation",
    date: "2026-07-01",
    timeRange: "02:00 PM - 04:30 PM",
    venue: "Engineering lab 4",
    status: "upcoming"
  },
  {
    id: "ex-3",
    subjectId: "sub-503",
    subjectName: "Computer Networks",
    type: "Midterm Examination",
    subjectCode: "CSE-310",
    date: "2026-05-15",
    timeRange: "10:00 AM - 12:00 PM",
    venue: "Academic Block C - Auditorium B",
    score: 85,
    maxScore: 100,
    grade: "B+",
    status: "completed"
  },
  {
    id: "ex-4",
    subjectId: "sub-504",
    subjectName: "Machine Learning",
    type: "Midterm Research Presentation",
    subjectCode: "CSE-420",
    date: "2026-05-18",
    timeRange: "01:00 PM - 03:00 PM",
    venue: "Humanities Seminar Hall 04",
    score: 95,
    maxScore: 100,
    grade: "A",
    status: "completed"
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "not-1",
    title: "Exam Countdown Triggered",
    message: "Final exam for 'Database Systems' is slated in 7 days. Be sure to study index optimization and write-ahead logs.",
    timeLabel: "2 hours ago",
    priority: "high",
    category: "exams",
    isRead: false,
    actionLabel: "View Exam Schedule",
    actionTab: "exams"
  },
  {
    id: "not-2",
    title: "Assignment Due Sunday",
    message: "SQL Database Queries and Index Optimization is due June 28, 2026. Submit through the portal on time for zero penalty.",
    timeLabel: "6 hours ago",
    priority: "high",
    category: "assignments",
    isRead: false,
    actionLabel: "View Assignments",
    actionTab: "assignments"
  },
  {
    id: "not-3",
    title: "GPA Analysis Computed",
    message: "Great work! Your current SGPA is tracking at 3.82. This keeps your President's Merit scholarship secure.",
    timeLabel: "Yesterday at 05:30 PM",
    priority: "low",
    category: "gpa",
    isRead: true
  },
  {
    id: "not-4",
    title: "New AI Advisory Note",
    message: "Based on assignments and past performance, studying an extra 2.5 hours pool for 'Artificial Intelligence' could bump your sub-grade to an solid A.",
    timeLabel: "2 days ago",
    priority: "critical",
    category: "goals",
    isRead: false,
    actionLabel: "Review Goal Status",
    actionTab: "analytics"
  }
];

export const INITIAL_GOALS: AcademicGoal[] = [
  {
    id: "goal-1",
    title: "Earn 4.0 GPA this term",
    targetPercent: 100,
    currentPercent: 88,
    subtitle: "3 out of 4 courses tracking at A/A- level",
    category: "gpa"
  },
  {
    id: "goal-2",
    title: "Maintain 100% submission rate",
    targetPercent: 100,
    currentPercent: 89,
    subtitle: "7/8 assignments completed, 1 pending draft",
    category: "general"
  },
  {
    id: "goal-3",
    title: "Earn Magna Cum Laude graduation honor",
    targetPercent: 3.80,
    currentPercent: 3.78,
    subtitle: "Requires keeping CGPA above 3.8",
    category: "gpa"
  }
];

export const PRODUCTIVITY_HOURS: WeeklyProductivityHour[] = [
  { day: "Mon", hours: 4.5 },
  { day: "Tue", hours: 6.2 },
  { day: "Wed", hours: 3.8 },
  { day: "Thu", hours: 5.4 },
  { day: "Fri", hours: 7.0 },
  { day: "Sat", hours: 2.1 },
  { day: "Sun", hours: 4.8 }
];

export const INITIAL_LOGS: ActivityLog[] = [
  {
    id: "log-1",
    title: "Grade Simulator Updated",
    description: "Simulated grade of Dr. Cartwright's coding project to predict SGPA.",
    timestamp: "Just now",
    type: "gpa"
  },
  {
    id: "log-2",
    title: "Graph Algorithms Submission",
    description: "Successfully updated progress of Assignment 1 to 75%.",
    timestamp: "2 hours ago",
    type: "submission"
  },
  {
    id: "log-3",
    title: "Semester Status Refreshed",
    description: "Vibrated database system to align final exam locations.",
    timestamp: "12 hours ago",
    type: "exam"
  }
];
