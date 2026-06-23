import React, { useState, useMemo } from 'react';
import { 
  Bell, 
  Search, 
  SlidersHorizontal, 
  CheckCheck, 
  Trash2, 
  Sparkles, 
  Calendar, 
  MapPin, 
  TrendingUp, 
  Target, 
  FileText, 
  Activity, 
  Inbox, 
  Shield, 
  Info, 
  Settings, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  X, 
  CheckCircle,
  AlertOctagon,
  Award,
  ChevronDown,
  LayoutGrid,
  Mail,
  Phone,
  HelpCircle,
  RefreshCw,
  Zap,
  ArrowRight
} from 'lucide-react';
import { NotificationItem } from '../types';

interface NotificationCenterViewProps {
  notifications: NotificationItem[];
  unreadCount: number;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
  setActiveTab: (tab: string) => void;
}

// Robust, realistic, expanded notification list to have 15-20 complete records
// and support full category filters and selects.
const DETAILED_NOTIFICATIONS = [
  {
    id: "nc-1",
    title: "Database Systems Assignment 02 Reminder",
    category: "assignments" as const,
    message: "Database Systems Assignment 02 is due tomorrow. Please double-check indexes, foreign keys, and query optimization structures before submitting in index file form.",
    timeLabel: "2 Hours Ago",
    priority: "high" as const,
    isRead: false,
    subject: "Database Systems",
    dueDate: "July 15, 2026",
    actionLabel: "View Assignment",
    actionTab: "assignments",
    createdDate: "2026-06-22T08:00:00Z"
  },
  {
    id: "nc-2",
    title: "Software Engineering Exam Countdown",
    category: "exams" as const,
    message: "Software Engineering Final Exam is scheduled in 5 days. Ensure your portfolio team uploads your design pattern reports and system diagrams before the panel deadline.",
    timeLabel: "Today",
    priority: "medium" as const,
    isRead: false,
    examDate: "August 02, 2026",
    venue: "Hall A",
    actionLabel: "View Exam",
    actionTab: "exams",
    createdDate: "2026-06-22T06:00:00Z"
  },
  {
    id: "nc-3",
    title: "CGPA Ledger Standing Updated",
    category: "gpa" as const,
    message: "Excellent results! Your overall CGPA has increased from 3.65 to 3.72 based on verified grades for Systems Modeling. Your Academic Standing has been recalculated.",
    timeLabel: "Yesterday",
    priority: "high" as const,
    isRead: false,
    academicStanding: "First Class",
    actionLabel: "View Analytics",
    actionTab: "analytics",
    createdDate: "2026-06-21T18:30:00Z"
  },
  {
    id: "nc-4",
    title: "Goal Progress Achievement Status",
    category: "goals" as const,
    message: "You have successfully completed 92% of your target GPA goal. Keep pushing to reach your 3.80 target GPA for the current Dean's Merit Scholarship evaluation term.",
    timeLabel: "Yesterday",
    priority: "high" as const,
    isRead: true,
    targetGpa: 3.80,
    currentGpa: 3.72,
    actionLabel: "View Goal Progress",
    actionTab: "analytics",
    createdDate: "2026-06-21T12:15:00Z"
  },
  {
    id: "nc-5",
    title: "Security Authentication Watchdog Alert",
    category: "system" as const,
    message: "A new login session was established on Chrome (macOS) from IP 192.168.1.132. If this was not you, please rotate your student credentials immediately.",
    timeLabel: "2 Days Ago",
    priority: "critical" as const,
    isRead: true,
    actionLabel: "Platform Updates",
    actionTab: "profile",
    createdDate: "2026-06-20T11:40:00Z"
  },
  {
    id: "nc-6",
    title: "New Semester Academic Syllabus Uploaded",
    category: "system" as const,
    message: "Your department advisor has officially provisioned Semester 5 (Active Syllabus tracker). Core structures are ready for analytics alignment.",
    timeLabel: "3 Days Ago",
    priority: "low" as const,
    isRead: true,
    createdDate: "2026-06-19T09:00:00Z"
  },
  {
    id: "nc-7",
    title: "Machine Learning Term Report Overdue Warning",
    category: "assignments" as const,
    message: "Automated alert: Machine Learning Report is scheduled for final submission Sunday. If you need special accommodations, contact your Dean.",
    timeLabel: "4 Days Ago",
    priority: "critical" as const,
    isRead: false,
    subject: "Machine Learning",
    dueDate: "July 20, 2026",
    actionLabel: "View Assignment",
    actionTab: "assignments",
    createdDate: "2026-06-18T10:00:00Z"
  },
  {
    id: "nc-8",
    title: "Computer Networks Lab Evaluation Published",
    category: "exams" as const,
    message: "Professor Harrison logged scores for Computer Networks Quiz 4. Your score average tracks at 88%. Individual class parameters verified.",
    timeLabel: "5 Days Ago",
    priority: "medium" as const,
    isRead: true,
    examDate: "June 17, 2026",
    venue: "Lab 04",
    actionLabel: "View Exam",
    actionTab: "exams",
    createdDate: "2026-06-17T16:00:00Z"
  },
  {
    id: "nc-9",
    title: "Advisory Note: General Credit Milestone Check",
    category: "goals" as const,
    message: "You are within 6 credit-hours of completing your core computer science software engineering sequence. Continue registering elective blocks on schedule.",
    timeLabel: "1 Week Ago",
    priority: "low" as const,
    isRead: true,
    actionLabel: "View Goal Progress",
    actionTab: "analytics",
    createdDate: "2026-06-15T14:22:00Z"
  },
  {
    id: "nc-10",
    title: "Weekly Productivity Digest Issued",
    category: "system" as const,
    message: "In-depth study logs show you tracked 18 hours of dedicated development study last week in Discrete Structures and Operating Systems. Great momentum!",
    timeLabel: "1 Week Ago",
    priority: "low" as const,
    isRead: true,
    createdDate: "2026-06-15T08:00:00Z"
  }
];

export const NotificationCenterView: React.FC<NotificationCenterViewProps> = ({
  notifications: parentNotifications,
  unreadCount: parentUnreadCount,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearAll,
  setActiveTab
}) => {
  // Use robust, unified local notifications list merging parent state
  const [localList, setLocalList] = useState(() => {
    const saved = localStorage.getItem('ssp_notification_center_notifications');
    if (saved) return JSON.parse(saved);
    return DETAILED_NOTIFICATIONS;
  });

  const saveToLocal = (newItems: typeof DETAILED_NOTIFICATIONS) => {
    setLocalList(newItems);
    localStorage.setItem('ssp_notification_center_notifications', JSON.stringify(newItems));
  };

  // State Management
  const [activeSubTab, setActiveSubTab] = useState<'feed' | 'settings'>('feed');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'latest' | 'priority'>('latest');
  const [selectedNotificationId, setSelectedNotificationId] = useState<string | null>(localList[0]?.id || null);
  const [showStatusToast, setShowStatusToast] = useState<string | null>(null);

  // Settings State Toggles for full simulation page
  const [settingsToggles, setSettingsToggles] = useState({
    // Deadlines
    assignmentDeadline: true,
    assignmentOverdue: true,
    // Exams
    examSchedule: true,
    examResults: true,
    // Performance
    gpaUpdates: true,
    goalProgress: true,
    // System
    platformUpdates: false,
    securityAlerts: true,
    // Channels
    inApp: true,
    email: true,
    sms: false // SMS remains disabled placeholder
  });

  const triggerToast = (msg: string) => {
    setShowStatusToast(msg);
    setTimeout(() => {
      setShowStatusToast(null);
    }, 4000);
  };

  // Handle Mark Single read
  const handleSingleMarkRead = (id: string) => {
    const next = localList.map(n => n.id === id ? { ...n, isRead: true } : n);
    saveToLocal(next);
    onMarkAsRead(id); // keep sync with App state
    triggerToast("Notification marked as read in system log.");
  };

  // Handle toggle read/unread status
  const toggleReadStatus = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = localList.map(n => n.id === id ? { ...n, isRead: !n.isRead } : n);
    saveToLocal(next);
    triggerToast("Notification status updated.");
  };

  // Handle Mark All Read
  const handleMarkAllLocalRead = () => {
    const next = localList.map(n => ({ ...n, isRead: true }));
    saveToLocal(next);
    onMarkAllAsRead(); // keeps sync with parent App state
    triggerToast("All notifications cataloged as read.");
  };

  // Handle Clear Local Notifications
  const handleClearLocalAll = () => {
    saveToLocal([]);
    onClearAll(); // keeps sync with parent state
    setSelectedNotificationId(null);
    triggerToast("All archived records cleared from active SaaS view.");
  };

  // Reset to default dataset for easier testing of completed UI flow
  const handleResetFeed = () => {
    saveToLocal(DETAILED_NOTIFICATIONS);
    setSelectedNotificationId(DETAILED_NOTIFICATIONS[0].id);
    triggerToast("SaaS database feed reset back to 10 rich university records.");
  };

  // Handle individual deleted notification
  const handleDeleteNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = localList.filter(n => n.id !== id);
    saveToLocal(next);
    if (selectedNotificationId === id) {
      setSelectedNotificationId(next[0]?.id || null);
    }
    triggerToast("Target alert record discarded from platform feed.");
  };

  // Filtered Notifications based on Search & Tabs
  const filteredList = useMemo(() => {
    return localList.filter(item => {
      const matchesSearch = searchQuery === '' || 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.subject && item.subject.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
      
      return matchesSearch && matchesCategory;
    }).sort((a, b) => {
      if (sortBy === 'priority') {
        const priorityScore = { critical: 4, high: 3, medium: 2, low: 1 };
        return priorityScore[b.priority] - priorityScore[a.priority];
      }
      // default: latest
      return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
    });
  }, [localList, categoryFilter, searchQuery, sortBy]);

  // Selected Notification Record
  const selectedNotification = useMemo(() => {
    return localList.find(n => n.id === selectedNotificationId) || null;
  }, [localList, selectedNotificationId]);

  // Priority Color Map Wrapper
  const getPriorityStyle = (priority: 'low' | 'medium' | 'high' | 'critical') => {
    switch (priority) {
      case 'critical':
        return {
          bg: 'bg-red-50 text-red-700 border-red-100',
          dot: 'bg-red-500',
          text: 'Critical',
          badge: 'bg-red-600'
        };
      case 'high':
        return {
          bg: 'bg-orange-50 text-orange-700 border-orange-100',
          dot: 'bg-orange-500',
          text: 'High',
          badge: 'bg-orange-500'
        };
      case 'medium':
        return {
          bg: 'bg-blue-50 text-blue-700 border-blue-105',
          dot: 'bg-blue-500',
          text: 'Medium',
          badge: 'bg-blue-500'
        };
      case 'low':
      default:
        return {
          bg: 'bg-slate-50 text-slate-600 border-slate-200',
          dot: 'bg-slate-400',
          text: 'Low',
          badge: 'bg-slate-400'
        };
    }
  };

  // Category Icon Renderer
  const getCategoryTheme = (category: string) => {
    switch (category) {
      case 'assignments':
        return {
          icon: <FileText className="w-4 h-4" />,
          color: 'text-orange-600 bg-orange-50 border-orange-100',
          title: 'Assignment'
        };
      case 'exams':
        return {
          icon: <Award className="w-4 h-4" />,
          color: 'text-purple-600 bg-purple-50 border-purple-100',
          title: 'Exam Schedule'
        };
      case 'gpa':
        return {
          icon: <TrendingUp className="w-4 h-4" />,
          color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
          title: 'GPA Alert'
        };
      case 'goals':
        return {
          icon: <Target className="w-4 h-4" />,
          color: 'text-blue-600 bg-blue-50 border-blue-100',
          title: 'Academic Goal'
        };
      case 'system':
      default:
        return {
          icon: <Bell className="w-4 h-4" />,
          color: 'text-indigo-600 bg-indigo-50 border-indigo-150',
          title: 'System Notice'
        };
    }
  };

  // Category Tabs Configuration
  const categoryTabs = [
    { id: 'all', label: 'All Notifications', count: localList.length },
    { id: 'assignments', label: 'Assignments', count: localList.filter(item => item.category === 'assignments').length },
    { id: 'exams', label: 'Exams', count: localList.filter(item => item.category === 'exams').length },
    { id: 'gpa', label: 'GPA Updates', count: localList.filter(item => item.category === 'gpa').length },
    { id: 'goals', label: 'Academic Goals', count: localList.filter(item => item.category === 'goals').length },
    { id: 'system', label: 'System Notifications', count: localList.filter(item => item.category === 'system').length }
  ];

  // Dynamic distribution mapping for the donut chart segment rendering
  const activeUnreadCount = localList.filter(item => !item.isRead).length;

  return (
    <div id="notification-center-workspace" className="space-y-6 text-slate-800 animate-fade-in relative">
      
      {/* SaaS Status Toast */}
      {showStatusToast && (
        <div className="fixed bottom-6 right-6 bg-slate-900 border border-slate-800 text-white p-4 rounded-2xl shadow-xl flex items-center gap-3 animate-slide-in-right z-50 transition-all text-xs font-sans max-w-sm">
          <div className="h-6 w-6 rounded-full bg-indigo-600/25 flex items-center justify-center text-indigo-400">
            <Zap className="w-4 h-4" />
          </div>
          <div className="space-y-0.5">
            <h5 className="font-extrabold text-white">Platform Notification Ledger</h5>
            <p className="text-slate-300 font-medium">{showStatusToast}</p>
          </div>
          <button onClick={() => setShowStatusToast(null)} className="ml-auto text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* HEADER SECTION AREA */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-3xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 font-extrabold text-[10px] uppercase tracking-wider py-1 px-3 rounded-full border border-indigo-100">
            <Bell className="w-3.5 h-3.5" /> SECURE SAAS EVENT REGISTER
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Notification Center</h2>
          <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
            Stay informed about assignments, exams, GPA updates, academic goals, and important university activities.
          </p>
        </div>

        {/* Global tab control */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-100 p-0.5 rounded-xl border border-slate-200 flex">
            <button
              onClick={() => setActiveSubTab('feed')}
              className={`px-3 py-1.5 text-xs font-black rounded-lg transition-all ${activeSubTab === 'feed' ? 'bg-white text-slate-850 shadow-3xs' : 'text-slate-450 hover:text-slate-700'}`}
            >
              Notifications Feed
            </button>
            <button
              onClick={() => setActiveSubTab('settings')}
              className={`px-3 py-1.5 text-xs font-black rounded-lg transition-all ${activeSubTab === 'settings' ? 'bg-white text-indigo-700 shadow-3xs' : 'text-slate-450 hover:text-slate-700'}`}
            >
              <span className="flex items-center gap-1.5">
                <Settings className="w-3.5 h-3.5" /> Settings
              </span>
            </button>
          </div>

          {localList.length === 0 && (
            <button
              onClick={handleResetFeed}
              className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-150 text-[11px] font-bold px-3 py-1.5 rounded-xl transition-all"
            >
              Reset Mock Data
            </button>
          )}
        </div>
      </div>

      {/* STATISTICS CARDS ROW - SIX INTEGRALS */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        
        {/* Card 1: Total Notifications */}
        <div className="bg-white border border-slate-200 p-4 rounded-2xl flex flex-col justify-between shadow-3xs hover:-translate-y-0.5 hover:shadow-2xs transition-all ring-1 ring-slate-100">
          <span className="text-[10px] font-black text-slate-450 uppercase font-mono tracking-wider block">Total Notifications</span>
          <dd className="text-2xl font-black font-mono text-slate-900 mt-2">156</dd>
          <span className="text-[9px] text-slate-400 mt-1 block">Accumulated historical logs</span>
        </div>

        {/* Card 2: Unread Notifications */}
        <div className="bg-white border border-slate-205 p-4 rounded-2xl flex flex-col justify-between shadow-3xs hover:-translate-y-0.5 hover:shadow-2xs transition-all ring-1 ring-slate-100">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black text-slate-450 uppercase font-mono tracking-wider block">Unread Notifications</span>
            <span className="h-2 w-2 rounded-full bg-orange-500 animate-pulse shrink-0" />
          </div>
          <dd className="text-2xl font-black font-mono text-indigo-950 mt-2">{activeUnreadCount}</dd>
          <span className="text-[9px] text-indigo-600 font-bold block mt-1">Require immediate task audit</span>
        </div>

        {/* Card 3: Upcoming Deadlines */}
        <div className="bg-white border border-slate-200 p-4 rounded-2xl flex flex-col justify-between shadow-3xs hover:-translate-y-0.5 hover:shadow-2xs transition-all ring-1 ring-slate-100">
          <span className="text-[10px] font-black text-slate-450 uppercase font-mono tracking-wider block">Upcoming Deadlines</span>
          <dd className="text-2xl font-black font-mono text-orange-700 mt-2">4</dd>
          <span className="text-[9px] text-slate-400 mt-1 block">Due prior to term end</span>
        </div>

        {/* Card 4: Upcoming Exams */}
        <div className="bg-white border border-slate-200 p-4 rounded-2xl flex flex-col justify-between shadow-3xs hover:-translate-y-0.5 hover:shadow-2xs transition-all ring-1 ring-slate-100">
          <span className="text-[10px] font-black text-slate-450 uppercase font-mono tracking-wider block">Upcoming Exams</span>
          <dd className="text-2xl font-black font-mono text-purple-700 mt-2">2</dd>
          <span className="text-[9px] text-purple-600 font-bold block mt-1">Syllabus block finalized</span>
        </div>

        {/* Card 5: Goal Updates */}
        <div className="bg-white border border-slate-200 p-4 rounded-2xl flex flex-col justify-between shadow-3xs hover:-translate-y-0.5 hover:shadow-2xs transition-all ring-1 ring-slate-100">
          <span className="text-[10px] font-black text-slate-450 uppercase font-mono tracking-wider block">Goal Updates</span>
          <dd className="text-2xl font-black font-mono text-blue-700 mt-2">3</dd>
          <span className="text-[9px] text-slate-400 mt-1 block">92% completion achieved</span>
        </div>

        {/* Card 6: GPA Alerts */}
        <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 text-white border border-transparent p-4 rounded-2xl flex flex-col justify-between shadow-md hover:-translate-y-0.5 hover:shadow-sm transition-all group">
          <span className="text-[10px] font-black text-indigo-200 uppercase font-mono tracking-wider block">GPA Alerts</span>
          <dd className="text-2xl font-black font-mono text-indigo-50 mt-2">2</dd>
          <span className="text-[9px] text-indigo-350 font-bold block mt-1">Dean Standing: First Class</span>
        </div>

      </div>

      {activeSubTab === 'feed' ? (
        /* ==================== SCREEN A: NOTIFICATIONS DASHBOARD FEED ==================== */
        <div className="space-y-6">
          
          {/* TOP FILTER & SEARCH ROW */}
          <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-3xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            {/* Search inputs bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-450 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search notification title, message description or course name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-8 py-1.5 text-xs font-semibold outline-none focus:bg-white focus:border-indigo-650 text-slate-700"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 select-none">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick Actions and Filter layout option updates */}
            <div className="flex flex-wrap items-center gap-3">
              
              {/* Category selector dropdown (small design tweak option) */}
              <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-700">
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-405" />
                <span className="text-[10px] font-mono tracking-wider font-extrabold uppercase text-slate-400 mr-1">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'latest' | 'priority')}
                  className="bg-transparent border-none outline-none font-bold text-xs cursor-pointer text-slate-750"
                >
                  <option value="latest">Latest</option>
                  <option value="priority">Priority Order</option>
                </select>
              </div>

              {/* Direct Buttons Actions requested inside Top Section */}
              <button
                onClick={handleMarkAllLocalRead}
                disabled={activeUnreadCount === 0}
                className="inline-flex items-center gap-1.5 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 disabled:opacity-50 transition-all font-black text-xs px-3.5 py-1.5 rounded-xl border border-indigo-100 cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5" /> Mark All as Read
              </button>

              <button
                onClick={() => setActiveSubTab('settings')}
                className="inline-flex items-center gap-1.5 text-slate-700 bg-white hover:bg-slate-50 transition-all border border-slate-200 font-extrabold text-xs px-3.5 py-1.5 rounded-xl cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5 text-slate-400" /> Notification Settings
              </button>

              <button
                onClick={handleClearLocalAll}
                disabled={localList.length === 0}
                className="inline-flex items-center gap-1 text-slate-400 hover:text-red-700 transition-colors font-bold text-xs px-2.5 py-1"
                title="Discard all feed entries"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear All
              </button>
            </div>
          </div>

          {/* DYNAMIC CATEGORY FILTER TABS BAR */}
          <div className="border-b border-slate-200 flex items-center overflow-x-auto no-scrollbar py-1">
            <div className="flex gap-2">
              {categoryTabs.map(tab => {
                const isActive = categoryFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setCategoryFilter(tab.id)}
                    className={`px-4 py-2.5 text-xs font-black rounded-t-xl transition-all relative shrink-0 cursor-pointer ${
                      isActive 
                        ? 'text-indigo-700 border-b-2 border-indigo-600 font-extrabold' 
                        : 'text-slate-450 hover:text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      {tab.label}
                      <span className={`text-[10px] py-0.2 px-1.5 rounded-full font-mono font-black ${
                        isActive ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {tab.count}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* MAIN THREE COLUMN GRID CONFIG: FEED BAR (8 spans) + SIDEBARS (4 spans) */}
          {filteredList.length === 0 ? (
            
            /* EMPTY STATE SCREEN - BRAND ILLUSTRATIVE INSTRUCTIONS */
            <div className="bg-white border border-slate-200 rounded-3xl p-16 text-center max-w-2xl mx-auto space-y-6 shadow-3xs">
              <div className="h-20 w-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto border border-indigo-100 shadow-3xs relative animate-bounce">
                <Inbox className="w-9 h-9" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-emerald-500 rounded-full border-2 border-white" />
              </div>
              <div className="space-y-2">
                <h4 className="text-lg font-black text-slate-900 leading-tight">All Caught Up!</h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                  No notifications available. You're all caught up with your academic activities. Your Student Success Platform ledger is operating at maximum efficiency.
                </p>
              </div>
              <div className="flex justify-center gap-3">
                <button
                  onClick={handleResetFeed}
                  className="bg-indigo-600 hover:bg-indigo-705 text-white font-extrabold text-xs py-2 px-5 rounded-xl transition-all shadow-xs"
                >
                  Generate Core Simulation Records
                </button>
                <button
                  onClick={() => {
                    setCategoryFilter('all');
                    setSearchQuery('');
                  }}
                  className="bg-white border border-slate-200 text-slate-750 font-bold text-xs py-2 px-4 rounded-xl hover:bg-slate-50"
                >
                  Clear Active Filters
                </button>
              </div>
            </div>

          ) : (

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* LEFT: FEED STREAM (7 spans) */}
              <div className="lg:col-span-7 space-y-3.5">
                
                <div className="px-1 flex items-center justify-between text-xs text-slate-450 font-mono">
                  <span>Showing {filteredList.length} unified academic notifications</span>
                  <span>Sort Order: {sortBy === 'latest' ? 'Recency Timeline' : 'SaaS Criticality'}</span>
                </div>

                <div className="space-y-3">
                  {filteredList.map((item) => {
                    const isSelected = selectedNotificationId === item.id;
                    const cTheme = getCategoryTheme(item.category);
                    const prio = getPriorityStyle(item.priority);

                    return (
                      <div
                        key={item.id}
                        onClick={() => setSelectedNotificationId(item.id)}
                        className={`group border rounded-2xl p-4.5 cursor-pointer transition-all relative ${
                          isSelected 
                            ? 'bg-indigo-50/40 border-indigo-300 ring-1 ring-indigo-200 shadow-2xs' 
                            : 'bg-white border-slate-200 hover:border-slate-350 hover:shadow-3xs'
                        }`}
                      >
                        {/* Unread indicator colored solid dot */}
                        {!item.isRead && (
                          <span className="absolute top-4.5 right-4.5 w-2 h-2 rounded-full bg-orange-500" title="Unread event" />
                        )}

                        <div className="flex gap-3.5">
                          {/* Left category style circle badge */}
                          <div className={`h-9 w-9 rounded-xl border flex items-center justify-center shrink-0 ${cTheme.color}`}>
                            {cTheme.icon}
                          </div>

                          {/* Center Title, subtitle details & content text summaries */}
                          <div className="space-y-2 flex-1 min-w-0">
                            
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-slate-400">
                                {cTheme.title}
                              </span>
                              <span className="text-[10px] text-slate-350">•</span>
                              <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" /> {item.timeLabel}
                              </span>

                              {/* Priority badge pill */}
                              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${prio.bg}`}>
                                {prio.text} Priority
                              </span>
                            </div>

                            <h3 className={`text-sm font-black tracking-tight leading-snug ${
                              item.isRead ? 'text-slate-800' : 'text-slate-950 font-black'
                            }`}>
                              {item.title}
                            </h3>

                            <p className="text-xs text-slate-550 leading-relaxed font-sans font-medium line-clamp-2 select-all">
                              {item.message}
                            </p>

                            {/* Extra structured values specified inside instructions */}
                            {item.category === 'assignments' && item.subject && (
                              <div className="bg-slate-50 border border-slate-150 p-2.5 rounded-xl text-xs space-y-1 my-2">
                                <div className="text-slate-400 font-mono text-[9px] uppercase tracking-wider font-bold">Assignment Specifications</div>
                                <div className="grid grid-cols-2 gap-2 mt-1">
                                  <div>
                                    <span className="text-slate-450 block text-[10px]">Subject:</span>
                                    <strong className="text-slate-700 font-extrabold">{item.subject}</strong>
                                  </div>
                                  <div>
                                    <span className="text-slate-450 block text-[10px]">Due Date:</span>
                                    <strong className="text-slate-700 font-extrabold">{item.dueDate || "N/A"}</strong>
                                  </div>
                                </div>
                              </div>
                            )}

                            {item.category === 'exams' && item.examDate && (
                              <div className="bg-purple-50/30 border border-purple-100 p-2.5 rounded-xl text-xs space-y-1 my-2">
                                <div className="text-purple-600 font-mono text-[9px] uppercase tracking-wider font-bold">Exam Schedule Details</div>
                                <div className="grid grid-cols-2 gap-2 mt-1">
                                  <div>
                                    <span className="text-slate-450 block text-[10px]">Exam Date:</span>
                                    <strong className="text-slate-700 font-extrabold">{item.examDate}</strong>
                                  </div>
                                  <div>
                                    <span className="text-slate-450 block text-[10px]">Venue:</span>
                                    <strong className="text-slate-700 font-extrabold flex items-center gap-1 text-purple-700">
                                      <MapPin className="w-3.5 h-3.5" /> {item.venue || "Hall A"}
                                    </strong>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Actions Buttons listed inside specifications */}
                            <div className="flex items-center justify-between pt-1.5 border-t border-slate-100/60 mt-3 flex-wrap gap-2.5">
                              
                              {/* Left contextual button triggers */}
                              <div className="flex items-center gap-1.5">
                                {item.actionLabel && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (item.actionTab) {
                                        setActiveTab(item.actionTab);
                                      }
                                    }}
                                    className="inline-flex items-center gap-1 bg-white hover:bg-slate-50 text-indigo-750 font-extrabold text-[10.5px] border border-slate-200 rounded-lg px-2.5 py-1 transition-all"
                                  >
                                    {item.actionLabel} &rarr;
                                  </button>
                                )}
                                
                                {item.category === 'exams' && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      triggerToast("🗓 study plan created! 4.5 hours logged under Software Engineering.");
                                    }}
                                    className="inline-flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-[10px] rounded-lg px-2.5 py-1 transition-all"
                                  >
                                    Add Study Plan
                                  </button>
                                )}
                              </div>

                              {/* Right generic system button triggers */}
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={(e) => toggleReadStatus(item.id, e)}
                                  className="text-[10px] text-slate-500 hover:text-indigo-600 transition-colors font-bold px-2 py-1"
                                >
                                  {item.isRead ? 'Mark as Unread' : 'Mark as Read'}
                                </button>
                                
                                <button
                                  onClick={(e) => handleDeleteNotification(item.id, e)}
                                  className="text-[10px] text-slate-400 hover:text-rose-600 transition-colors p-1"
                                  title="Remove from stream"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>

                            </div>

                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* RIGHT: DETAILS PANEL & METRICS SECTIONS (5 spans) */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* 1. NOTIFICATION DETAILS PANEL */}
                <div className="bg-white border border-slate-205 rounded-2xl p-5 shadow-3xs space-y-4">
                  <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900 font-sans block uppercase tracking-wider">Details Panel</span>
                    <span className="text-[9px] font-mono text-slate-400 font-medium">Selected event metadata</span>
                  </div>

                  {selectedNotification ? (
                    <div className="space-y-4 font-sans text-xs">
                      
                      {/* Top identity banner */}
                      <div className="space-y-1.5 bg-slate-50/50 p-3.5 border border-slate-150 rounded-xl">
                        <div className="flex items-center gap-2">
                          <span className={`inline-block w-2.5 h-2.5 rounded-full ${getPriorityStyle(selectedNotification.priority).dot}`} />
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            {selectedNotification.category} classification
                          </span>
                        </div>
                        <h4 className="text-sm font-black text-slate-900 leading-snug">
                          {selectedNotification.title}
                        </h4>
                      </div>

                      {/* Descriptive Core message block */}
                      <p className="text-xs text-slate-650 leading-relaxed select-all">
                        {selectedNotification.message}
                      </p>

                      {/* Attributes list */}
                      <div className="border-y border-dashed border-slate-200 py-3 space-y-2.5 font-sans">
                        
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 font-semibold">Priority Level</span>
                          <span className={`font-bold px-2.5 py-0.5 rounded-full text-[10px] border ${getPriorityStyle(selectedNotification.priority).bg}`}>
                            {selectedNotification.priority.toUpperCase()}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 font-semibold">Created Date</span>
                          <span className="font-mono text-slate-700 font-semibold">
                            {new Date(selectedNotification.createdDate).toLocaleDateString()} at {new Date(selectedNotification.createdDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 font-semibold">Related Module</span>
                          <span className="font-mono text-indigo-700 font-black bg-indigo-50/70 border border-indigo-100 px-2 py-0.5 rounded">
                            {selectedNotification.subject || "Platform Kernel v3"}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 font-semibold">Status</span>
                          <span className={`inline-flex items-center gap-1 font-mono font-bold text-[10px] rounded px-2 py-0.5 border ${selectedNotification.isRead ? 'bg-emerald-50 text-emerald-800 border-emerald-100' : 'bg-orange-50 text-orange-800 border-orange-200'}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${selectedNotification.isRead ? 'bg-emerald-500' : 'bg-orange-500'}`} />
                            {selectedNotification.isRead ? 'Checked / Read' : 'Unread'}
                          </span>
                        </div>

                      </div>

                      {/* Action Triggers footer inside Details Panel */}
                      <div className="flex gap-2 justify-end pt-1">
                        
                        {!selectedNotification.isRead && (
                          <button
                            onClick={() => handleSingleMarkRead(selectedNotification.id)}
                            className="bg-indigo-650 hover:bg-indigo-700 text-white text-[11px] font-extrabold px-3.5 py-1.5 rounded-xl cursor-pointer"
                          >
                            Mark as Read
                          </button>
                        )}

                        {selectedNotification.actionLabel && (
                          <button
                            onClick={() => {
                              if (selectedNotification.actionTab) {
                                setActiveTab(selectedNotification.actionTab);
                              }
                            }}
                            className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-205 text-[11px] font-bold px-3.5 py-1.5 rounded-xl flex items-center gap-1"
                          >
                            <span>Open Related View</span>
                            <ArrowRight className="w-3 h-3 text-slate-450" />
                          </button>
                        )}
                        
                        <button
                          onClick={(e) => handleDeleteNotification(selectedNotification.id, e)}
                          className="bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-semibold px-3 py-1.5 rounded-xl"
                        >
                          Delete Record
                        </button>

                      </div>

                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Inbox className="w-7 h-7 text-slate-250 mx-auto mb-2" />
                      <p className="text-xs text-slate-400">Select any notification card from the feed stream to analyze its metadata dossier.</p>
                    </div>
                  )}

                </div>

                {/* 2. UPCOMING ACTIVITIES WIDGET */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-3xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h4 className="text-xs font-black tracking-wider uppercase text-slate-800 flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-orange-505" /> Upcoming Activities Widget
                    </h4>
                    <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded font-bold">Tracked</span>
                  </div>

                  <div className="space-y-4 text-xs font-sans">
                    
                    {/* ASSIGNMENTS DUE SOON */}
                    <div className="space-y-2">
                      <span className="text-[9px] font-mono text-slate-450 uppercase font-black tracking-widest block">Assignments Due Soon</span>
                      
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between bg-slate-50 border border-slate-150 p-2 rounded-xl">
                          <span className="font-semibold text-slate-800">Database Systems Assignment</span>
                          <span className="font-mono text-[10px] text-red-600 font-extrabold bg-red-50/50 border border-red-100 px-1.5 py-0.2 rounded">1 Day Left</span>
                        </div>
                        <div className="flex items-center justify-between bg-slate-50 border border-slate-150 p-2 rounded-xl">
                          <span className="font-semibold text-slate-800">Machine Learning Report</span>
                          <span className="font-mono text-[10px] text-orange-600 font-extrabold bg-orange-50/50 border border-orange-100 px-1.5 py-0.2 rounded">3 Days Left</span>
                        </div>
                      </div>
                    </div>

                    {/* UPCOMING EXAMS */}
                    <div className="space-y-2 pt-1">
                      <span className="text-[9px] font-mono text-slate-450 uppercase font-black tracking-widest block">Upcoming Exams</span>
                      
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between bg-purple-50/20 border border-purple-100 p-2 rounded-xl">
                          <span className="font-semibold text-slate-800">Software Engineering Final</span>
                          <span className="font-mono text-[10px] text-purple-700 font-extrabold bg-purple-100 px-1.5 py-0.2 rounded">5 Days Left</span>
                        </div>
                        <div className="flex items-center justify-between bg-purple-50/20 border border-purple-100 p-2 rounded-xl">
                          <span className="font-semibold text-slate-800">Computer Networks Quiz</span>
                          <span className="font-mono text-[10px] text-slate-500 font-medium">7 Days Left</span>
                        </div>
                      </div>
                    </div>

                    {/* ACADEMIC GOALS */}
                    <div className="space-y-2 pt-1 font-sans">
                      <span className="text-[9px] font-mono text-slate-450 uppercase font-black tracking-widest block">Academic Goals Progress</span>
                      
                      <div className="space-y-2.5 bg-slate-50/50 p-3 border border-slate-150 rounded-xl">
                        
                        <div className="space-y-1">
                          <div className="flex justify-between text-[11px]">
                            <span className="text-slate-650 font-medium">GPA Goal Progress</span>
                            <span className="font-mono font-bold text-indigo-700">92% Done</span>
                          </div>
                          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-600 rounded-full" style={{ width: '92%' }} />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-[11px]">
                            <span className="text-slate-650 font-medium">Credit Completion Milestone</span>
                            <span className="font-mono font-bold text-emerald-700">88% Done</span>
                          </div>
                          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: '88%' }} />
                          </div>
                        </div>

                      </div>
                    </div>

                  </div>
                </div>

                {/* 3. NOTIFICATION ANALYTICS REGISTER (Charts & Segments) */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-3xs space-y-5">
                  <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                    <h4 className="text-xs font-black tracking-wider uppercase text-slate-800 flex items-center gap-1.5">
                      <Activity className="w-4 h-4 text-indigo-600" /> Notification Analytics Section
                    </h4>
                    <span className="text-[10px] font-mono text-slate-400">Metrics engine v3</span>
                  </div>

                  {/* DONUT CHART TYPES DISTRIBUTION */}
                  <div className="space-y-2.5">
                    <span className="text-[9px] font-mono text-slate-450 uppercase font-black tracking-widest block text-center">Notification Types Distribution</span>
                    
                    <div className="flex flex-col sm:flex-row items-center gap-4 py-2 bg-slate-50 border border-slate-100 p-4 rounded-xl">
                      
                      {/* SVG Donut Illustration */}
                      <div className="h-32 w-32 shrink-0 relative flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                          {/* Segment 1: Assignments (25%) */}
                          <circle cx="50" cy="50" r="35" fill="none" stroke="#f97316" strokeWidth="11" strokeDasharray="54.95 219.8" strokeDashoffset="0" />
                          {/* Segment 2: Exams (25%) */}
                          <circle cx="50" cy="50" r="35" fill="none" stroke="#8b5cf6" strokeWidth="11" strokeDasharray="54.95 219.8" strokeDashoffset="-54.95" />
                          {/* Segment 3: GPA Updates (20%) */}
                          <circle cx="50" cy="50" r="35" fill="none" stroke="#10b981" strokeWidth="11" strokeDasharray="43.96 219.8" strokeDashoffset="-109.9" />
                          {/* Segment 4: Goals (15%) */}
                          <circle cx="50" cy="50" r="35" fill="none" stroke="#06b6d4" strokeWidth="11" strokeDasharray="32.97 219.8" strokeDashoffset="-153.86" />
                          {/* Segment 5: System Notices (15%) */}
                          <circle cx="50" cy="50" r="35" fill="none" stroke="#6366f1" strokeWidth="11" strokeDasharray="32.97 219.8" strokeDashoffset="-186.83" />
                        </svg>
                        
                        <div className="absolute text-center flex flex-col items-center">
                          <strong className="text-sm font-black text-slate-850 font-mono">100%</strong>
                          <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider font-mono">SaaS Share</span>
                        </div>
                      </div>

                      {/* Legends */}
                      <div className="grid grid-cols-1 gap-1.5 w-full text-[10px] font-sans font-bold text-slate-650">
                        <div className="flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-orange-500 shrink-0" />
                          <span>Assignments: 25%</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-purple-500 shrink-0" />
                          <span>Exams: 25%</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                          <span>GPA Updates: 20%</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-cyan-550 bg-cyan-500 shrink-0" />
                          <span>Academic Goals: 15%</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-indigo-500 shrink-0" />
                          <span>System Alerts: 15%</span>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* LINE CHART ACTIVITY TIMELINE */}
                  <div className="space-y-2.5 pt-1">
                    <span className="text-[9px] font-mono text-slate-450 uppercase font-black tracking-widest block text-center">Activity Timeline</span>
                    
                    <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
                      {/* Metric lines with simple responsive vector */}
                      <svg className="w-full h-24 overflow-visible" viewBox="0 0 300 80">
                        {/* Horizontal markers */}
                        <line x1="0" y1="10" x2="300" y2="10" stroke="#f1f5f9" strokeDasharray="3 3" />
                        <line x1="0" y1="40" x2="300" y2="40" stroke="#f1f5f9" strokeDasharray="3 3" />
                        <line x1="0" y1="70" x2="300" y2="70" stroke="#cbd5e1" />
                        
                        {/* Bezier Path metric representating daily event trends */}
                        <path 
                          d="M 10,65 Q 60,15 110,45 T 210,25 T 290,15" 
                          fill="none" 
                          stroke="#4f46e5" 
                          strokeWidth="2.5" 
                          strokeLinecap="round" 
                        />
                        <path 
                          d="M 10,65 Q 60,15 110,45 T 210,25 T 290,15 L 290,70 L 10,70 Z" 
                          fill="none" 
                          className="fill-indigo-50/40" 
                        />
                        
                        {/* Nodes */}
                        <circle cx="10" cy="65" r="3" fill="#4f46e5" />
                        <circle cx="110" cy="45" r="3" fill="#4f46e5" />
                        <circle cx="210" cy="25" r="3" fill="#4f46e5" />
                        <circle cx="290" cy="15" r="3" fill="#4f46e5" />

                        <text x="10" y="78" className="text-[8px] font-mono" fill="#94a3b8">Mon</text>
                        <text x="110" y="78" className="text-[8px] font-mono" fill="#94a3b8">Wed</text>
                        <text x="210" y="78" className="text-[8px] font-mono" fill="#94a3b8">Fri</text>
                        <text x="270" y="78" className="text-[8px] font-mono" fill="#94a3b8">Sun (Today)</text>
                      </svg>
                      <span className="text-[10px] text-slate-450 block text-center mt-1 font-semibold">Weekly notification event volumes tracking scale</span>
                    </div>
                  </div>

                </div>

                {/* 4. RECENT ACADEMIC EVENTS WIDGET */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-3xs space-y-4">
                  <div className="border-b border-slate-100 pb-3">
                    <h4 className="text-xs font-black tracking-wider uppercase text-slate-800 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-blue-505 animate-spin-slow" /> Recent Academic Events
                    </h4>
                  </div>

                  <div className="space-y-3.5 pl-2 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                    
                    <div className="flex gap-3 text-xs font-sans relative">
                      <div className="h-2 w-2 rounded-full bg-emerald-500 absolute left-2 top-1.5 ring-4 ring-emerald-50" />
                      <div className="pl-6 space-y-0.5">
                        <strong className="text-slate-850 font-bold block">New Semester Created</strong>
                        <p className="text-slate-450 text-[11px] font-medium leading-normal">Semester 5 track initialized in administrative node database logs for regular syllabus flow.</p>
                      </div>
                    </div>

                    <div className="flex gap-3 text-xs font-sans relative">
                      <div className="h-2 w-2 rounded-full bg-blue-550 bg-blue-500 absolute left-2 top-1.5 ring-4 ring-blue-50" />
                      <div className="pl-6 space-y-0.5">
                        <strong className="text-slate-850 font-bold block">Subject Added</strong>
                        <p className="text-slate-450 text-[11px] font-medium leading-normal">Systems Modeling was cataloged under academic portfolio syllabus checklists.</p>
                      </div>
                    </div>

                    <div className="flex gap-3 text-xs font-sans relative">
                      <div className="h-2 w-2 rounded-full bg-indigo-505 bg-indigo-550 bg-indigo-550 bg-indigo-550 bg-indigo-500 absolute left-2 top-1.5 ring-4 ring-indigo-50" />
                      <div className="pl-6 space-y-0.5">
                        <strong className="text-slate-850 font-bold block">Assignment Submitted</strong>
                        <p className="text-slate-450 text-[11px] font-medium leading-normal">Software Engineering Portfolio Architecture file submitted to professor registry Sunday.</p>
                      </div>
                    </div>

                    <div className="flex gap-3 text-xs font-sans relative">
                      <div className="h-2 w-2 rounded-full bg-purple-500 absolute left-2 top-1.5 ring-4 ring-purple-50" />
                      <div className="pl-6 space-y-0.5">
                        <strong className="text-slate-850 font-bold block">GPA Calculated</strong>
                        <p className="text-slate-450 text-[11px] font-medium leading-normal">CGPA optimized score updated instantly following professor marks uploads.</p>
                      </div>
                    </div>

                    <div className="flex gap-3 text-xs font-sans relative">
                      <div className="h-2 w-2 rounded-full bg-amber-500 absolute left-2 top-1.5 ring-4 ring-amber-50" />
                      <div className="pl-6 space-y-0.5">
                        <strong className="text-slate-850 font-bold block">Exam Results Released</strong>
                        <p className="text-slate-450 text-[11px] font-medium leading-normal">Honors level Database engineering quiz outcomes published successfully.</p>
                      </div>
                    </div>

                  </div>
                </div>

              </div>

            </div>
          )}

        </div>
      ) : (
        /* ==================== SCREEN B: NOTIFICATION SETTINGS PAGE ==================== */
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-3xs space-y-6">
          <div className="border-b border-slate-100 pb-4 space-y-1">
            <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Settings className="text-indigo-600 w-5 h-5" /> Academic Notification Settings Page
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Configure your desired alerts, delivery channels, and platform watchdog reminders to balance focus with academic alignment.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Columns (8 spans) - Alert Categories */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Card 1: Assignment Notifications */}
              <div className="border border-slate-205 rounded-2xl p-5 shadow-3xs space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-50 pb-2">
                  <div className="h-7 w-7 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-100 shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-850">Assignment Notifications</h4>
                    <p className="text-[10px] text-slate-450">Track coursework and submissions windows</p>
                  </div>
                </div>

                <div className="divide-y divide-slate-100 text-xs font-sans">
                  
                  <div className="flex items-center justify-between py-3">
                    <div className="space-y-0.5 max-w-md">
                      <strong className="text-slate-850 font-bold block">Upcoming Deadline Reminders</strong>
                      <span className="text-[11px] text-slate-450 block leading-normal">Send automated alerts 48h, 24h, and 2h before any assignment target closes.</span>
                    </div>
                    
                    <button
                      onClick={() => setSettingsToggles(prev => ({ ...prev, assignmentDeadline: !prev.assignmentDeadline }))}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${settingsToggles.assignmentDeadline ? 'bg-indigo-600' : 'bg-slate-200'}`}
                    >
                      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${settingsToggles.assignmentDeadline ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div className="space-y-0.5 max-w-md">
                      <strong className="text-slate-850 font-bold block">Overdue Assignment Alerts</strong>
                      <span className="text-[11px] text-slate-450 block leading-normal">Prompt critical status notices if homework remains un-marked after class checkpoints.</span>
                    </div>

                    <button
                      onClick={() => setSettingsToggles(prev => ({ ...prev, assignmentOverdue: !prev.assignmentOverdue }))}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${settingsToggles.assignmentOverdue ? 'bg-indigo-600' : 'bg-slate-200'}`}
                    >
                      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${settingsToggles.assignmentOverdue ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </div>

                </div>
              </div>

              {/* Card 2: Exam Notifications */}
              <div className="border border-slate-205 rounded-2xl p-5 shadow-3xs space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-50 pb-2">
                  <div className="h-7 w-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100 shrink-0">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-850">Exam Notifications</h4>
                    <p className="text-[10px] text-slate-450">Track examinations schedules, venues, and grades</p>
                  </div>
                </div>

                <div className="divide-y divide-slate-100 text-xs font-sans">
                  
                  <div className="flex items-center justify-between py-3">
                    <div className="space-y-0.5 max-w-md">
                      <strong className="text-slate-850 font-bold block">Exam Schedule Alerts</strong>
                      <span className="text-[11px] text-slate-450 block leading-normal">Flag exam locations, date swaps, timeslot overlaps, and study intervals.</span>
                    </div>

                    <button
                      onClick={() => setSettingsToggles(prev => ({ ...prev, examSchedule: !prev.examSchedule }))}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${settingsToggles.examSchedule ? 'bg-indigo-600' : 'bg-slate-200'}`}
                    >
                      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${settingsToggles.examSchedule ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div className="space-y-0.5 max-w-md">
                      <strong className="text-slate-850 font-bold block">Exam Result Notifications</strong>
                      <span className="text-[11px] text-slate-450 block leading-normal">Notify immediately as soon as grades are registered inside department records.</span>
                    </div>

                    <button
                      onClick={() => setSettingsToggles(prev => ({ ...prev, examResults: !prev.examResults }))}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${settingsToggles.examResults ? 'bg-indigo-600' : 'bg-slate-200'}`}
                    >
                      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${settingsToggles.examResults ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </div>

                </div>
              </div>

              {/* Card 3: Academic Performance Notifications */}
              <div className="border border-slate-205 rounded-2xl p-5 shadow-3xs space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-50 pb-2">
                  <div className="h-7 w-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shrink-0">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-850">Academic Performance Notifications</h4>
                    <p className="text-[10px] text-slate-450">Receive alerts related to SGPA, CGPA ledger standings, and milestones</p>
                  </div>
                </div>

                <div className="divide-y divide-slate-100 text-xs font-sans">
                  
                  <div className="flex items-center justify-between py-3">
                    <div className="space-y-0.5 max-w-md">
                      <strong className="text-slate-850 font-bold block">GPA Updates</strong>
                      <span className="text-[11px] text-slate-450 block leading-normal">Send CGPA ledger alerts when grade changes push term expectations into new categories.</span>
                    </div>

                    <button
                      onClick={() => setSettingsToggles(prev => ({ ...prev, gpaUpdates: !prev.gpaUpdates }))}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${settingsToggles.gpaUpdates ? 'bg-indigo-600' : 'bg-slate-200'}`}
                    >
                      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${settingsToggles.gpaUpdates ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div className="space-y-0.5 max-w-md">
                      <strong className="text-slate-850 font-bold block">Goal Progress Updates</strong>
                      <span className="text-[11px] text-slate-450 block leading-normal">Prompt when study intervals match milestones set for elite honors certifications.</span>
                    </div>

                    <button
                      onClick={() => setSettingsToggles(prev => ({ ...prev, goalProgress: !prev.goalProgress }))}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${settingsToggles.goalProgress ? 'bg-indigo-600' : 'bg-slate-200'}`}
                    >
                      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${settingsToggles.goalProgress ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </div>

                </div>
              </div>

              {/* Card 4: System Notifications */}
              <div className="border border-slate-205 rounded-2xl p-5 shadow-3xs space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-50 pb-2">
                  <div className="h-7 w-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-150 shrink-0">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-850">System Notifications</h4>
                    <p className="text-[10px] text-slate-450">Track platform security, updates, and general alerts</p>
                  </div>
                </div>

                <div className="divide-y divide-slate-100 text-xs font-sans">
                  
                  <div className="flex items-center justify-between py-3">
                    <div className="space-y-0.5 max-w-md">
                      <strong className="text-slate-850 font-bold block">Platform Updates</strong>
                      <span className="text-[11px] text-slate-450 block leading-normal">Prompt features notifications for system releases, UI theme options, or core schema additions.</span>
                    </div>

                    <button
                      onClick={() => setSettingsToggles(prev => ({ ...prev, platformUpdates: !prev.platformUpdates }))}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${settingsToggles.platformUpdates ? 'bg-indigo-600' : 'bg-slate-200'}`}
                    >
                      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${settingsToggles.platformUpdates ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div className="space-y-0.5 max-w-md">
                      <strong className="text-slate-850 font-bold block">Account Security Alerts</strong>
                      <span className="text-[11px] text-slate-450 block leading-normal">Critical alerts for login sessions, API token generation logs, and credit changes.</span>
                    </div>

                    <button
                      onClick={() => setSettingsToggles(prev => ({ ...prev, securityAlerts: !prev.securityAlerts }))}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${settingsToggles.securityAlerts ? 'bg-indigo-600' : 'bg-slate-200'}`}
                    >
                      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${settingsToggles.securityAlerts ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </div>

                </div>
              </div>

            </div>

            {/* Right Column (4 spans) - Delivery Channels */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Notification Channels Toggles Card */}
              <div className="bg-slate-50 border border-slate-205 rounded-2xl p-5 space-y-4">
                <div className="border-b border-slate-200 pb-3">
                  <h4 className="text-xs font-black uppercase text-slate-850 tracking-wide flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-indigo-650" /> Notification Channels
                  </h4>
                  <p className="text-[10px] text-slate-450 leading-relaxed mt-0.5">Define your target communication pipelines</p>
                </div>

                <div className="space-y-3.5 text-xs font-sans">
                  
                  {/* Channel: In-App */}
                  <div className="flex items-center justify-between bg-white border border-slate-200 p-3 rounded-xl hover:shadow-2xs transition-all">
                    <div className="flex items-center gap-2.5">
                      <div className="p-1 px-1.5 h-7 w-7 rounded-lg bg-indigo-50 text-indigo-650 flex items-center justify-center">
                        <Bell className="w-4 h-4" />
                      </div>
                      <div>
                        <strong className="text-slate-800 font-extrabold block text-xs">In-App Alerts</strong>
                        <span className="text-[10px] text-slate-400 block font-medium">Render inside the platform</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setSettingsToggles(prev => ({ ...prev, inApp: !prev.inApp }))}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${settingsToggles.inApp ? 'bg-indigo-600' : 'bg-slate-250'}`}
                    >
                      <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${settingsToggles.inApp ? 'translate-x-4' : 'translate-x-0'}`} />
                    </button>
                  </div>

                  {/* Channel: Email */}
                  <div className="flex items-center justify-between bg-white border border-slate-200 p-3 rounded-xl hover:shadow-2xs transition-all">
                    <div className="flex items-center gap-2.5">
                      <div className="p-1 px-1.5 h-7 w-7 rounded-lg bg-indigo-50 text-indigo-650 flex items-center justify-center">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div>
                        <strong className="text-slate-800 font-extrabold block text-xs">Email Delivery</strong>
                        <span className="text-[10px] text-slate-400 block font-medium">To: kavindup52@gmail.com</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setSettingsToggles(prev => ({ ...prev, email: !prev.email }))}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${settingsToggles.email ? 'bg-indigo-600' : 'bg-slate-250'}`}
                    >
                      <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${settingsToggles.email ? 'translate-x-4' : 'translate-x-0'}`} />
                    </button>
                  </div>

                  {/* Channel: SMS - Disabled Placeholder */}
                  <div className="flex items-center justify-between bg-slate-100 border border-slate-200 p-3 rounded-xl opacity-65">
                    <div className="flex items-center gap-2.5">
                      <div className="p-1 px-1.5 h-7 w-7 rounded-lg bg-slate-150 text-slate-400 flex items-center justify-center">
                        <Phone className="w-4 h-4" />
                      </div>
                      <div>
                        <strong className="text-slate-400 font-extrabold block text-xs flex items-center gap-1.5">
                          SMS Toggles <span className="bg-slate-200 text-slate-500 font-mono text-[8px] px-1 py-0.2 rounded uppercase tracking-wider font-extrabold">Disabled Placeholder</span>
                        </strong>
                        <span className="text-[10px] text-slate-400 block font-medium">Premium cellular link</span>
                      </div>
                    </div>

                    <button
                      disabled
                      className="relative inline-flex h-5 w-9 shrink-0 cursor-not-allowed rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none bg-slate-200"
                    >
                      <span className="pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out translate-x-0" />
                    </button>
                  </div>

                </div>

                <div className="bg-indigo-50 border border-indigo-100 p-3.5 rounded-xl font-sans text-[11px] leading-relaxed text-indigo-750">
                  <div className="flex gap-2 items-start">
                    <Info className="w-4 h-4 shrink-0 text-indigo-600 mt-0.5" />
                    <div>
                      <strong className="font-extrabold block text-indigo-900 mb-0.5 font-sans">SMS Ledger Constraint</strong>
                      Celullar pipelines require carrier integration. SMS capabilities are currently set as inactive placeholder parameters during developer sandbox review.
                    </div>
                  </div>
                </div>

              </div>

              {/* Quick Actions Actions requested inside settings screen as cards */}
              <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-3.5 shadow-3xs">
                <span className="text-[10px] font-black uppercase font-mono tracking-wider text-slate-400 block">Immediate Control Commands</span>
                
                <div className="grid grid-cols-1 gap-2 text-xs font-sans">
                  
                  <button
                    onClick={handleMarkAllLocalRead}
                    className="w-full bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold p-2.5 rounded-xl border border-slate-200 transition-all flex items-center justify-between"
                  >
                    <span>Mark All Completed Event Alerts</span>
                    <CheckCheck className="w-4 h-4 text-indigo-600" />
                  </button>

                  <button
                    onClick={handleClearLocalAll}
                    className="w-full bg-slate-50 hover:bg-rose-50 text-slate-550 hover:text-rose-700 font-bold p-2.5 rounded-xl border border-slate-200 hover:border-rose-150 transition-all flex items-center justify-between"
                  >
                    <span>Clear Active Alerts Registry</span>
                    <Trash2 className="w-4 h-4 text-slate-400" />
                  </button>

                  <button
                    onClick={() => setActiveTab('assignments')}
                    className="w-full bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold p-2.5 rounded-xl border border-slate-200 transition-all flex items-center justify-between"
                  >
                    <span>View University Assignments</span>
                    <FileText className="w-4 h-4 text-orange-500" />
                  </button>

                  <button
                    onClick={() => setActiveTab('exams')}
                    className="w-full bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold p-2.5 rounded-xl border border-slate-200 transition-all flex items-center justify-between"
                  >
                    <span>View University Exams</span>
                    <Award className="w-4 h-4 text-purple-500" />
                  </button>

                  <button
                    onClick={() => setActiveTab('analytics')}
                    className="w-full bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold p-2.5 rounded-xl border border-slate-200 transition-all flex items-center justify-between"
                  >
                    <span>Analyze GPA Standings</span>
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                  </button>

                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
