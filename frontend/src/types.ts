export interface UserProfile {
  name: string;
  avatar: string;
  degree: string;
  faculty: string;
  advisor: string;
  enrollmentYear: string;
  scholarship: string;
  birthDate: string;
  phone: string;
  email: string;
  studentId: string;
  location: string;
  gpa: number;
  cgpa: number;
}

export interface Semester {
  id: string;
  name: string;
  duration: string;
  status: 'active' | 'completed' | 'upcoming';
  subjectsCount: number;
  creditsEarned: number;
  sgpa: number;
  totalCredits: number;
  completionRate: number;
  academicYear?: string;
  startDate?: string;
  endDate?: string;
  isArchived?: boolean;
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  credits: number;
  lecturer: string;
  grade: string;
  score: number; // e.g. 92
  progress: number; // progress percentage e.g. 85
  status: 'active' | 'completed' | 'upcoming';
  semesterId: string;
  assignmentsProgress: number;
  quizzesProgress: number;
  midExamProgress: number;
  description?: string;
}

export interface Assignment {
  id: string;
  title: string;
  subjectId: string;
  subjectName: string;
  dueDate: string;
  progress: number;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high' | 'critical';
  isGroup: boolean;
  score?: number;
  grade?: string;
  description?: string;
  submissionType?: string; // 'online_upload' | 'github' | 'paper' etc.
  marksAllocated?: number;
  feedback?: string;
  attachments?: string[];
  semesterId?: string;
}

export interface Exam {
  id: string;
  subjectId: string;
  subjectName: string;
  subjectCode: string;
  type: string; // 'Mid exam', 'Final Exam', 'Viva'
  date: string; // 'July 15, 2024' or ISO date
  timeRange: string; // '09:00 AM - 11:00 AM'
  venue: string; // 'Hall A-102'
  score?: number;
  maxScore?: number;
  grade?: string; // e.g. 'A'
  status: 'upcoming' | 'completed';
  daysRemaining?: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timeLabel: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: 'assignments' | 'exams' | 'gpa' | 'goals' | 'system';
  isRead: boolean;
  actionLabel?: string;
  actionTab?: string;
}

export interface AcademicGoal {
  id: string;
  title: string;
  targetPercent: number;
  currentPercent: number;
  subtitle: string;
  category: 'gpa' | 'general';
}

export interface WeeklyProductivityHour {
  day: string;
  hours: number;
  isSecondary?: boolean;
}

export interface ActivityLog {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'gpa' | 'submission' | 'preference' | 'exam';
}
