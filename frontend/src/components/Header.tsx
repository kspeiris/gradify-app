import React from 'react';
import { 
  Bell, 
  Search, 
  Calendar, 
  Sparkles,
  ChevronDown,
  BookOpen,
  Filter
} from 'lucide-react';
import { Semester, UserProfile } from '../types';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  currentSemesterId: string;
  setCurrentSemesterId: (id: string) => void;
  semesters: Semester[];
  unreadCount: number;
  activeTab: string;
  profile: UserProfile;
  setNotificationOpen: (open: boolean) => void;
  setActiveTab?: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentSemesterId,
  setCurrentSemesterId,
  semesters,
  unreadCount,
  activeTab,
  profile,
  setNotificationOpen,
  setActiveTab
}) => {
  // Format Title depending on Active Tab
  const getTabDetails = () => {
    switch (activeTab) {
      case 'dashboard':
        return {
          title: "Academic Dashboard",
          subtitle: "Real-time key statistics, academic progress, and study hours metrics."
        };
      case 'semesters':
        return {
          title: "Semesters Feed",
          subtitle: "Explore academic history across semesters, calculate SGPA contributions, and verify credit milestones."
        };
      case 'subjects':
        return {
          title: "Subjects & Live Grades",
          subtitle: "Simulate grades, check class progress indicators, and connect with faculty members."
        };
      case 'assignments':
        return {
          title: "Assignments Hub",
          subtitle: "Track pending tasks, update completion states, and visualize homework loads."
        };
      case 'exams':
        return {
          title: "Exam Scheduler",
          subtitle: "View test countdowns, complete assignments weights, study slots, and test venue routes."
        };
      case 'analytics':
        return {
          title: "GPA Analyzer & Goals",
          subtitle: "Track historic trajectory, evaluate semester targets, and configure custom GPA goals."
        };
      case 'notifications':
        return {
          title: "Notification Center",
          subtitle: "Stay informed about assignments, exams, GPA updates, academic goals, and important university activities."
        };
      case 'profile':
        return {
          title: "Student Profile",
          subtitle: "Review system account metadata, scholarship limits, advisor notes, and contact criteria."
        };
      default:
        return {
          title: "Success Narrative Portal",
          subtitle: "Academic performance tracker."
        };
    }
  };

  const { title, subtitle } = getTabDetails();
  const currentSemester = semesters.find(s => s.id === currentSemesterId) || semesters[4];

  return (
    <header id="app-header" className="bg-white border-b border-slate-200/80 px-8 py-4 flex items-center justify-between sticky top-0 z-20 shrink-0 shadow-sm shadow-slate-100/30">
      
      {/* Title & Search bar */}
      <div className="flex items-center gap-6 flex-1 min-w-0 mr-4">
        <img src="/logo.png" alt="Gradify Logo" className="h-8 w-8 object-contain" />
        <div className="min-w-0 hidden md:block">
          <h2 id="header-active-title" className="text-lg font-bold tracking-tight text-slate-900 flex items-center gap-2">
            {title}
            {activeTab === 'dashboard' && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/20">
                <Sparkles className="w-2.5 h-2.5" /> Auto-Synced
              </span>
            )}
          </h2>
        </div>

        {/* Global Search form */}
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input 
            type="text"
            placeholder="Search courses, tasks, grades..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-1.5 text-xs outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all font-sans text-slate-700"
          />
        </div>
      </div>

      {/* Control Actions */}
      <div className="flex items-center gap-3 shrink-0">
        
        {/* Academic Year Selector */}
        <div id="semester-selector-wrapper" className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 hover:bg-slate-100 transition-colors">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider hidden lg:inline">Academic Year:</span>
          <div className="relative">
            <select
              id="semester-selector"
              value={currentSemesterId}
              onChange={(e) => setCurrentSemesterId(e.target.value)}
              className="appearance-none bg-transparent pr-7 text-xs font-bold text-slate-700 outline-none cursor-pointer font-sans"
            >
              {semesters.map((sem) => (
                <option key={sem.id} value={sem.id}>
                  {sem.name.replace("Semester ", "Sem ")} {sem.status === 'active' ? '●' : ''}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3 h-3 text-slate-500 pointer-events-none absolute right-1 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        <ThemeToggle />

        {/* Notification Bell */}
        <button
          id="notification-bell-btn"
          onClick={() => setNotificationOpen(true)}
          className="relative h-9 w-9 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-600 transition-all cursor-pointer"
        >
          <Bell className="h-4.5 w-4.5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 animate-bounce -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold font-mono text-white ring-2 ring-white">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Mini Student Card Shortcut */}
        <div 
          id="header-student-avatar-badge"
          onClick={() => {
            if (setActiveTab) setActiveTab('profile');
          }}
          className="flex items-center gap-2.5 pl-3 border-l border-slate-200 cursor-pointer hover:bg-slate-50 hover:opacity-90 rounded-xl transition-all p-1.5"
          title="View profile settings"
        >
          <img
            src={profile.avatar}
            alt={profile.name}
            className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/20"
            referrerPolicy="no-referrer"
          />
          <div className="text-left hidden sm:block">
            <div className="text-xs font-bold text-slate-800 leading-none">{profile.name}</div>
            <div className="text-[9px] font-mono text-slate-400 mt-1 font-semibold uppercase tracking-wider block">Active Term</div>
          </div>
        </div>

      </div>
    </header>
  );
};
