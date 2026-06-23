import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Trash2, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  ChevronRight,
  Filter,
  PlusCircle,
  FolderMinus,
  Maximize2,
  Search,
  List,
  Kanban,
  Calendar as CalendarIcon,
  X,
  Sparkles,
  ArrowRight,
  ChevronLeft,
  Calendar,
  AlertTriangle,
  Flame,
  CheckCircle,
  Download,
  Upload,
  User,
  Activity,
  Briefcase,
  FileSpreadsheet,
  Layers,
  Award,
  CircleCheck,
  TrendingUp,
  BarChart2,
  PieChart,
  Grid,
  Info,
  CalendarCheck,
  Zap,
  Edit3,
  Paperclip
} from 'lucide-react';
import { Assignment, Subject, Semester } from '../types';

interface AssignmentsViewProps {
  assignments: Assignment[];
  subjects: Subject[];
  semesters: Semester[];
  onAddAssignment: (
    title: string, 
    subjectId: string, 
    dueDate: string, 
    priority: 'low' | 'medium' | 'high' | 'critical', 
    isGroup: boolean
  ) => void;
  onUpdateAssignmentStatus: (
    id: string, 
    status: 'pending' | 'in_progress' | 'completed' | 'overdue', 
    progress: number
  ) => void;
  onDeleteAssignment: (id: string) => void;
  setAssignments: React.Dispatch<React.SetStateAction<Assignment[]>>;
  setActiveTab: (tab: string) => void;
}

export const AssignmentsView: React.FC<AssignmentsViewProps> = ({
  assignments,
  subjects,
  semesters,
  onAddAssignment,
  onUpdateAssignmentStatus,
  onDeleteAssignment,
  setAssignments,
  setActiveTab
}) => {
  // Navigation & view presets
  const [layoutMode, setLayoutMode] = useState<'kanban' | 'list' | 'calendar'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [semesterFilter, setSemesterFilter] = useState<string>('all');
  const [subjectFilter, setSubjectFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'deadline_asc' | 'deadline_desc' | 'priority_desc' | 'progress_desc'>('deadline_asc');

  // Interactive Selected entities
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string>('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  // Form States
  const [newTitle, setNewTitle] = useState('');
  const [newSubjectId, setNewSubjectId] = useState('');
  const [newSemesterId, setNewSemesterId] = useState('');

  // Custom interactive transient state feedback (toast alerts)
  const [successToastMessage, setSuccessToastMessage] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setSuccessToastMessage(msg);
    setTimeout(() => setSuccessToastMessage(null), 3000);
  };
  const [newDescription, setNewDescription] = useState('');
  const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  const [newDueDate, setNewDueDate] = useState('');
  const [newMarksAllocated, setNewMarksAllocated] = useState(100);
  const [newStatus, setNewStatus] = useState<'pending' | 'in_progress' | 'completed' | 'overdue'>('pending');
  const [newIsGroup, setNewIsGroup] = useState(false);
  const [newSubmissionType, setNewSubmissionType] = useState('online_upload');

  // Edit Assignment Form state (inline or drawer)
  const [isEditing, setIsEditing] = useState(false);
  const [editingTitle, setEditingTitle] = useState('');
  const [editingPriority, setEditingPriority] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  const [editingDueDate, setEditingDueDate] = useState('');
  const [editingProgress, setEditingProgress] = useState(0);
  const [editingScore, setEditingScore] = useState<number | undefined>(undefined);
  const [editingFeedback, setEditingFeedback] = useState('');
  const [editingDescription, setEditingDescription] = useState('');

  // Bulk operation states
  const [selectedAsmIds, setSelectedAsmIds] = useState<string[]>([]);

  // Mini-Calendar Date Tracker (default to June 2026 based on metadata)
  const [currentCalendarYear, setCurrentCalendarYear] = useState(2026);
  const [currentCalendarMonth, setCurrentCalendarMonth] = useState(5); // June is index 5

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Helper date parsing (returns days remaining or negative for overdue)
  const calculateDaysRemaining = (dueDateStr: string): { days: number; text: string; isOverdue: boolean } => {
    const today = new Date("2026-06-22T09:42:30-07:00");
    const due = new Date(dueDateStr + "T00:00:00");
    
    // reset time parts
    today.setHours(0,0,0,0);
    due.setHours(0,0,0,0);
    
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { days: diffDays, text: `${Math.abs(diffDays)} Days Overdue`, isOverdue: true };
    } else if (diffDays === 0) {
      return { days: 0, text: "Due Today", isOverdue: false };
    } else if (diffDays === 1) {
      return { days: 1, text: "1 Day Left", isOverdue: false };
    } else {
      return { days: diffDays, text: `${diffDays} Days Left`, isOverdue: false };
    }
  };

  // Helper: Get semester id of an assignment (matches its subject's semester id if not directly defined)
  const getAsmSemesterId = (asm: Assignment): string => {
    if (asm.semesterId) return asm.semesterId;
    const sub = subjects.find(s => s.id === asm.subjectId);
    return sub ? sub.semesterId : 'sem-5'; // default fallback
  };

  // Helper: map priority scores
  const getPriorityWeight = (priority: string) => {
    switch (priority) {
      case 'critical': return 4;
      case 'high': return 3;
      case 'medium': return 2;
      case 'low': return 1;
      default: return 0;
    }
  };

  // Filter and sort core assignments list
  const filteredAssignments = assignments.filter(asm => {
    // 1. Search Query filter
    const matchesSearch = searchQuery === '' || 
      asm.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asm.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (asm.description && asm.description.toLowerCase().includes(searchQuery.toLowerCase()));

    // 2. Semester Filter
    const asmSemId = getAsmSemesterId(asm);
    const matchesSemester = semesterFilter === 'all' || asmSemId === semesterFilter;

    // 3. Subject Filter
    const matchesSubject = subjectFilter === 'all' || asm.subjectId === subjectFilter;

    // 4. Status Filter
    const matchesStatus = statusFilter === 'all' || asm.status === statusFilter;

    return matchesSearch && matchesSemester && matchesSubject && matchesStatus;
  }).sort((a, b) => {
    if (sortBy === 'deadline_asc') {
      return a.dueDate.localeCompare(b.dueDate);
    } else if (sortBy === 'deadline_desc') {
      return b.dueDate.localeCompare(a.dueDate);
    } else if (sortBy === 'priority_desc') {
      return getPriorityWeight(b.priority) - getPriorityWeight(a.priority);
    } else if (sortBy === 'progress_desc') {
      return b.progress - a.progress;
    }
    return 0;
  });

  // KPI calculations based on CURRENT filtering
  const totalCount = filteredAssignments.length;
  const pendingCount = filteredAssignments.filter(a => a.status === 'pending').length;
  const inProgressCount = filteredAssignments.filter(a => a.status === 'in_progress').length;
  const completedCount = filteredAssignments.filter(a => a.status === 'completed').length;
  
  // Dynamic Calculation of Overdue states
  const overdueCount = filteredAssignments.filter(a => {
    if (a.status === 'completed') return false;
    const { isOverdue } = calculateDaysRemaining(a.dueDate);
    return isOverdue || a.status === 'overdue';
  }).length;

  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  
  // Upcoming This Week (within 7 days and not completed)
  const upcomingThisWeekCount = filteredAssignments.filter(a => {
    if (a.status === 'completed') return false;
    const { days, isOverdue } = calculateDaysRemaining(a.dueDate);
    return !isOverdue && days >= 0 && days <= 7;
  }).length;

  // Selected Assignment details
  const activeAssignment = filteredAssignments.find(a => a.id === selectedAssignmentId) || filteredAssignments[0];

  // Quick Action: Export Assignment List
  const handleExportDataEx = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(assignments, null, 2));
    const dlLink = document.createElement('a');
    dlLink.setAttribute("href", dataStr);
    dlLink.setAttribute("download", `assignments_export_${Date.now()}.json`);
    document.body.appendChild(dlLink);
    dlLink.click();
    dlLink.remove();
  };

  // Quick Action: Generate Progress Report Summary
  const handleOpenReport = () => {
    setShowReportModal(true);
  };

  // handle delete single task
  const handleDeleteSelf = (id: string) => {
    if (confirm("Are you sure you want to drop this assignment?")) {
      onDeleteAssignment(id);
      setSelectedAsmIds(prev => prev.filter(x => x !== id));
      if (selectedAssignmentId === id) {
        setSelectedAssignmentId('');
      }
    }
  };

  // bulk actions dispatchers
  const handleToggleSelectAsm = (id: string) => {
    setSelectedAsmIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSelectAllAsms = () => {
    if (selectedAsmIds.length === filteredAssignments.length) {
      setSelectedAsmIds([]);
    } else {
      setSelectedAsmIds(filteredAssignments.map(a => a.id));
    }
  };

  const handleBulkComplete = () => {
    if (selectedAsmIds.length === 0) return;
    setAssignments(prev => prev.map(asm => {
      if (selectedAsmIds.includes(asm.id)) {
        return { ...asm, status: 'completed', progress: 100 };
      }
      return asm;
    }));
    setSelectedAsmIds([]);
  };

  const handleBulkDelete = () => {
    if (selectedAsmIds.length === 0) return;
    if (confirm(`Do you want to delete ${selectedAsmIds.length} selected assignments?`)) {
      setAssignments(prev => prev.filter(asm => !selectedAsmIds.includes(asm.id)));
      setSelectedAsmIds([]);
    }
  };

  // Single Quick Completer
  const handleMarkComplete = (id: string) => {
    onUpdateAssignmentStatus(id, 'completed', 100);
    // If we're updating current active editing
    if (activeAssignment && activeAssignment.id === id) {
      setEditingProgress(100);
    }
  };

  // Show detailed editing controls for drawer
  const handleEnableEdit = (asm: Assignment) => {
    setEditingTitle(asm.title);
    setEditingPriority(asm.priority);
    setEditingDueDate(asm.dueDate);
    setEditingProgress(asm.progress);
    setEditingScore(asm.score);
    setEditingFeedback(asm.feedback || '');
    setEditingDescription(asm.description || '');
    setIsEditing(true);
  };

  const handleSaveDrawerEdits = () => {
    if (!activeAssignment) return;
    
    // Determine status based on progress
    let targetStatus = activeAssignment.status;
    if (editingProgress === 100) {
      targetStatus = 'completed';
    } else if (editingProgress > 0) {
      targetStatus = 'in_progress';
    } else {
      targetStatus = 'pending';
    }

    // Double check overdue
    if (targetStatus !== 'completed') {
      const { isOverdue } = calculateDaysRemaining(editingDueDate);
      if (isOverdue) targetStatus = 'overdue';
    }

    // Translate score to letter grade
    let resolvedGrade = undefined;
    if (editingScore !== undefined) {
      const val = editingScore;
      if (val >= 93) resolvedGrade = 'A';
      else if (val >= 90) resolvedGrade = 'A-';
      else if (val >= 87) resolvedGrade = 'B+';
      else if (val >= 83) resolvedGrade = 'B';
      else if (val >= 80) resolvedGrade = 'B-';
      else if (val >= 70) resolvedGrade = 'C';
      else resolvedGrade = 'F';
    }

    setAssignments(prev => prev.map(asm => {
      if (asm.id === activeAssignment.id) {
        return {
          ...asm,
          title: editingTitle,
          priority: editingPriority,
          dueDate: editingDueDate,
          progress: editingProgress,
          status: targetStatus,
          score: editingScore,
          grade: resolvedGrade,
          feedback: editingFeedback,
          description: editingDescription
        };
      }
      return asm;
    }));

    setIsEditing(false);
  };

  // Handle addition submit inside popup modal
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newSubjectId) return;

    const chosenSubject = subjects.find(s => s.id === newSubjectId);
    const subName = chosenSubject ? chosenSubject.name : "Custom Course";

    // Build complete customized assignment record
    const newlyCreated: Assignment = {
      id: `asm-${Date.now()}`,
      title: newTitle,
      subjectId: newSubjectId,
      subjectName: subName,
      dueDate: newDueDate || "2026-06-30",
      progress: newStatus === 'completed' ? 100 : newStatus === 'in_progress' ? 45 : 0,
      status: newStatus,
      priority: newPriority,
      isGroup: newIsGroup,
      submissionType: newSubmissionType,
      marksAllocated: newMarksAllocated,
      description: newDescription || "Syllabus standard assignment track task.",
      semesterId: newSemesterId || getAsmSemesterId({ subjectId: newSubjectId } as any)
    };

    setAssignments(prev => [newlyCreated, ...prev]);
    setShowCreateModal(false);

    // reset fields
    setNewTitle('');
    setNewSubjectId('');
    setNewSemesterId('');
    setNewDescription('');
    setNewPriority('medium');
    setNewDueDate('');
    setNewStatus('pending');
    setNewIsGroup(false);
  };

  // Open Create Modal Initializer
  const handleOpenCreateModal = () => {
    setNewTitle('');
    setNewSubjectId(subjects[0]?.id || '');
    setNewSemesterId(semesters[0]?.id || 'sem-5');
    setNewDescription('Academic deadline task checking program specifications.');
    setNewPriority('medium');
    
    // Default system date (3 days out)
    const preset = new Date("2026-06-25");
    setNewDueDate(preset.toISOString().split('T')[0]);
    setNewMarksAllocated(100);
    setNewStatus('in_progress');
    setNewIsGroup(false);
    setNewSubmissionType('online_upload');

    setShowCreateModal(true);
  };

  // Monthly Calendar Generator matrices
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay(); // 0 is Sunday, 1 is Monday...
  };

  const totalDays = getDaysInMonth(currentCalendarYear, currentCalendarMonth);
  const startingDayOfWeek = getFirstDayOfMonth(currentCalendarYear, currentCalendarMonth);

  // Array representing days of grid
  const calendarCells: (number | null)[] = [];
  // Sunday offset pad
  for (let s = 0; s < startingDayOfWeek; s++) {
    calendarCells.push(null);
  }
  for (let d = 1; d <= totalDays; d++) {
    calendarCells.push(d);
  }

  // Back / Next months
  const handleCalendarPrev = () => {
    if (currentCalendarMonth === 0) {
      setCurrentCalendarMonth(11);
      setCurrentCalendarYear(prev => prev - 1);
    } else {
      setCurrentCalendarMonth(prev => prev - 1);
    }
  };

  const handleCalendarNext = () => {
    if (currentCalendarMonth === 11) {
      setCurrentCalendarMonth(0);
      setCurrentCalendarYear(prev => prev + 1);
    } else {
      setCurrentCalendarMonth(prev => prev + 1);
    }
  };

  // Filter assignments exactly on a specified day string format YYYY-MM-DD
  const getAssignmentsForDay = (dayNum: number): Assignment[] => {
    const formattedMonth = String(currentCalendarMonth + 1).padStart(2, '0');
    const formattedDay = String(dayNum).padStart(2, '0');
    const dateStr = `${currentCalendarYear}-${formattedMonth}-${formattedDay}`;
    return assignments.filter(a => a.dueDate === dateStr);
  };

  // Workload Heatmap - calculates assignments due on each weekday (Monday to Sunday)
  // Let's count them dynamically for active semester
  const weekdaysKeys = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const workloadCounts = [0, 0, 0, 0, 0, 0, 0]; // counts

  assignments.forEach(a => {
    if (a.status === 'completed') return;
    const d = new Date(a.dueDate + "T00:00:00");
    let dayIdx = d.getDay(); // 0 is Sun, 1 is Mon etc.
    // translate to Monday indexed
    dayIdx = dayIdx === 0 ? 6 : dayIdx - 1;
    if (dayIdx >= 0 && dayIdx < 7) {
      workloadCounts[dayIdx]++;
    }
  });

  // Analytics helper charts: Rate by subject
  const subjectsCompletionMap = subjects.map(sub => {
    const subAsms = assignments.filter(a => a.subjectId === sub.id);
    const subCompleted = subAsms.filter(a => a.status === 'completed').length;
    const rate = subAsms.length > 0 ? Math.round((subCompleted / subAsms.length) * 100) : 0;
    return {
      code: sub.code,
      name: sub.name,
      total: subAsms.length,
      rate: rate
    };
  });

  // Distribution by priority
  const criticalC = assignments.filter(a => a.priority === 'critical').length;
  const highC = assignments.filter(a => a.priority === 'high').length;
  const mediumC = assignments.filter(a => a.priority === 'medium').length;
  const lowC = assignments.filter(a => a.priority === 'low').length;
  const totalPriCount = (criticalC + highC + mediumC + lowC) || 1;

  // Render priority color dots/meters
  const priorityDistribution = [
    { label: "Critical", count: criticalC, color: "bg-red-500", text: "text-red-600", percent: Math.round((criticalC/totalPriCount)*100) },
    { label: "High", count: highC, color: "bg-amber-500", text: "text-amber-500", percent: Math.round((highC/totalPriCount)*100) },
    { label: "Medium", count: mediumC, color: "bg-indigo-500", text: "text-indigo-600", percent: Math.round((mediumC/totalPriCount)*100) },
    { label: "Low", count: lowC, color: "bg-slate-400", text: "text-slate-500", percent: Math.round((lowC/totalPriCount)*100) },
  ];

  return (
    <div id="assignment-worksuite" className="space-y-6 text-slate-800 font-sans animate-fade-in">
      
      {/* 1. Page Hero Banner Block */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm shadow-slate-100/30 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 font-bold text-[10px] uppercase tracking-wider py-1 px-3 rounded-full border border-blue-150">
            <Sparkles className="w-3.5 h-3.5 text-blue-500 fill-blue-50" /> Student Success Platform
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Assignment Tracking</h2>
          <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
            Track assignments, monitor deadlines, manage academic workload, and stay on top of university coursework.
          </p>
        </div>

        {/* Action Triggers */}
        <div className="flex flex-wrap items-center gap-3">
          <button 
            id="quick-act-calendar"
            onClick={() => setLayoutMode('calendar')}
            className="bg-slate-50 hover:bg-slate-100/80 text-slate-700 font-bold text-xs py-2.5 px-4 rounded-xl border border-slate-200 shadow-2xs cursor-pointer transition-all active:scale-95 flex items-center gap-1.5"
          >
            <CalendarIcon className="w-4 h-4 text-slate-500" /> View Calendar
          </button>
          
          <button
            id="op-create-assignment-modal"
            onClick={handleOpenCreateModal}
            className="bg-primary hover:bg-primary/95 text-white font-extrabold text-xs py-2.5 px-4.5 rounded-xl shadow-md shadow-primary/10 flex items-center gap-1.5 transform active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Create Assignment
          </button>
        </div>
      </div>

      {/* 2. Dynamic SaaS Summary Cards Panel */}
      <div id="summary-cards-row" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4.5 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between">
          <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Total Assignments</span>
          <div className="mt-2.5 flex items-baseline gap-1.5">
            <span className="text-2xl font-black font-mono text-slate-900">{totalCount}</span>
            <span className="text-[10px] text-slate-400 font-medium">registered</span>
          </div>
          <div className="w-full bg-slate-100 h-1 rounded-full mt-3 overflow-hidden">
            <div className="bg-indigo-500 h-1 rounded-full w-full" />
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4.5 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between">
          <span className="block text-[9px] font-bold text-slate-400 tracking-widest uppercase leading-none">Pending Tasks</span>
          <div className="mt-2.5 flex items-baseline gap-1.5">
            <span className="text-2xl font-black font-mono text-slate-800">{pendingCount}</span>
            <span className="text-[10px] text-amber-500 font-bold">in queue</span>
          </div>
          <div className="w-full bg-slate-100 h-1 rounded-full mt-3 overflow-hidden">
            <div className="bg-amber-400 h-1 rounded-full" style={{ width: `${totalCount > 0 ? (pendingCount/totalCount)*100 : 0}%` }} />
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4.5 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between">
          <span className="block text-[9px] font-bold text-slate-400 tracking-widest uppercase leading-none">Completed Tasks</span>
          <div className="mt-2.5 flex items-baseline gap-1.5">
            <span className="text-2xl font-black font-mono text-slate-900">{completedCount}</span>
            <span className="text-[9px] text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-100">Done</span>
          </div>
          <div className="w-full bg-slate-100 h-1 rounded-full mt-3 overflow-hidden">
            <div className="bg-emerald-500 h-1 rounded-full" style={{ width: `${totalCount > 0 ? (completedCount/totalCount)*100 : 0}%` }} />
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4.5 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between">
          <span className="block text-[9px] font-bold text-rose-500 tracking-widest uppercase leading-none">Overdue Warning</span>
          <div className="mt-2.5 flex items-baseline gap-1.5">
            <span className={`text-2xl font-black font-mono ${overdueCount > 0 ? 'text-rose-600 animate-pulse' : 'text-slate-400'}`}>{overdueCount}</span>
            <span className="text-[10px] text-rose-400 font-semibold">{overdueCount > 0 ? "needs action" : "all safe"}</span>
          </div>
          <div className="w-full bg-slate-100 h-1 rounded-full mt-3 overflow-hidden">
            <div className="bg-rose-500 h-1 rounded-full" style={{ width: `${totalCount > 0 ? (overdueCount/totalCount)*100 : 0}%` }} />
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4.5 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between">
          <span className="block text-[9px] font-bold text-slate-400 tracking-widest uppercase leading-none">Completion Rate</span>
          <div className="mt-2.5 flex items-baseline gap-1.5">
            <span className="text-2xl font-black font-mono text-slate-900">{completionRate}%</span>
            <span className="text-[10px] text-blue-500 font-bold">success</span>
          </div>
          <div className="w-full bg-slate-100 h-1 rounded-full mt-3 overflow-hidden">
            <div className="bg-blue-600 h-1 rounded-full" style={{ width: `${completionRate}%` }} />
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4.5 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between">
          <span className="block text-[9px] font-bold text-slate-400 tracking-widest uppercase leading-none">Due This Week</span>
          <div className="mt-2.5 flex items-baseline gap-1.5">
            <span className={`text-2xl font-black font-mono ${upcomingThisWeekCount > 0 ? 'text-indigo-600' : 'text-slate-500'}`}>{upcomingThisWeekCount}</span>
            <span className="text-[10px] text-slate-400 font-medium">planned</span>
          </div>
          <div className="w-full bg-blue-50/50 border border-blue-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${totalCount > 0 ? (upcomingThisWeekCount/totalCount)*100 : 0}%` }} />
          </div>
        </div>

      </div>

      {/* 3. Advanced Filtering Control Bar */}
      <div className="bg-white border border-slate-200/85 rounded-2xl p-4 flex flex-col xl:flex-row xl:items-center justify-between gap-4 shadow-sm">
        
        {/* Left Filters Set */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Search */}
          <div className="relative max-w-xs w-full min-w-[200px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search assignment description..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-1.8 text-xs outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all text-slate-700 font-medium"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Semester Filter */}
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">SEMESTER:</span>
            <select
              value={semesterFilter}
              onChange={(e) => setSemesterFilter(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-700 outline-none cursor-pointer pr-1"
            >
              <option value="all">All Semesters</option>
              {semesters.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          {/* Subject Filter */}
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">SUBJECT:</span>
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-700 outline-none cursor-pointer pr-1 max-w-[150px]"
            >
              <option value="all font-semibold">All Courses</option>
              {subjects.map(sub => (
                <option key={sub.id} value={sub.id}>{sub.code} - {sub.name}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">STATUS:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-700 outline-none cursor-pointer pr-1"
            >
              <option value="all">Any Status</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>

          {/* Sort Menu */}
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">SORT BY:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-xs font-bold text-slate-700 outline-none cursor-pointer pr-1"
            >
              <option value="deadline_asc">Nearest Deadlines</option>
              <option value="deadline_desc">Furthest Deadlines</option>
              <option value="priority_desc">Highest Priority</option>
              <option value="progress_desc">Highest Progress</option>
            </select>
          </div>

        </div>

        {/* Right Layout Switches */}
        <div className="flex items-center gap-3 self-end xl:self-auto">
          
          <div className="bg-slate-100 p-0.8 rounded-xl flex items-center border border-slate-200">
            
            <button
              onClick={() => setLayoutMode('kanban')}
              className={`py-1.5 px-3 rounded-lg flex items-center gap-1 text-[11px] font-bold transition-all ${
                layoutMode === 'kanban' 
                  ? 'bg-white text-slate-800 shadow-xs border border-slate-200/50' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Board</span>
            </button>

            <button
              onClick={() => setLayoutMode('list')}
              className={`py-1.5 px-3 rounded-lg flex items-center gap-1 text-[11px] font-bold transition-all ${
                layoutMode === 'list' 
                  ? 'bg-white text-slate-800 shadow-xs border border-slate-200/50' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">List</span>
            </button>

            <button
              onClick={() => setLayoutMode('calendar')}
              className={`py-1.5 px-3 rounded-lg flex items-center gap-1 text-[11px] font-bold transition-all ${
                layoutMode === 'calendar' 
                  ? 'bg-white text-slate-800 shadow-xs border border-slate-200/50' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Calendar</span>
            </button>

          </div>

          {/* Quick Actions Triggers */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleExportDataEx}
              className="bg-white hover:bg-slate-50 text-slate-600 font-bold text-[11px] border border-slate-200 p-2.2 rounded-lg"
              title="Download backup list JSON"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={handleOpenReport}
              className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-extrabold text-[11px] p-2 py-2.2 px-3 rounded-lg flex items-center gap-1.5 transition-colors border border-indigo-100"
              title="Generate summary and progress report metrics"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Report</span>
            </button>
          </div>

        </div>

      </div>

      {/* 4. Bulk Commands Console Bar */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <Layers className="w-4 h-4 text-slate-500" />
          <div>
            <p className="text-xs font-extrabold text-slate-700">Workstation Automation</p>
            <p className="text-[10px] text-slate-400 font-semibold">
              {selectedAsmIds.length > 0 
                ? `${selectedAsmIds.length} assignments selected for batch commands.` 
                : "Select lines using checkboxes below to enable multi-task actions."}
            </p>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          {selectedAsmIds.length > 0 && (
            <>
              <button 
                onClick={handleBulkComplete}
                className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs py-1.5 px-3 rounded-lg border border-emerald-200 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <CircleCheck className="w-3.5 h-3.5" /> Mark Complete
              </button>
              <button 
                onClick={handleBulkDelete}
                className="bg-rose-50 hover:bg-rose-150 text-rose-700 font-bold text-xs py-1.5 px-3 rounded-lg border border-rose-200 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete Selected ({selectedAsmIds.length})
              </button>
              <button 
                onClick={() => setSelectedAsmIds([])}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                Deselect
              </button>
            </>
          )}

          <button
            onClick={() => {
              // Inject synthetic academic items for simulation
              const designLab: Assignment = {
                id: `asm-mock-a-${Date.now()}`,
                title: "Human Computer Interface User Flow Diagram",
                subjectId: "sub-501",
                subjectName: "Database Systems", // fallback connection
                dueDate: "2026-07-15",
                progress: 60,
                status: "in_progress",
                priority: "critical",
                isGroup: true,
                marksAllocated: 50,
                description: "Map primary interactive application pathways for the Student Success Platform user interface.",
                submissionType: "online_upload"
              };
              const networkLab: Assignment = {
                id: `asm-mock-b-${Date.now()}`,
                title: "Socket Connection Stability Research Lab 2",
                subjectId: "sub-503",
                subjectName: "Computer Networks",
                dueDate: "2026-06-27",
                progress: 0,
                status: "pending",
                priority: "high",
                isGroup: false,
                marksAllocated: 100,
                description: "Develop a basic C socket program that analyzes TCP/IP packet transmission ratios under packet failure simulation parameters.",
                submissionType: "github"
              };
              setAssignments(prev => [designLab, networkLab, ...prev]);
              triggerToast("Imported 2 professional coursework assignments with criteria details!");
            }}
            className="bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs py-1.5 px-3 rounded-lg border border-slate-200 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Upload className="w-3.5 h-3.5 text-blue-500" /> Import Standards
          </button>
        </div>
      </div>

      {totalCount === 0 ? (
        
        /* 5. EMPTY STATE */
        <div className="bg-white border border-slate-200 p-12 text-center rounded-3xl max-w-xl mx-auto space-y-6 shadow-xs my-8">
          <div className="h-20 w-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto border border-indigo-100">
            <FolderMinus className="w-10 h-10" />
          </div>
          <div>
            <h4 className="text-base font-black text-slate-900">No assignments found. Create your first assignment and start tracking your academic progress.</h4>
            <p className="text-xs text-slate-400 mt-2 max-w-sm mx-auto leading-relaxed">
              Create homework tracker tags, link them directly with computer science modules, coordinate groups, and record your submissions!
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <button
              onClick={handleOpenCreateModal}
              className="bg-primary hover:bg-primary/95 text-white font-extrabold text-xs py-2 px-4 rounded-xl shadow-xs transition-all flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Assignment
            </button>
            <button
              onClick={() => {
                // reset filters
                setSemesterFilter('all');
                setSubjectFilter('all');
                setStatusFilter('all');
                setSearchQuery('');
              }}
              className="bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold border border-slate-200 text-xs py-2 px-4 rounded-xl transition-all"
            >
              Clear Search Filters
            </button>
          </div>
        </div>

      ) : (
        
        /* Main Workspace Double Pane: Left Workspace (Kanban/List/Calendar) vs Right Metrics Sidebar & Detailed Drawer */
        <div id="main-workflow-split" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Main Workspace Frame (8 units col span) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* L1. KANBAN BOARD LAYOUT */}
            {layoutMode === 'kanban' && (
              <div id="kanban-layout" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                
                {/* Columns representing states: pending, in_progress, completed, overdue */}
                {[
                  { id: 'pending', title: 'Pending', bg: 'bg-slate-50/70', border: 'border-slate-300/60', text: 'text-slate-500', marker: 'bg-slate-400' },
                  { id: 'in_progress', title: 'In Progress', bg: 'bg-blue-50/[0.15]', border: 'border-blue-200/80', text: 'text-blue-700', marker: 'bg-blue-500' },
                  { id: 'completed', title: 'Completed', bg: 'bg-emerald-50/[0.12]', border: 'border-emerald-200/80', text: 'text-emerald-700', marker: 'bg-emerald-500' },
                  { id: 'overdue', title: 'Overdue', bg: 'bg-rose-50/[0.15]', border: 'border-rose-250/70', text: 'text-rose-700', marker: 'bg-rose-500' }
                ].map((col) => {
                  const colAsms = filteredAssignments.filter(a => {
                    // Double check if live dates show overdue and make it fall into Overdue column dynamically unless completed
                    if (a.status === 'completed') return col.id === 'completed';
                    const { isOverdue } = calculateDaysRemaining(a.dueDate);
                    if (isOverdue) return col.id === 'overdue';
                    return a.status === col.id;
                  });

                  return (
                    <div 
                      key={col.id}
                      className={`${col.bg} border ${col.border} rounded-2xl p-3.5 flex flex-col min-h-[460px]`}
                    >
                      {/* Column Header */}
                      <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200/50">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${col.marker}`} />
                          <h4 className={`text-[11px] font-black uppercase text-slate-800`}>
                            {col.title}
                          </h4>
                        </div>
                        <span className="text-[9px] font-bold font-mono text-slate-400 bg-slate-100 px-1.5 py-0.2 rounded">
                          {colAsms.length}
                        </span>
                      </div>

                      {/* Stacked Cards list */}
                      <div className="flex-1 space-y-3 overflow-y-auto max-h-[60vh] md:max-h-none">
                        {colAsms.map(asm => {
                          const isFocused = asm.id === selectedAssignmentId;
                          const { text: remainingText, isOverdue } = calculateDaysRemaining(asm.dueDate);
                          
                          return (
                            <div
                              key={asm.id}
                              onClick={() => setSelectedAssignmentId(asm.id)}
                              className={`bg-white border rounded-xl p-3.5 shadow-2xs hover:shadow-xs transition-all relative group cursor-pointer ${
                                isFocused 
                                  ? 'ring-2 ring-indigo-500/10 border-indigo-500' 
                                  : 'border-slate-200 hover:border-slate-300'
                              }`}
                            >
                              {/* Selection overlay indicator */}
                              <div className="absolute top-3 right-3 flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                                <input 
                                  type="checkbox"
                                  checked={selectedAsmIds.includes(asm.id)}
                                  onChange={() => handleToggleSelectAsm(asm.id)}
                                  className="rounded text-indigo-600 focus:ring-indigo-300 h-3 w-3 cursor-pointer"
                                />
                              </div>

                              {/* Target Subject banner code */}
                              <span 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveTab('subjects');
                                }}
                                className="text-[9px] font-bold text-slate-400 block mb-1 font-mono uppercase tracking-wider hover:text-indigo-600 hover:underline cursor-pointer"
                                title="Navigate to Courses"
                              >
                                {asm.subjectName}
                              </span>

                              {/* Title description */}
                              <h5 className="text-[12px] font-black text-slate-800 tracking-tight leading-snug line-clamp-2">
                                {asm.title}
                              </h5>

                              {/* Priority & Group metrics */}
                              <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                                <span className={`text-[8px] font-mono font-bold uppercase tracking-widest px-1 rounded ${
                                  asm.priority === 'critical' ? 'bg-red-50 text-red-600 border border-red-100' :
                                  asm.priority === 'high' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                                  asm.priority === 'medium' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' :
                                  'bg-slate-100 text-slate-500'
                                }`}>
                                  {asm.priority}
                                </span>

                                {asm.isGroup && (
                                  <span className="text-[8px] font-bold text-purple-700 bg-purple-50 px-1 rounded uppercase tracking-wider font-mono">
                                    Group Team
                                  </span>
                                )}
                              </div>

                              {/* Interactive range display slider */}
                              <div className="mt-3.5 space-y-1">
                                <div className="flex justify-between items-center text-[9px] text-slate-400 font-mono">
                                  <span>Task Progress:</span>
                                  <span className="text-slate-800 font-bold">{asm.progress}%</span>
                                </div>
                                <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                                  <div 
                                    className="bg-primary h-1 rounded-full transition-all"
                                    style={{ width: `${asm.progress}%` }}
                                  />
                                </div>
                              </div>

                              {/* Bottom date and actions triggers */}
                              <div className="mt-4 pt-2 border-t border-slate-50 flex items-center justify-between text-[10px]">
                                <div className="flex items-center gap-1 text-slate-450 font-mono font-medium leading-none">
                                  <Clock className="w-3 h-3 text-slate-400" />
                                  <span className={isOverdue && asm.status !== 'completed' ? 'text-rose-500 font-bold' : ''}>
                                    {remainingText}
                                  </span>
                                </div>

                                <div className="flex items-center gap-0.5 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                                  {asm.status !== 'completed' && (
                                    <button
                                      onClick={() => handleMarkComplete(asm.id)}
                                      className="p-1 text-emerald-500 hover:bg-emerald-50 rounded"
                                      title="Mark Complete"
                                    >
                                      <CheckCircle2 className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                  <button
                                    onClick={() => handleDeleteSelf(asm.id)}
                                    className="p-1 text-slate-350 hover:text-rose-500 rounded"
                                    title="Drop Homework"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>

                              </div>

                            </div>
                          );
                        })}

                        {colAsms.length === 0 && (
                          <div className="text-center py-10 border border-dashed border-slate-200/60 rounded-xl bg-white/40">
                            <p className="text-[10px] text-slate-400 font-mono">No tasks queued</p>
                          </div>
                        )}
                      </div>

                    </div>
                  );
                })}

              </div>
            )}

            {/* L2. ALTERNATIVE TABLE/LIST VIEW */}
            {layoutMode === 'list' && (
              <div id="list-layout" className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/70 border-b border-slate-200 text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest">
                        <th className="py-2.5 px-4 w-10 text-center">
                          <input 
                            type="checkbox"
                            checked={selectedAsmIds.length === filteredAssignments.length && filteredAssignments.length > 0}
                            onChange={handleSelectAllAsms}
                            className="rounded text-indigo-600 focus:ring-indigo-300 h-3.5 w-3.5 cursor-pointer"
                          />
                        </th>
                        <th className="py-3 px-3">Assignment Name</th>
                        <th className="py-3 px-3">Linked Subject</th>
                        <th className="py-3 px-3 text-center">Priority</th>
                        <th className="py-3 px-3">Due Date</th>
                        <th className="py-3 px-3 text-center">Work Progress</th>
                        <th className="py-3 px-3 text-center">Marks Allowed</th>
                        <th className="py-3 px-3">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {filteredAssignments.map(asm => {
                        const isFocused = asm.id === selectedAssignmentId;
                        const { text: remainingText, isOverdue } = calculateDaysRemaining(asm.dueDate);
                        
                        return (
                          <tr
                            key={asm.id}
                            onClick={() => setSelectedAssignmentId(asm.id)}
                            className={`hover:bg-slate-50/85 cursor-pointer transition-all ${
                              isFocused ? 'bg-indigo-50/15 font-semibold' : ''
                            }`}
                          >
                            <td className="py-3.5 px-4 text-center select-none" onClick={(e) => e.stopPropagation()}>
                              <input 
                                type="checkbox"
                                checked={selectedAsmIds.includes(asm.id)}
                                onChange={() => handleToggleSelectAsm(asm.id)}
                                className="rounded text-indigo-600 focus:ring-indigo-300 h-3.5 w-3.5 cursor-pointer"
                              />
                            </td>
                            <td className="py-3.5 px-3">
                              <div className="font-extrabold text-slate-800 tracking-tight leading-snug">
                                {asm.title}
                              </div>
                              {asm.isGroup && (
                                <span className="inline-block mt-0.5 text-[8px] bg-purple-50 text-purple-650 px-1 rounded uppercase tracking-wider font-extrabold font-mono">
                                  Group Project
                                </span>
                              )}
                            </td>
                            <td 
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveTab('subjects');
                              }}
                              className="py-3.5 px-3 font-mono font-bold text-slate-500 uppercase hover:text-indigo-600 hover:underline cursor-pointer"
                              title="Navigate to Courses"
                            >
                              {asm.subjectName}
                            </td>
                            <td className="py-3.5 px-3 text-center">
                              <span className={`inline-block text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.2 rounded ${
                                asm.priority === 'critical' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                                asm.priority === 'high' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                                asm.priority === 'medium' ? 'bg-indigo-50 text-indigo-600' :
                                'bg-slate-100 text-slate-500'
                              }`}>
                                {asm.priority}
                              </span>
                            </td>
                            <td className="py-3.5 px-3 font-mono text-slate-500">
                              <div>{asm.dueDate}</div>
                              <span className={`text-[10px] leading-tight block ${
                                isOverdue && asm.status !== 'completed' ? 'text-rose-500 font-bold' : 'text-slate-400'
                              }`}>
                                {remainingText}
                              </span>
                            </td>
                            <td className="py-3.5 px-3">
                              <div className="flex items-center gap-1.5 justify-center">
                                <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                  <div 
                                    className="bg-primary h-1.5 rounded-full"
                                    style={{ width: `${asm.progress}%` }}
                                  />
                                </div>
                                <span className="font-mono text-[10px] font-bold text-slate-400">
                                  {asm.progress}%
                                </span>
                              </div>
                            </td>
                            <td className="py-3.5 px-3 text-center font-bold font-mono text-slate-600">
                              {asm.score !== undefined ? (
                                <span className="text-emerald-600 bg-emerald-50 border border-emerald-150 px-1.5 py-0.5 rounded">
                                  {asm.score} / {asm.marksAllocated || 100}
                                </span>
                              ) : (
                                <span className="text-slate-400 italic font-medium">Pending eval</span>
                              )}
                            </td>
                            <td className="py-3.5 px-3 uppercase text-[9px] font-bold font-mono">
                              <span className={`px-2 py-0.5 rounded-full border ${
                                asm.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                asm.status === 'in_progress' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                asm.status === 'overdue' ? 'bg-red-50 text-red-650 border-red-150 animate-pulse' :
                                'bg-slate-50 text-slate-500 border-slate-200'
                              }`}>
                                {asm.status === 'in_progress' ? 'in progress' : asm.status}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                              <div className="flex items-center justify-end gap-1">
                                {asm.status !== 'completed' && (
                                  <button
                                    onClick={() => handleMarkComplete(asm.id)}
                                    className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                                    title="Quick Complete"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                  </button>
                                )}
                                <button
                                  onClick={() => handleDeleteSelf(asm.id)}
                                  className="p-1 text-slate-350 hover:text-rose-500 rounded"
                                  title="Delete track"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* L3. DETAILED MONTHLY CALENDAR VIEW */}
            {layoutMode === 'calendar' && (
              <div id="calendar-layout" className="bg-white border border-slate-200/95 rounded-2xl p-5 shadow-xs space-y-4">
                
                {/* Calendar month controls */}
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-black text-slate-800 tracking-tight">Academic Monthly Ledger</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase font-mono mt-0.5">Click cells to inspect deadlines</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={handleCalendarPrev}
                      className="p-1 px-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-600 hover:bg-slate-100 text-xs transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-black text-slate-700 font-mono">
                      {monthNames[currentCalendarMonth]} {currentCalendarYear}
                    </span>
                    <button 
                      onClick={handleCalendarNext}
                      className="p-1 px-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-600 hover:bg-slate-100 text-xs transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Days of week titles */}
                <div className="grid grid-cols-7 gap-1 text-center font-mono font-bold text-[9px] text-slate-400 py-1.5 uppercase tracking-widest border-b border-slate-100">
                  <div>Sun</div>
                  <div>Mon</div>
                  <div>Tue</div>
                  <div>Wed</div>
                  <div>Thu</div>
                  <div>Fri</div>
                  <div>Sat</div>
                </div>

                {/* Monthly cells block */}
                <div className="grid grid-cols-7 gap-1 bg-slate-100/30 rounded-xl p-1 border border-slate-150">
                  {calendarCells.map((cellNum, idx) => {
                    if (cellNum === null) {
                      return <div key={`empty-${idx}`} className="h-20 bg-slate-50/20 rounded-lg border border-slate-100/10" />;
                    }

                    const dayAsms = getAssignmentsForDay(cellNum);
                    const isTodayMock = currentCalendarYear === 2026 && currentCalendarMonth === 5 && cellNum === 22; // June 22

                    return (
                      <div
                        key={`day-${cellNum}`}
                        onClick={() => {
                          if (dayAsms.length > 0) {
                            setSelectedAssignmentId(dayAsms[0].id);
                          }
                        }}
                        className={`h-22 bg-white rounded-lg p-1 border select-none transition-all flex flex-col justify-between overflow-hidden cursor-pointer ${
                          isTodayMock 
                            ? 'ring-2 ring-indigo-500 border-indigo-500 bg-indigo-50/10' 
                            : 'border-slate-200/60 hover:shadow-2xs hover:border-slate-350'
                        }`}
                      >
                        {/* Day indicator */}
                        <div className="flex items-center justify-between leading-none">
                          <span className={`text-[10px] font-mono font-bold ${
                            isTodayMock ? 'text-indigo-600 bg-indigo-150 w-5 h-5 rounded-full flex items-center justify-center font-black' : 'text-slate-400'
                          }`}>
                            {cellNum}
                          </span>
                          
                          {dayAsms.length > 0 && (
                            <span className="text-[9px] font-extrabold bg-blue-50 text-blue-700 px-1 rounded-sm leading-none">
                              {dayAsms.length} Task{dayAsms.length > 1 ? 's' : ''}
                            </span>
                          )}
                        </div>

                        {/* List minimal tasks in day */}
                        <div className="flex-1 mt-1 space-y-0.5 overflow-hidden">
                          {dayAsms.slice(0, 2).map(a => {
                            const isCrit = a.priority === 'critical' || a.priority === 'high';
                            return (
                              <div 
                                key={a.id}
                                className={`text-[9px] truncate font-extrabold px-1 rounded-xs border leading-tight ${
                                  a.status === 'completed' 
                                    ? 'bg-emerald-50/50 text-emerald-700 border-emerald-100/80 line-through' 
                                    : isCrit 
                                      ? 'bg-rose-50 text-rose-700 border-rose-100/80' 
                                      : 'bg-indigo-50 text-indigo-700 border-indigo-100/80'
                                }`}
                                title={a.title}
                              >
                                {(subjects.find(sub => sub.id === a.subjectId)?.code || a.subjectName.split(' ')[0])}: {a.title}
                              </div>
                            );
                          })}
                          {dayAsms.length > 2 && (
                            <div className="text-[8px] text-slate-400 text-center font-bold italic block pb-0.5">
                              + {dayAsms.length - 2} more...
                            </div>
                          )}
                        </div>

                      </div>
                    );
                  })}
                </div>

              </div>
            )}

            {/* L4. ANALYTICS & STATS SUBDIVISION */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Assignment Completion Trend Chart Widget */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-indigo-500" />
                    <h5 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider font-mono">Completion Trend</h5>
                  </div>
                  <span className="text-[9px] font-mono text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded font-bold">BY MONTH (2026)</span>
                </div>

                <div className="h-44 flex items-end justify-between pt-4 border-b border-slate-100 pb-1 px-2.5">
                  {[
                    { month: "Jan", done: 4, total: 4, pct: 100 },
                    { month: "Feb", done: 6, total: 6, pct: 100 },
                    { month: "Mar", done: 5, total: 6, pct: 83 },
                    { month: "Apr", done: 8, total: 9, pct: 88 },
                    { month: "May", done: 5, total: 6, pct: 83 },
                    { month: "Jun", done: completedCount, total: totalCount, pct: completionRate }
                  ].map((m, i) => {
                    const barHeight = `${Math.max(15, m.pct)}%`;
                    return (
                      <div key={i} className="flex flex-col items-center gap-2 w-10 group cursor-pointer relative">
                        {/* Tooltip percentage bubble */}
                        <div className="absolute -top-6 rounded bg-slate-900 text-white font-mono text-[9px] py-0.5 px-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {m.done}/{m.total}
                        </div>

                        {/* Completed bar segment */}
                        <div className="w-5 bg-indigo-50 rounded-md h-32 flex flex-col justify-end overflow-hidden relative border border-indigo-100/40">
                          <div 
                            className="bg-gradient-to-t from-indigo-600 to-indigo-400 w-full rounded-md transition-all duration-500"
                            style={{ height: barHeight }}
                          />
                        </div>
                        <span className="text-[9px] text-slate-400 font-mono font-bold">{m.month}</span>
                      </div>
                    );
                  })}
                </div>
                <p className="text-[10px] text-slate-400 text-center font-medium italic">Bars reflect completion ratio percent per academic term month.</p>
              </div>

              {/* Completion Rate by Subject */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BarChart2 className="w-4 h-4 text-emerald-500" />
                    <h5 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider font-mono">Rate by Subject</h5>
                  </div>
                  <span className="text-[9px] font-mono text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">SUCCESS %</span>
                </div>

                <div className="space-y-2.5">
                  {subjectsCompletionMap.slice(0, 4).map((sub, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="font-extrabold text-slate-700">{sub.code} • {sub.name}</span>
                        <span className="font-mono font-bold text-slate-400">{sub.rate}% Completion ({sub.total} asms)</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-emerald-500 h-full rounded-full"
                          style={{ width: `${sub.rate}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* L5. WORKLOAD HEATMAP METRIC GRAPH BLOCK */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="text-[11px] font-black uppercase text-slate-800 tracking-wider font-mono">Weekly Workload Heatmap</h5>
                  <p className="text-[10px] text-slate-400 font-bold mt-0.5 uppercase tracking-wide">Course workload layout by deadline delivery weekday</p>
                </div>
                <div className="flex items-center gap-1.5 text-[9px] font-mono font-bold text-slate-400">
                  <span>Less</span>
                  <div className="w-2.5 h-2.5 rounded bg-slate-50 border border-slate-200" />
                  <div className="w-2.5 h-2.5 rounded bg-indigo-100" />
                  <div className="w-2.5 h-2.5 rounded bg-indigo-300" />
                  <div className="w-2.5 h-2.5 rounded bg-indigo-500" />
                  <div className="w-2.5 h-2.5 rounded bg-indigo-700" />
                  <span>More</span>
                </div>
              </div>

              {/* Heatmap Layout with Weekday segments */}
              <div className="grid grid-cols-7 gap-2.5 text-center pt-2">
                {weekdaysKeys.map((dayLabel, index) => {
                  const countVal = workloadCounts[index];
                  
                  // map count to intensity color classes
                  let bgIntensity = "bg-slate-50 border-slate-200 text-slate-400";
                  if (countVal === 1) bgIntensity = "bg-indigo-50 border-indigo-100 text-indigo-700 font-bold";
                  else if (countVal === 2) bgIntensity = "bg-indigo-100 border-indigo-200 text-indigo-800 font-bold";
                  else if (countVal === 3) bgIntensity = "bg-indigo-300 border-indigo-400 text-indigo-900 font-bold";
                  else if (countVal >= 4) bgIntensity = "bg-indigo-600 border-indigo-700 text-white font-black animate-pulse";

                  return (
                    <div 
                      key={dayLabel}
                      className={`rounded-xl p-3 border flex flex-col items-center justify-between h-20 transition-all cursor-crosshair hover:scale-105 ${bgIntensity}`}
                    >
                      <span className="text-[10px] font-bold uppercase tracking-wider font-mono">{dayLabel}</span>
                      <div className="text-sm font-mono mt-1">{countVal}</div>
                      <span className="text-[8px] font-medium leading-none block">deliver{countVal > 1 ? 'ies' : 'y'}</span>
                    </div>
                  );
                })}
              </div>
              <p className="text-[10px] text-slate-400 font-medium text-center italic">Calculated live dynamically from upcoming, uncompleted deliverables in academic calendar databases.</p>
            </div>

          </div>

          {/* Right Metrics Sidebar Frame (4 units col span) */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
            
            {/* R1. ACTIVE DETAILED DRAWER CARD PANEL */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-5">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h4 className="text-xs font-black text-slate-900 tracking-tight uppercase font-mono">Assignment details Drawer</h4>
                  <p className="text-[10px] text-indigo-500 font-black">ACTIVE STUDY FOCUS</p>
                </div>
                {activeAssignment && (
                  <span className={`text-[8px] font-black uppercase font-mono px-2 py-0.5 rounded-full ${
                    activeAssignment.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                    activeAssignment.status === 'overdue' ? 'bg-red-50 text-red-650 border border-red-150 animate-pulse' :
                    'bg-indigo-50 text-indigo-700'
                  }`}>
                    {activeAssignment.status}
                  </span>
                )}
              </div>

              {activeAssignment ? (
                <>
                  {/* Detailed Fields Wrapper */}
                  <div className="space-y-4">
                    
                    {/* Assignment Title */}
                    <div className="space-y-0.5">
                      <span className="block text-[8px] text-slate-400 font-bold uppercase font-mono tracking-widest">COURSEWORK TITLE</span>
                      <h4 className="text-xs font-black text-slate-800 tracking-tight leading-snug">
                        {activeAssignment.title}
                      </h4>
                      <span className="text-[9px] font-bold text-slate-400 font-mono block">
                        Module: {activeAssignment.subjectName}
                      </span>
                    </div>

                    {/* Brief specifications or Description */}
                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-[11px] text-slate-500 leading-normal space-y-1">
                      <span className="block text-[8px] font-bold text-slate-450 uppercase tracking-widest font-mono">TASK DESCRIPTION Outline</span>
                      {isEditing ? (
                        <textarea
                          value={editingDescription}
                          onChange={(e) => setEditingDescription(e.target.value)}
                          className="w-full text-[11px] text-slate-600 bg-white border border-slate-200 rounded p-1"
                          rows={3}
                        />
                      ) : (
                        <p>{activeAssignment.description || "Standard syllabus lab checkpoint assignment. Detailed curriculum analysis provided in attached supporting resources PDFs."}</p>
                      )}
                    </div>

                    {/* Deadline stats remaining */}
                    <div className="grid grid-cols-2 gap-2 text-center bg-slate-50 border border-slate-100 p-2.5 rounded-xl text-xs">
                      <div>
                        <span className="text-[8px] text-slate-450 font-bold uppercase font-mono tracking-wider block">Due Date</span>
                        {isEditing ? (
                          <input
                            type="date"
                            value={editingDueDate}
                            onChange={(e) => setEditingDueDate(e.target.value)}
                            className="bg-white border rounded text-[10px] w-full mt-1 px-1 font-mono"
                          />
                        ) : (
                          <span className="font-mono text-slate-700 font-bold block mt-0.5">{activeAssignment.dueDate}</span>
                        )}
                      </div>
                      <div className="border-l border-slate-150">
                        <span className="text-[8px] text-slate-450 font-bold uppercase font-mono tracking-wider block">Time Left</span>
                        <span className={`font-mono text-[11px] font-bold block mt-0.5 capitalize ${
                          calculateDaysRemaining(activeAssignment.dueDate).isOverdue && activeAssignment.status !== 'completed'
                            ? 'text-rose-500' 
                            : 'text-indigo-600'
                        }`}>
                          {calculateDaysRemaining(activeAssignment.dueDate).text}
                        </span>
                      </div>
                    </div>

                    {/* Priority and Group specifications */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-slate-50/50 p-2 rounded-lg border border-slate-100">
                        <span className="text-[8px] text-slate-400 font-bold uppercase font-mono block tracking-wider">Priority Weight</span>
                        {isEditing ? (
                          <select
                            value={editingPriority}
                            onChange={(e) => setEditingPriority(e.target.value as any)}
                            className="text-[10px] border rounded bg-white w-full mt-1.5 font-sans"
                          >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="critical">Critical</option>
                          </select>
                        ) : (
                          <span className="font-mono text-[10px] font-extrabold capitalize text-indigo-700 mt-1 block">
                            {activeAssignment.priority}
                          </span>
                        )}
                      </div>

                      <div className="bg-slate-50/50 p-2 rounded-lg border border-slate-100">
                        <span className="text-[8px] text-slate-400 font-bold uppercase font-mono block tracking-wider">Project Scope</span>
                        <span className="font-sans text-[10px] font-extrabold text-slate-600 mt-1 block">
                          {activeAssignment.isGroup ? "👥 Group Team Collab" : "👤 Short Solo Project"}
                        </span>
                      </div>
                    </div>

                    {/* Progress Slider Track inside Sidebar Detail Drawer */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex justify-between items-center text-[10px] font-mono font-bold text-slate-400">
                        <span>COMPLETION RATE:</span>
                        <span className="text-slate-800">{isEditing ? `${editingProgress}%` : `${activeAssignment.progress}%`}</span>
                      </div>

                      {isEditing ? (
                        <div className="space-y-1">
                          <input 
                            type="range"
                            min="0"
                            max="100"
                            step="5"
                            value={editingProgress}
                            onChange={(e) => setEditingProgress(parseInt(e.target.value))}
                            className="w-full h-1.5 bg-slate-100 accent-primary rounded appearance-none cursor-pointer"
                          />
                          <div className="flex justify-between text-[8px] text-slate-400 font-mono">
                            <span>0% (Pending)</span>
                            <span>50% (In-Prog)</span>
                            <span>100% (Done)</span>
                          </div>
                        </div>
                      ) : (
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-primary h-full rounded-full transition-all duration-300"
                            style={{ width: `${activeAssignment.progress}%` }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Submission Type, Marks and Feedback fields */}
                    <div className="border-t border-slate-100 pt-3 space-y-2 text-xs">
                      <span className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest font-mono">SUBMISSION SPECIFICATIONS</span>
                      
                      <div className="space-y-1 text-[11px] text-slate-500">
                        
                        <div className="flex justify-between">
                          <span>Submission Format</span>
                          <strong className="text-slate-700 font-mono uppercase">
                            {activeAssignment.submissionType === 'github' ? '🐙 GitHub Repository Link' : '📁 PDF File Upload'}
                          </strong>
                        </div>

                        <div className="flex justify-between items-center">
                          <span>Grade Marks Evaluated</span>
                          {isEditing ? (
                            <input
                              type="number"
                              placeholder="Score"
                              value={editingScore || ''}
                              onChange={(e) => {
                                const parsed = parseInt(e.target.value);
                                setEditingScore(isNaN(parsed) ? undefined : parsed);
                              }}
                              className="w-20 bg-white border border-slate-200 text-xs text-right rounded p-0.5"
                            />
                          ) : (
                            <strong className="text-indigo-600 font-mono">
                              {activeAssignment.score !== undefined 
                                ? `${activeAssignment.score} / ${activeAssignment.marksAllocated || 100} (${activeAssignment.grade || 'A'})` 
                                : 'Pending Grading Eval'}
                            </strong>
                          )}
                        </div>

                        {/* Instructor Feedback feedback block */}
                        <div className="pt-2">
                          <span className="block font-bold text-[8px] text-slate-400 font-mono uppercase mb-0.5">INSTRUCTOR CRITIQUE FEEDBACK</span>
                          {isEditing ? (
                            <textarea
                              value={editingFeedback}
                              onChange={(e) => setEditingFeedback(e.target.value)}
                              className="w-full text-[11px] text-slate-600 bg-white border border-slate-200 rounded p-1"
                              rows={2}
                              placeholder="Write feedback comments..."
                            />
                          ) : (
                            <p className="italic text-slate-450 leading-snug">
                              {activeAssignment.feedback || "Submission has not been annotated yet by assigned grading professors."}
                            </p>
                          )}
                        </div>

                      </div>
                    </div>

                    {/* Interactive Mock Attachments section */}
                    <div className="border-t border-slate-100 pt-3 space-y-1.5">
                      <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest font-mono">COURSWORK ATTACHMENTS</span>
                      
                      <div className="space-y-1">
                        {[
                          { name: "Assignment_Brief_Requirements_Syllabus.pdf", size: "2.4 MB" },
                          { name: "Supporting_Research_Sources_Database.zip", size: "14.1 MB" }
                        ].map((file, fIdx) => (
                          <div 
                            key={fIdx}
                            onClick={() => triggerToast(`Downloading mock attachment asset: ${file.name}`)}
                            className="bg-slate-50 hover:bg-slate-100 border border-slate-150 p-2 rounded-xl flex items-center justify-between text-[11px] text-indigo-700 font-bold cursor-pointer transition-colors"
                          >
                            <div className="flex items-center gap-1.5 truncate">
                              <Paperclip className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                              <span className="truncate text-slate-700 font-normal">{file.name}</span>
                            </div>
                            <span className="text-[9px] text-slate-400 font-mono font-bold shrink-0">{file.size}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Form Controls inside Drawer panel */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                      {isEditing ? (
                        <>
                          <button
                            onClick={handleSaveDrawerEdits}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1.8 px-3.5 rounded-lg flex items-center gap-1 transition-colors w-full justify-center cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> Save Changes
                          </button>
                          <button
                            onClick={() => setIsEditing(false)}
                            className="text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-150 py-1.8 px-3.5 rounded-lg font-bold"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEnableEdit(activeAssignment)}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-black py-2 px-4 rounded-xl flex items-center gap-1 justify-center grow cursor-pointer text-[11px] transition-all"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-indigo-500" /> Modify Properties
                          </button>
                          
                          {activeAssignment.status !== 'completed' && (
                            <button
                              onClick={() => handleMarkComplete(activeAssignment.id)}
                              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-3 rounded-xl flex items-center gap-1 cursor-pointer text-[11px]"
                              title="Mark Task complete"
                            >
                              <CircleCheck className="w-3.5 h-3.5" /> Done
                            </button>
                          )}
                        </>
                      )}
                    </div>

                  </div>
                </>
              ) : (
                <div className="text-center py-10 text-slate-400">
                  <Info className="w-6 h-6 mx-auto mb-2 text-slate-300" />
                  <p className="text-xs font-mono">No active assignment focus context</p>
                </div>
              )}

            </div>

            {/* R2. PRIORITY MATRIX WIDGET SUMMARY */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-black text-xs text-slate-800 uppercase tracking-wider font-mono">Priority Matrix Breakdown</h5>
                  <p className="text-[10px] text-slate-400 mt-0.5">Tasks percentage by risk criticality ratings</p>
                </div>
                <Zap className="w-4 h-4 text-amber-500" />
              </div>

              <div id="priority-progress-distribution" className="space-y-3.5">
                {priorityDistribution.map((item, pi) => (
                  <div key={pi} className="space-y-1 text-xs">
                    <div className="flex justify-between items-center font-mono">
                      <span className={`font-black ${item.text}`}>{item.label} Level</span>
                      <span className="text-slate-400 font-bold">{item.count} Assignments ({item.percent || 0}%)</span>
                    </div>

                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`${item.color} h-full rounded-full`}
                        style={{ width: `${item.percent || 0}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* R3. UPCOMING CLOSE DEADLINES WIDGET */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider font-mono">Upcoming Near Deadlines</h5>
                  <p className="text-[10px] text-slate-400 mt-0.5">Urgent deliverables requiring study focus</p>
                </div>
                <Clock className="w-4 h-4 text-indigo-500 animate-spin-slow" />
              </div>

              {/* Nearest uncompleted deliverables list */}
              <div className="space-y-2.5 pt-1 text-xs max-h-[240px] overflow-y-auto">
                {assignments
                  .filter(a => a.status !== 'completed')
                  .map(a => ({ ...a, rem: calculateDaysRemaining(a.dueDate) }))
                  .sort((a,b) => a.rem.days - b.rem.days)
                  .slice(0, 4)
                  .map((task, asIdx) => {
                    const isTaskOve = task.rem.days < 0;
                    return (
                      <div 
                        key={asIdx}
                        onClick={() => setSelectedAssignmentId(task.id)}
                        className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                          isTaskOve 
                            ? 'bg-rose-50/50 border-rose-200 text-rose-800 hover:bg-rose-50' 
                            : 'bg-slate-50 hover:bg-slate-100 border-slate-150 text-slate-700'
                        }`}
                      >
                        <div className="truncate space-y-0.5 pr-2">
                          <span className="block text-[8px] font-bold font-mono text-slate-400 uppercase leading-none">{task.subjectName}</span>
                          <span className="font-extrabold text-[11.5px] truncate block tracking-tight">{task.title}</span>
                        </div>

                        <div className="shrink-0 text-right leading-none">
                          <span className={`text-[9.5px] font-mono font-extrabold block rounded-md px-1.5 py-0.5 ${
                            isTaskOve ? 'bg-rose-100 text-rose-700' : 'bg-slate-200/80 text-slate-700'
                          }`}>
                            {task.rem.text}
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* 6. ADVANCED CREATION POPUP MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <form 
            onSubmit={handleAddSubmit}
            className="bg-white border border-slate-350 rounded-3xl p-6 shadow-2xl max-w-lg w-full space-y-4 text-xs animate-scale-in"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-1.5">
                <PlusCircle className="w-5 h-5 text-indigo-600" />
                <h4 className="text-sm font-black text-slate-800 tracking-tight">Create Assignment Track Task</h4>
              </div>
              <button 
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form Fields inputs */}
            <div className="grid grid-cols-2 gap-3.5">
              
              <div className="col-span-2">
                <label className="block text-[9px] font-black text-slate-450 uppercase tracking-widest font-mono mb-1">Assignment Class Name</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Artificial Neural Network Project Phase 1"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100 transition-all text-slate-700"
                />
              </div>

              <div>
                <label className="block text-[9px] font-black text-slate-450 uppercase tracking-widest font-mono mb-1">Subject Course Module</label>
                <select
                  required
                  value={newSubjectId}
                  onChange={(e) => setNewSubjectId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-semibold outline-none focus:bg-white text-slate-700"
                >
                  <option value="">Select subject module...</option>
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.code} - {s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[9px] font-black text-slate-450 uppercase tracking-widest font-mono mb-1">Academic Term Semester</label>
                <select
                  value={newSemesterId}
                  onChange={(e) => setNewSemesterId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-semibold outline-none focus:bg-white text-slate-700"
                >
                  {semesters.map(sm => (
                    <option key={sm.id} value={sm.id}>{sm.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[9px] font-black text-slate-450 uppercase tracking-widest font-mono mb-1">Coursework Priority</label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-semibold outline-none focus:bg-white text-slate-700"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                  <option value="critical">Critical Priority</option>
                </select>
              </div>

              <div>
                <label className="block text-[9px] font-black text-slate-450 uppercase tracking-widest font-mono mb-1">Submission Type Format</label>
                <select
                  value={newSubmissionType}
                  onChange={(e) => setNewSubmissionType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-semibold outline-none focus:bg-white text-slate-700"
                >
                  <option value="online_upload">📁 Online PDF Document Upload</option>
                  <option value="github">🐙 Automated GitHub Repo Link</option>
                  <option value="written">📝 Paper Written Exam Submission</option>
                </select>
              </div>

              <div>
                <label className="block text-[9px] font-black text-slate-450 uppercase tracking-widest font-mono mb-1">Due Date Deadline</label>
                <input 
                  type="date"
                  required
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.8 text-slate-700 outline-none focus:bg-white font-mono"
                />
              </div>

              <div>
                <label className="block text-[9px] font-black text-slate-450 uppercase tracking-widest font-mono mb-1">Marks Scale allocation</label>
                <input 
                  type="number"
                  min="10"
                  max="200"
                  required
                  value={newMarksAllocated}
                  onChange={(e) => setNewMarksAllocated(parseInt(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.8 text-slate-700 outline-none focus:bg-white font-mono font-bold"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-[9px] font-black text-slate-455 uppercase tracking-widest font-mono mb-1">Syllabus Requirements or Description</label>
                <textarea
                  rows={2}
                  placeholder="Provide checklist requirements or evaluation matrices criteria..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none font-semibold text-slate-650 focus:bg-white md:text-xs"
                />
              </div>

              <div className="col-span-2 flex items-center justify-between py-2 border-t border-dashed border-slate-100 mt-1">
                
                <div className="flex items-center gap-2">
                  <input
                    id="newIsGroupInput"
                    type="checkbox"
                    checked={newIsGroup}
                    onChange={(e) => setNewIsGroup(e.target.checked)}
                    className="w-4 h-4 text-indigo-650 bg-slate-50 rounded cursor-pointer"
                  />
                  <label htmlFor="newIsGroupInput" className="font-extrabold text-slate-600 block cursor-pointer select-none">
                    Requires Group Collaboration
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-mono text-slate-400 font-bold uppercase">INITIAL STATUS:</span>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as any)}
                    className="bg-transparent text-indigo-600 font-bold border-b border-indigo-400 outline-none"
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

              </div>

            </div>

            {/* Buttons control row */}
            <div className="pt-2 flex items-center justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="text-slate-500 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl py-2 px-4 transition-colors font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl py-2 px-5 transition-colors shadow-md shadow-indigo-100 hover:shadow-indigo-200 cursor-pointer"
              >
                Save Assignment
              </button>
            </div>

          </form>
        </div>
      )}

      {/* 7. PROGRESS REPORT GENERATOR MODAL VIEW */}
      {showReportModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white border border-slate-300 rounded-3xl p-6 shadow-2xl max-w-xl w-full space-y-5 animate-scale-in">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-1.5">
                <FileText className="w-5 h-5 text-indigo-600" />
                <h4 className="text-sm font-black text-slate-800 tracking-tight uppercase font-mono">Academic Achievement & Workload Report</h4>
              </div>
              <button 
                onClick={() => setShowReportModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Printable summary content inside report modal */}
            <div className="space-y-4 text-xs text-slate-600" id="print-area-metrics">
              
              <div className="bg-slate-50 border border-slate-150 p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3 text-center md:text-left leading-normal">
                <div>
                  <span className="text-[10px] bg-indigo-100 font-extrabold text-indigo-700 px-2.5 py-0.5 rounded-full uppercase">Student Success Platform</span>
                  <h3 className="text-sm font-black text-slate-800 tracking-tight mt-1">Portfolio coursework Report Checklist</h3>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5 uppercase tracking-wider">GENERATED ON June 22, 2026 - 09:42</p>
                </div>

                <div className="text-right shrink-0">
                  <span className="block text-[9px] text-slate-400 font-bold uppercase font-mono tracking-wider">Overall Success index</span>
                  <span className="text-2xl font-black text-indigo-600 font-mono mt-0.5 block">{completionRate}% Done</span>
                </div>
              </div>

              {/* Coursework metric details breakdown list */}
              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                {assignments.map((asm, rId) => {
                  return (
                    <div key={rId} className="p-2.5 rounded-xl border border-slate-150 flex items-center justify-between bg-white text-xs">
                      <div>
                        <span className="font-mono text-[9px] text-slate-400 uppercase tracking-wide block">{asm.subjectName}</span>
                        <strong className="text-slate-800 font-bold">{asm.title}</strong>
                      </div>
                      <div className="text-right shrink-0 font-mono text-[10px]">
                        <span className={`inline-block px-2 py-0.5 rounded-full uppercase text-[8px] font-bold border leading-none ${
                          asm.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-50 text-slate-500'
                        }`}>
                          {asm.status}
                        </span>
                        <span className="block mt-1 font-bold text-slate-600">{asm.progress}% progress</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Academic diagnostic metrics footer */}
              <div className="border-t border-dashed border-slate-200 pt-3.5 space-y-1.5 text-[11px] text-slate-450 leading-normal">
                <span className="block font-black text-[9px] text-indigo-600 font-mono uppercase tracking-widest">COURSES REPORT DIAGNOSTIC</span>
                <p>All checked assignment deadlines have been compiled natively. Based on current parameters, we've cataloged a total credit scale ratio of <strong>{subjects.reduce((s,c) => s+c.credits,0)} Credits</strong> with an ongoing average grade profile. Please consult assigned academic advisors to authorize official university transcripts.</p>
              </div>

            </div>

            {/* Modal Controls triggers */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2 text-xs">
              <button
                onClick={() => window.print()}
                className="bg-indigo-650 hover:bg-indigo-700 text-white font-extrabold rounded-xl py-2 px-5 cursor-pointer transition-all flex items-center gap-1.5 shadow-2xs"
              >
                <FileSpreadsheet className="w-4 h-4" /> Print Document PDF
              </button>
              <button
                onClick={() => setShowReportModal(false)}
                className="text-slate-500 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl py-2 px-4 transition-colors font-bold"
              >
                Close Report
              </button>
            </div>

          </div>
        </div>
      )}

      {successToastMessage && (
        <div id="assignments-toast-alert" className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-slate-800 text-white font-semibold text-xs px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>{successToastMessage}</span>
        </div>
      )}

    </div>
  );
};
