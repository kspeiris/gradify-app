import React from 'react';
import { 
  GraduationCap, 
  LayoutDashboard, 
  CalendarDays, 
  BookOpen, 
  FileText, 
  Award, 
  TrendingUp, 
  Bell, 
  User, 
  Settings,
  LogOut,
  Target
} from 'lucide-react';
import { UserProfile } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  profile: UserProfile;
  unreadCount: number;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  profile, 
  unreadCount,
  onLogout
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'semesters', label: 'Semesters', icon: CalendarDays },
    { id: 'subjects', label: 'Subjects', icon: BookOpen },
    { id: 'assignments', label: 'Assignments', icon: FileText },
    { id: 'exams', label: 'Exams', icon: Award },
    { id: 'analytics', label: 'GPA Analytics', icon: TrendingUp },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside id="sidebar-container" className="w-64 bg-slate-900 text-slate-100 flex flex-col border-r border-slate-800 shrink-0 h-screen sticky top-0 overflow-y-auto">
      {/* Brand Header */}
      <div id="sidebar-header" className="p-6 border-b border-slate-800 flex items-center gap-3">
        <div id="logo-icon" className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
          <GraduationCap className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 id="app-title" className="text-base font-extrabold tracking-tight text-white uppercase leading-none">Student Success</h1>
          <p id="app-subtitle" className="text-[10px] text-slate-400 font-mono font-medium mt-0.5">NARRATIVE PORTAL</p>
        </div>
      </div>

      {/* Mini Profile Summary */}
      <div id="sidebar-student-summary" className="p-5 border-b border-slate-800 bg-slate-900/50">
        <div className="flex items-center gap-3">
          <img 
            id="sidebar-avatar"
            src={profile.avatar} 
            alt={profile.name} 
            className="w-11 h-11 rounded-xl object-cover ring-2 ring-primary/30"
            referrerPolicy="no-referrer"
          />
          <div className="min-w-0">
            <h4 id="sidebar-student-name" className="text-sm font-semibold truncate text-slate-100">{profile.name}</h4>
            <p id="sidebar-student-id" className="text-xs font-mono text-slate-400 truncate">{profile.studentId}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-[10px] text-emerald-400 font-mono font-bold tracking-wider">ACTIVE TERM</span>
            </div>
          </div>
        </div>

        {/* Core Indicators */}
        <div className="grid grid-cols-2 gap-2 mt-4 bg-slate-950/40 p-2 rounded-lg border border-slate-800/60 text-center">
          <div>
            <div className="text-[10px] text-slate-400 font-semibold tracking-wider font-mono">TERM SGPA</div>
            <div className="text-xs font-bold text-primary mt-0.5">{profile.gpa.toFixed(2)}</div>
          </div>
          <div className="border-l border-slate-800/80">
            <div className="text-[10px] text-slate-400 font-semibold tracking-wider font-mono">CUMULATIVE</div>
            <div className="text-xs font-bold text-white mt-0.5">{profile.cgpa.toFixed(2)}</div>
          </div>
        </div>
      </div>

      {/* Navigation menu */}
      <nav id="sidebar-navigation" className="flex-1 px-4 py-4 space-y-1">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-item-${item.id}`}
              onClick={() => {
                if (item.id === 'settings') {
                  setActiveTab('profile');
                } else if (item.id === 'notifications') {
                  setActiveTab('notifications');
                } else {
                  setActiveTab(item.id);
                }
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-150 group font-medium text-sm cursor-pointer ${
                isActive 
                  ? 'bg-primary text-white font-semibold shadow-md shadow-primary/15' 
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <IconComponent className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                  isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200 group-hover:scale-105'
                }`} />
                <span>{item.label}</span>
              </div>
              {item.id === 'notifications' && unreadCount > 0 && (
                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md ${
                  isActive ? 'bg-primary/20 text-indigo-400' : 'bg-primary/20 text-primary-fixed-dim'
                }`}>
                  {unreadCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div id="sidebar-footer" className="p-4 border-t border-slate-800 bg-slate-950/20 space-y-3">
        {onLogout && (
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-between text-xs text-rose-450 hover:text-rose-200 hover:bg-rose-950/20 px-3 py-2 rounded-xl transition-all cursor-pointer font-bold group"
          >
            <div className="flex items-center gap-3">
              <LogOut className="h-4 w-4 tracking-normal group-hover:scale-105 transition-transform" />
              <span>Sign Out</span>
            </div>
            <span className="text-[9px] uppercase font-mono font-bold tracking-wider text-slate-600 group-hover:text-rose-400">Exit</span>
          </button>
        )}
        <div id="portal-version-info" className="flex items-center justify-between text-xs text-slate-500 font-mono px-2 py-1">
          <span>PORTAL VER: 3.0.0</span>
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
        </div>
      </div>
    </aside>
  );
};
