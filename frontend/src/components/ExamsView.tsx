import React, { useState, useMemo } from 'react';
import { 
  Award, 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Sparkles, 
  HelpCircle, 
  AlertTriangle, 
  Search, 
  SlidersHorizontal, 
  BookOpen, 
  Layers, 
  BarChart3, 
  TrendingUp, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  X, 
  Check, 
  FileText, 
  Info, 
  Trophy,
  Flame,
  ArrowUpRight,
  Eye,
  Edit
} from 'lucide-react';
import { Exam, Subject } from '../types';

interface ExamsViewProps {
  exams: Exam[];
  subjects: Subject[];
  onAddExam: (subjectId: string, type: string, date: string, timeRange: string, venue: string) => void;
  onUpdateExamGrade: (id: string, score: number, grade: string) => void;
  onDeleteExam: (id: string) => void;
  setActiveTab?: (tab: string) => void;
}

// Full 24 Exam database initialization (20 completed, 4 upcoming)
const DEFAULT_EXPANDED_EXAMS: Exam[] = [
  // 4 upcoming
  { id: "e-up-1", subjectId: "sub-501", subjectName: "Database Systems", subjectCode: "CS302", type: "Final Exam", date: "2026-06-27", timeRange: "09:00 AM - 12:00 PM", venue: "Main Science Hall - Room 302", status: "upcoming", daysRemaining: 5 },
  { id: "e-up-2", subjectId: "sub-401", subjectName: "Software Engineering", subjectCode: "SE401", type: "Final Exam", date: "2026-08-02", timeRange: "01:00 PM - 04:00 PM", venue: "Hall A", status: "upcoming", daysRemaining: 41 },
  { id: "e-up-3", subjectId: "sub-ml", subjectName: "Machine Learning", subjectCode: "CS420", type: "Mid Exam", date: "2026-07-01", timeRange: "10:00 AM - 12:00 PM", venue: "Lab 05", status: "upcoming", daysRemaining: 9 },
  { id: "e-up-4", subjectId: "sub-cn", subjectName: "Computer Networks", subjectCode: "CS308", type: "Final Exam", date: "2026-07-06", timeRange: "09:00 AM - 12:00 PM", venue: "Hall B", status: "upcoming", daysRemaining: 14 },
  
  // 20 Completed
  { id: "e-c-1", subjectId: "sub-501", subjectName: "Database Systems", subjectCode: "CS302", type: "Mid Exam", date: "2026-07-15", timeRange: "09:00 AM - 11:00 AM", venue: "Lab 04", score: 84, maxScore: 100, grade: "A-", status: "completed" },
  { id: "e-c-2", subjectId: "sub-502", subjectName: "Discrete Mathematics", subjectCode: "CS102", type: "Final Exam", date: "2025-01-25", timeRange: "01:00 PM - 04:00 PM", venue: "Hall A", score: 78, maxScore: 100, grade: "B+", status: "completed" },
  { id: "e-c-3", subjectId: "sub-503", subjectName: "Web Application Development", subjectCode: "CS204", type: "Practical Exam", date: "2025-06-28", timeRange: "09:00 AM - 12:00 PM", venue: "Lab 04", score: 94, maxScore: 100, grade: "A", status: "completed" },
  { id: "e-c-4", subjectId: "sub-504", subjectName: "Operating Systems", subjectCode: "CS301", type: "Final Exam", date: "2025-12-18", timeRange: "01:00 PM - 04:00 PM", venue: "Lab 01", score: 82, maxScore: 100, grade: "B", status: "completed" },
  { id: "e-c-5", subjectId: "sub-505", subjectName: "Object-Oriented Programming", subjectCode: "CS201", type: "Final Exam", date: "2025-06-12", timeRange: "09:00 AM - 12:00 PM", venue: "Lab 02", score: 88, maxScore: 100, grade: "A-", status: "completed" },
  { id: "e-c-6", subjectId: "sub-506", subjectName: "Data Structures & Algorithms", subjectCode: "CS202", type: "Final Exam", date: "2025-06-18", timeRange: "09:00 AM - 12:00 PM", venue: "Hall C", score: 85, maxScore: 100, grade: "B+", status: "completed" },
  { id: "e-c-7", subjectId: "sub-507", subjectName: "Computer Architecture", subjectCode: "CS203", type: "Final Exam", date: "2025-06-22", timeRange: "01:00 PM - 03:00 PM", venue: "Hall A", score: 74, maxScore: 100, grade: "B-", status: "completed" },
  { id: "e-c-8", subjectId: "sub-508", subjectName: "Probability & Statistics", subjectCode: "MA301", type: "Final Exam", date: "2025-12-15", timeRange: "09:00 AM - 11:30 AM", venue: "Hall C", score: 80, maxScore: 100, grade: "B", status: "completed" },
  { id: "e-c-9", subjectId: "sub-509", subjectName: "Software Requirements Engineering", subjectCode: "CS303", type: "Mid Exam", date: "2025-12-21", timeRange: "09:00 AM - 11:30 AM", venue: "Hall A", score: 86, maxScore: 100, grade: "A-", status: "completed" },
  { id: "e-c-10", subjectId: "sub-510", subjectName: "Computer Networks", subjectCode: "CS304", type: "Mid Exam", date: "2025-12-23", timeRange: "09:00 AM - 12:00 PM", venue: "Hall B", score: 71, maxScore: 100, grade: "C+", status: "completed" },
  { id: "e-c-11", subjectId: "sub-511", subjectName: "Introduction to Programming", subjectCode: "CS101", type: "Final Exam", date: "2025-01-22", timeRange: "09:00 AM - 12:00 PM", venue: "Hall B", score: 92, maxScore: 100, grade: "A", status: "completed" },
  { id: "e-c-12", subjectId: "sub-512", subjectName: "Systems Modeling", subjectCode: "CS305", type: "Viva Presentation", date: "2025-12-10", timeRange: "02:00 PM - 04:00 PM", venue: "Boardroom A", score: 87, maxScore: 100, grade: "B+", status: "completed" },
  { id: "e-c-13", subjectId: "sub-513", subjectName: "Human Computer Interaction", subjectCode: "CS208", type: "Mid Exam", date: "2025-05-10", timeRange: "09:00 AM - 11:00 AM", venue: "Lab 01", score: 83, maxScore: 100, grade: "B", status: "completed" },
  { id: "e-c-14", subjectId: "sub-514", subjectName: "Human Computer Interaction", subjectCode: "CS208", type: "Final Exam", date: "2025-06-15", timeRange: "09:00 AM - 12:00 PM", venue: "Hall B", score: 81, maxScore: 100, grade: "B-", status: "completed" },
  { id: "e-c-15", subjectId: "sub-515", subjectName: "Professional Development", subjectCode: "CS111", type: "Viva Presentation", date: "2025-01-18", timeRange: "10:30 AM - 12:00 PM", venue: "Seminar Room 1", score: 90, maxScore: 100, grade: "A-", status: "completed" },
  { id: "e-c-16", subjectId: "sub-516", subjectName: "Software Engineering Project", subjectCode: "SE209", type: "Practical Exam", date: "2025-06-25", timeRange: "02:00 PM - 05:00 PM", venue: "Lab 03", score: 89, maxScore: 100, grade: "A-", status: "completed" },
  { id: "e-c-17", subjectId: "sub-517", subjectName: "Linear Algebra", subjectCode: "MA202", type: "Mid Exam", date: "2025-05-02", timeRange: "09:00 AM - 11:00 AM", venue: "Hall A", score: 76, maxScore: 100, grade: "B", status: "completed" },
  { id: "e-c-18", subjectId: "sub-518", subjectName: "Linear Algebra", subjectCode: "MA202", type: "Final Exam", date: "2025-06-10", timeRange: "09:00 AM - 12:00 PM", venue: "Hall A", score: 78, maxScore: 100, grade: "B+", status: "completed" },
  { id: "e-c-19", subjectId: "sub-519", subjectName: "Software Quality Assurance", subjectCode: "SE310", type: "Mid Exam", date: "2025-10-18", timeRange: "11:00 AM - 01:00 PM", venue: "Lab 02", score: 85, maxScore: 100, grade: "B+", status: "completed" },
  { id: "e-c-20", subjectId: "sub-520", subjectName: "Software Architecture", subjectCode: "SE305", type: "Practical Exam", date: "2025-11-20", timeRange: "09:00 AM - 12:00 PM", venue: "Lab 04", score: 83, maxScore: 100, grade: "B", status: "completed" }
];

export const ExamsView: React.FC<ExamsViewProps> = ({
  exams: parentExams,
  subjects,
  onAddExam,
  onUpdateExamGrade,
  onDeleteExam,
  setActiveTab
}) => {
  // Direct state initialization with the expanded dataset to comply with "Total: 24, Completed: 20, Upcoming: 4"
  const [localExams, setLocalExams] = useState<Exam[]>(() => {
    const saved = localStorage.getItem('success_platform_rich_exams_list');
    if (saved) return JSON.parse(saved);
    return DEFAULT_EXPANDED_EXAMS;
  });

  const saveExamsToStorage = (updatedList: Exam[]) => {
    setLocalExams(updatedList);
    localStorage.setItem('success_platform_rich_exams_list', JSON.stringify(updatedList));
  };

  // UI States
  const [viewMode, setViewMode] = useState<'table' | 'calendar'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [semesterFilter, setSemesterFilter] = useState('all');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  
  // Custom interactive drawer & mods
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateMarksModal, setShowUpdateMarksModal] = useState<Exam | null>(null);
  const [showReportCardModal, setShowReportCardModal] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState<string | null>(null);

  // Form states for adding exams
  const [addSubjectId, setAddSubjectId] = useState('');
  const [addType, setAddType] = useState('Final Exam');
  const [addDate, setAddDate] = useState('');
  const [addStartTime, setAddStartTime] = useState('09:00 AM');
  const [addDuration, setAddDuration] = useState('3 Hours');
  const [addVenue, setAddVenue] = useState('');
  const [addTotalMarks, setAddTotalMarks] = useState('100');
  const [addDescription, setAddDescription] = useState('');

  // Form states for updating marks
  const [updateMarksObtained, setUpdateMarksObtained] = useState('85');
  const [updateGrade, setUpdateGrade] = useState('A');
  const [updateFeedback, setUpdateFeedback] = useState('Excellent effort! High precision logical architecture.');
  const [updateNotes, setUpdateNotes] = useState('Reviewed indices, nested loop joints, and query optimizations.');

  // Calendar State
  const [calendarMonth, setCalendarMonth] = useState(5); // June (0-indexed)
  const [calendarYear, setCalendarYear] = useState(2026);

  // Study Planner Widgets State
  const [loggedStudyHours, setLoggedStudyHours] = useState(94);
  const totalPlannedStudyHours = 120;
  
  // Dynamic checklist in details drawer
  const [checkedPrepTopics, setCheckedPrepTopics] = useState<Record<string, boolean>>({
    'CS302-t1': true, 'CS302-t2': true, 'CS302-t3': false, 'SE401-t1': false, 'SE401-t2': false
  });

  const triggerToast = (msg: string) => {
    setShowSuccessToast(msg);
    setTimeout(() => setShowSuccessToast(null), 3000);
  };

  // Sync up when parent list additions occur or update inside local storage
  const handleAddLocalExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addSubjectId || !addDate || !addVenue) return;

    const matchedSubject = subjects.find(s => s.id === addSubjectId) || { name: 'Elective Web Modules', code: 'CS315' };
    const newExam: Exam = {
      id: `e-custom-${Date.now()}`,
      subjectId: addSubjectId,
      subjectName: matchedSubject.name,
      subjectCode: matchedSubject.code,
      type: addType,
      date: addDate,
      timeRange: `${addStartTime} (Duration: ${addDuration})`,
      venue: addVenue,
      status: 'upcoming',
      maxScore: Number(addTotalMarks),
      daysRemaining: Math.ceil((new Date(addDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24))
    };

    const updated = [newExam, ...localExams];
    saveExamsToStorage(updated);
    
    // Trigger external notification callback
    onAddExam(addSubjectId, addType, addDate, `${addStartTime} - ${addDuration}`, addVenue);
    
    setShowAddModal(false);
    triggerToast("✨ New exam scheduled in modern student registry!");
    
    // Clear forms
    setAddSubjectId('');
    setAddDate('');
    setAddVenue('');
    setAddDescription('');
  };

  const handleUpdateLocalMarksSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showUpdateMarksModal) return;

    const examId = showUpdateMarksModal.id;
    const scoreVal = parseFloat(updateMarksObtained);
    
    const updated = localExams.map(ex => {
      if (ex.id === examId) {
        return {
          ...ex,
          score: scoreVal,
          grade: updateGrade,
          status: 'completed' as const
        };
      }
      return ex;
    });

    saveExamsToStorage(updated);
    onUpdateExamGrade(examId, scoreVal, updateGrade);
    
    // If the currently open drawer is the updated exam, update it there too
    if (selectedExam && selectedExam.id === examId) {
      setSelectedExam({ ...selectedExam, score: scoreVal, grade: updateGrade, status: 'completed' });
    }

    setShowUpdateMarksModal(null);
    triggerToast("✅ Exam evaluation ledger record verified successfully.");
  };

  const handleDeleteLocalExam = (id: string) => {
    const updated = localExams.filter(ex => ex.id !== id);
    saveExamsToStorage(updated);
    onDeleteExam(id);
    if (selectedExam && selectedExam.id === id) {
      setSelectedExam(null);
    }
    triggerToast("🗑 Exam record discarded from database ledger.");
  };

  // Derived filter calculations
  const filteredExams = useMemo(() => {
    return localExams.filter(ex => {
      const matchesSearch = searchQuery === '' || 
        ex.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ex.subjectCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ex.venue.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = typeFilter === 'all' || 
        ex.type.toLowerCase().includes(typeFilter.toLowerCase());

      const matchesSubject = subjectFilter === 'all' || 
        ex.subjectCode === subjectFilter;

      // Filter by semester group based on course code prefixes or static mapped ranges
      const isSem34 = ex.subjectCode.includes('20') || ex.subjectCode.includes('30');
      const isSem12 = ex.subjectCode.includes('10');
      
      const matchesSemester = semesterFilter === 'all' || 
        (semesterFilter === 'sem-5' && ex.id.startsWith('e-up')) ||
        (semesterFilter === 'sem-3-4' && isSem34 && !ex.id.startsWith('e-up')) ||
        (semesterFilter === 'sem-1-2' && isSem12);

      return matchesSearch && matchesType && matchesSubject && matchesSemester;
    });
  }, [localExams, searchQuery, semesterFilter, subjectFilter, typeFilter]);

  // Derived Stats directly mapping to specified counts
  const totalExamsCount = localExams.length; 
  const upcomingExamsCount = localExams.filter(e => e.status === 'upcoming').length;
  const completedExamsCount = localExams.filter(e => e.status === 'completed').length;
  
  const averageExamScore = useMemo(() => {
    const completed = localExams.filter(e => e.status === 'completed' && e.score !== undefined);
    if (completed.length === 0) return 0;
    const sum = completed.reduce((acc, curr) => acc + (curr.score || 0), 0);
    return Math.round(sum / completed.length);
  }, [localExams]);

  const highestExamScore = useMemo(() => {
    const completed = localExams.filter(e => e.status === 'completed' && e.score !== undefined);
    if (completed.length === 0) return 0;
    return Math.max(...completed.map(e => e.score || 0));
  }, [localExams]);

  // Unique list of subject codes for dropdown filter options
  const uniqueSubjectOptions = useMemo(() => {
    const codes = new Set(localExams.map(ex => ex.subjectCode));
    return Array.from(codes);
  }, [localExams]);

  // Calendar render math
  const daysInMonthList = useMemo(() => {
    const dates = [];
    const firstDay = new Date(calendarYear, calendarMonth, 1).getDay();
    const totalDays = new Date(calendarYear, calendarMonth + 1, 0).getDate();
    
    // Pad previous month days
    for (let i = 0; i < firstDay; i++) {
      dates.push({ dayNum: null, isCurrentMonth: false });
    }
    // Current month days
    for (let d = 1; d <= totalDays; d++) {
      dates.push({ dayNum: d, isCurrentMonth: true });
    }
    return dates;
  }, [calendarMonth, calendarYear]);

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const handlePrevMonth = () => {
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear(prev => prev - 1);
    } else {
      setCalendarMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear(prev => prev + 1);
    } else {
      setCalendarMonth(prev => prev + 1);
    }
  };

  // Color mapper helper based on exam type requested colors
  const getExamColorTheme = (type: string) => {
    const text = type.toLowerCase();
    if (text.includes('mid')) return { bg: 'bg-blue-50/90', text: 'text-blue-700 border-blue-100', dot: 'bg-blue-500' };
    if (text.includes('final')) return { bg: 'bg-purple-50/90', text: 'text-purple-700 border-purple-100', dot: 'bg-purple-500' };
    if (text.includes('practical') || text.includes('lab')) return { bg: 'bg-emerald-50/90', text: 'text-emerald-700 border-emerald-100', dot: 'bg-emerald-500' };
    if (text.includes('viva') || text.includes('defense') || text.includes('presentation')) return { bg: 'bg-amber-50/90', text: 'text-amber-700 border-amber-100', dot: 'bg-amber-500' };
    return { bg: 'bg-pink-50/90', text: 'text-pink-700 border-pink-100', dot: 'bg-pink-500' };
  };

  return (
    <div id="exams-view-workspace" className="space-y-6 text-slate-800 pb-12 animate-fade-in relative">
      
      {/* Dynamic Action Toast Alert */}
      {showSuccessToast && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white rounded-2xl px-5 py-3.5 shadow-xl border border-white/5 flex items-center gap-3 animate-slide-in-right z-50 transition-all max-w-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div className="text-xs">
            <strong className="block font-black leading-tight text-white mb-0.5">Success Ledger Update</strong>
            <span className="text-slate-350 font-medium">{showSuccessToast}</span>
          </div>
          <button onClick={() => setShowSuccessToast(null)} className="text-slate-400 hover:text-white ml-2">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 1. TOP TITLE BLOCK */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-3xs flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 font-bold text-[10px] uppercase tracking-wider py-1 px-3 rounded-full border border-blue-105">
            <Award className="w-3.5 h-3.5" /> Student Success Platform Account
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Exam Management</h2>
          <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
            Manage exam schedules, track exam performance, monitor upcoming assessments, and analyze academic results.
          </p>
        </div>

        {/* Quick Actions List Widget */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs py-2 px-3.5 rounded-xl cursor-pointer transition-all flex items-center gap-1.5 shadow-xs shadow-blue-500/20"
          >
            <Plus className="w-3.5 h-3.5" /> Add Exam
          </button>
          <button
            onClick={() => setViewMode(viewMode === 'table' ? 'calendar' : 'table')}
            className="bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs py-2 px-3.5 rounded-xl border border-slate-200 shadow-3xs transition-all flex items-center gap-1.5"
          >
            <Calendar className="w-3.5 h-3.5 text-slate-400" /> {viewMode === 'table' ? 'View Calendar' : 'View Table'}
          </button>
          <button
            onClick={() => {
              const matched = localExams.find(ex => ex.status === 'upcoming') || localExams[0];
              setShowUpdateMarksModal(matched);
              setUpdateMarksObtained('85');
              setUpdateGrade('A-');
            }}
            className="bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold text-xs py-2 px-3.5 rounded-xl border border-slate-200 transition-all flex items-center gap-1.5"
          >
            <Edit className="w-3.5 h-3.5 text-slate-500" /> Add Results
          </button>
          <button
            onClick={() => setShowReportCardModal(true)}
            className="bg-indigo-50 hover:bg-indigo-100/70 text-indigo-700 font-bold text-xs py-2 px-3.5 rounded-xl border border-indigo-100 transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Generate Performance Summary
          </button>
          <button
            onClick={() => {
              const rData = { platform: "Student Success Platform", totalExams: localExams.length, average: averageExamScore };
              const blob = new Blob([JSON.stringify(rData, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = "Exam_Ledger_dossier.json";
              a.click();
              triggerToast("📉 JSON exam ledger report downloaded!");
            }}
            className="bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs py-2 px-3 rounded-xl border border-slate-200 transition-all"
            title="Download CSV"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. SUMMARY STATISTICS BLOCK */}
      <div id="exam-stats-dashboard-grid" className="grid grid-cols-2 lg:grid-cols-6 gap-3.5">
        
        {/* Card 1: Total Exams */}
        <div className="bg-white border border-slate-250/70 p-4.5 rounded-2xl flex flex-col justify-between shadow-3xs hover:-translate-y-0.5 hover:shadow-2xs transition-all decoration-indigo-200 group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block font-mono">Total Exams</span>
            <span className="p-1 px-1.5 text-[10px] font-bold font-mono text-indigo-600 bg-indigo-50 rounded-md">Unified</span>
          </div>
          <dd className="text-3xl font-black font-mono text-indigo-950 mt-3">{totalExamsCount}</dd>
          <span className="text-[9px] text-slate-400 mt-2 block font-medium">Recorded in ledger files</span>
        </div>

        {/* Card 2: Upcoming Exams */}
        <div className="bg-white border border-slate-250/70 p-4.5 rounded-2xl flex flex-col justify-between shadow-3xs hover:-translate-y-0.5 hover:shadow-2xs transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block font-mono text-amber-600">Upcoming Exams</span>
            <div className="h-2 w-2 rounded-full bg-amber-500 animate-ping" />
          </div>
          <dd className="text-3xl font-black font-mono text-amber-700 mt-3">{upcomingExamsCount}</dd>
          <span className="text-[9px] text-amber-600 mt-2 block font-bold font-mono">Nearest: 5 Days Left</span>
        </div>

        {/* Card 3: Completed Exams */}
        <div className="bg-white border border-slate-250/70 p-4.5 rounded-2xl flex flex-col justify-between shadow-3xs hover:-translate-y-0.5 hover:shadow-2xs transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block font-mono text-emerald-600">Completed Exams</span>
            <Check className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <dd className="text-3xl font-black font-mono text-emerald-700 mt-3">{completedExamsCount}</dd>
          <span className="text-[9px] text-slate-400 mt-2 block font-medium">Evaluations closed</span>
        </div>

        {/* Card 4: Average Score */}
        <div className="bg-white border border-slate-250/70 p-4.5 rounded-2xl flex flex-col justify-between shadow-3xs hover:-translate-y-0.5 hover:shadow-2xs transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block font-mono text-blue-600">Avg Exam Score</span>
            <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
          </div>
          <dd className="text-3xl font-black font-mono text-blue-950 mt-3">{averageExamScore}%</dd>
          <span className="text-[9px] text-emerald-600 mt-2 block font-bold font-mono">▲ +8% over last term</span>
        </div>

        {/* Card 5: Highest Score */}
        <div className="bg-white border border-slate-250/70 p-4.5 rounded-2xl flex flex-col justify-between shadow-3xs hover:-translate-y-0.5 hover:shadow-2xs transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block font-mono text-purple-600">Highest Score</span>
            <Trophy className="w-3.5 h-3.5 text-amber-505" />
          </div>
          <dd className="text-3xl font-black font-mono text-purple-950 mt-3">{highestExamScore}%</dd>
          <span className="text-[9px] text-slate-400 mt-2 block font-medium">CS204 Web App Dev</span>
        </div>

        {/* Card 6: Next Exam Countdown */}
        <div className="bg-gradient-to-br from-indigo-900 to-slate-950 text-white border border-transparent p-4.5 rounded-2xl flex flex-col justify-between shadow-md group relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-24 h-24 bg-indigo-500/10 rounded-full" />
          <div className="flex items-center justify-between relative z-10">
            <span className="text-[10px] font-black text-slate-350 uppercase tracking-widest block font-mono">Next Countdown</span>
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <dd className="text-2xl font-black font-mono mt-3 text-indigo-100">
            5 Days <span className="text-[10px] block font-mono font-medium text-slate-300">Remaining</span>
          </dd>
          <span className="text-[9px] text-indigo-300 mt-2 block font-extrabold font-mono uppercase relative z-10">CS302 Final</span>
        </div>

      </div>

      {/* 3. SAAS SEARCH & FILTERS BOX */}
      <div className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-3xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* Search Input bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search exam subjects, rooms, or codes (e.g. CS302)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-1.5 text-xs outline-none focus:bg-white focus:border-blue-600 text-slate-700 font-medium font-sans"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Dynamic Filters layout */}
        <div className="flex flex-wrap items-center gap-2.5">
          
          {/* Semester Filter */}
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-205 rounded-xl px-2.5 py-1">
            <span className="text-[10px] font-black text-slate-400 font-mono uppercase">Semester:</span>
            <select
              value={semesterFilter}
              onChange={(e) => setSemesterFilter(e.target.value)}
              className="text-xs bg-transparent border-none outline-none font-extrabold text-slate-700 cursor-pointer text-center"
            >
              <option value="all">All Semesters</option>
              <option value="sem-1-2">Semester 1-2</option>
              <option value="sem-3-4">Semester 3-4</option>
              <option value="sem-5">Semester 5 (Active)</option>
            </select>
          </div>

          {/* Subject Filter */}
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-205 rounded-xl px-2.5 py-1">
            <span className="text-[10px] font-black text-slate-400 font-mono uppercase">Subject:</span>
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="text-xs bg-transparent border-none outline-none font-bold text-slate-700 cursor-pointer max-w-[130px]"
            >
              <option value="all">All Subjects</option>
              {uniqueSubjectOptions.map(code => (
                <option key={code} value={code}>{code}</option>
              ))}
            </select>
          </div>

          {/* Classification type filter */}
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-205 rounded-xl px-2.5 py-1">
            <span className="text-[10px] font-black text-slate-400 font-mono uppercase">Type:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="text-xs bg-transparent border-none outline-none font-bold text-slate-700 cursor-pointer"
            >
              <option value="all">All Classifications</option>
              <option value="mid">Mid Exams</option>
              <option value="final">Final Exams</option>
              <option value="practical">Practical Exams / Labs</option>
              <option value="viva">Viva Presentations</option>
            </select>
          </div>

          {/* Clear Filters indicator */}
          {(semesterFilter !== 'all' || subjectFilter !== 'all' || typeFilter !== 'all' || searchQuery !== '') && (
            <button
              onClick={() => {
                setSemesterFilter('all');
                setSubjectFilter('all');
                setTypeFilter('all');
                setSearchQuery('');
              }}
              className="text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors py-1 px-2.5"
            >
              Reset Filters
            </button>
          )}

          {/* Switch Tab buttons (Table / Calendar) */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1 text-xs font-black rounded-lg transition-all ${viewMode === 'table' ? 'bg-white text-slate-800 shadow-3xs' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Table View
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1 text-xs font-black rounded-lg transition-all ${viewMode === 'calendar' ? 'bg-white text-slate-800 shadow-3xs' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Calendar View
            </button>
          </div>

        </div>

      </div>

      {/* 4. MAIN CENTRAL PANEL WITH SWITCHABLE VIEWSTATES */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Main lists or layouts (9 spans) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* CASE A: No data filtered empty state layout */}
          {filteredExams.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center max-w-xl mx-auto space-y-5 shadow-3xs">
              <div className="h-16 w-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto border border-blue-100">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-black text-slate-900 leading-tight">No exams scheduled list results yet.</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                  No exams scheduled yet. Create your first exam schedule to start tracking academic performance.
                </p>
              </div>
              <button
                onClick={() => {
                  setSemesterFilter('all');
                  setSubjectFilter('all');
                  setTypeFilter('all');
                  setSearchQuery('');
                }}
                className="inline-flex bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs py-2 px-5 rounded-xl block mx-auto cursor-pointer"
              >
                Clear Search Filter Settings
              </button>
            </div>
          ) : viewMode === 'table' ? (
            
            /* ================= THE TABLE VIEW ================= */
            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-3xs">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <span className="text-xs font-bold text-slate-800 font-sans block">Exam Schedule Table ({filteredExams.length} results)</span>
                <span className="text-[10px] text-slate-400 font-mono font-medium">Standard index standings loaded</span>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-150 text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono bg-slate-50/70">
                      <th className="px-6 py-3.5">Subject Code</th>
                      <th className="px-6 py-3.5">Subject Name</th>
                      <th className="px-6 py-3.5">Exam Type</th>
                      <th className="px-6 py-3.5">Exam Date &amp; Time</th>
                      <th className="px-6 py-3.5">Venue</th>
                      <th className="px-6 py-3.5 text-center">Score</th>
                      <th className="px-6 py-3.5 text-center">Status</th>
                      <th className="px-6 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs font-sans">
                    {filteredExams.map((ex) => {
                      const colorDef = getExamColorTheme(ex.type);
                      return (
                        <tr 
                          key={ex.id} 
                          className="hover:bg-slate-50/70 transition-all group"
                        >
                          {/* Code */}
                          <td 
                            onClick={(e) => {
                              e.stopPropagation();
                              if (setActiveTab) setActiveTab('subjects');
                            }}
                            className="px-6 py-4.5 font-bold font-mono text-slate-900 group-hover:text-blue-700 transition-colors cursor-pointer hover:underline"
                            title="Navigate to Subject dashboard"
                          >
                            {ex.subjectCode}
                          </td>
                          {/* Subject Name */}
                          <td className="px-6 py-4.5 font-semibold text-slate-800 max-w-[150px] truncate" title={ex.subjectName}>
                            {ex.subjectName}
                          </td>
                          {/* Type */}
                          <td className="px-6 py-4.5">
                            <span className={`inline-block py-0.5 px-2.5 rounded-full text-[10px] font-bold border ${colorDef.bg} ${colorDef.text}`}>
                              {ex.type}
                            </span>
                          </td>
                          {/* Date details */}
                          <td className="px-6 py-4.5">
                            <div className="font-semibold text-slate-700">{ex.date}</div>
                            <div className="text-[10px] text-slate-405 font-mono leading-none mt-1">{ex.timeRange}</div>
                          </td>
                          {/* Venue */}
                          <td className="px-6 py-4.5 text-slate-500 font-medium">
                            {ex.venue}
                          </td>
                          {/* Score and Rank letter */}
                          <td className="px-6 py-4.5 text-center font-mono">
                            {ex.status === 'completed' ? (
                              <div className="inline-flex flex-col items-center">
                                <strong className="text-slate-800 font-extrabold">{ex.score}/100</strong>
                                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded-md font-sans border border-emerald-100 leading-none mt-1">Grade: {ex.grade || 'A-'}</span>
                              </div>
                            ) : (
                              <span className="text-slate-400 font-semibold font-mono">--</span>
                            )}
                          </td>
                          {/* Status code */}
                          <td className="px-6 py-4.5 text-center">
                            <span className={`inline-flex items-center gap-1 font-bold text-[10px] font-mono rounded px-2 py-0.5 border ${ex.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                              <span className={`h-1.5 w-1.5 rounded-full ${ex.status === 'completed' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                              {ex.status === 'completed' ? 'Completed' : 'Upcoming'}
                            </span>
                          </td>
                          {/* Quick Actions buttons */}
                          <td className="px-6 py-4.5 text-right font-mono text-slate-400">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setSelectedExam(ex)}
                                className="bg-slate-50 hover:bg-slate-100 text-slate-650 p-1.5 rounded-lg border border-slate-200 transition-all"
                                title="View Details"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedExam(ex);
                                  setShowUpdateMarksModal(ex);
                                  setUpdateMarksObtained(ex.score ? ex.score.toString() : '85');
                                  setUpdateGrade(ex.grade || 'A-');
                                }}
                                className="bg-slate-50 hover:bg-slate-100 text-slate-650 p-1.5 rounded-lg border border-slate-200 transition-all"
                                title="Edit Marks"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteLocalExam(ex.id)}
                                className="text-slate-350 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-all"
                                title="Delete Exam"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
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
          ) : (
            
            /* ================= THE CALENDAR VIEW ================= */
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-3xs space-y-4">
              
              {/* Calendar control bar */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <h4 className="text-sm font-black text-slate-900 font-sans uppercase">
                    {monthNames[calendarMonth]} {calendarYear}
                  </h4>
                  <span className="text-[9px] font-mono font-extrabold text-blue-700 bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded-full">
                    Schedules map
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button 
                    onClick={handlePrevMonth}
                    className="p-1.5 rounded-lg border border-slate-205 hover:bg-slate-50 text-slate-550 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => { setCalendarMonth(5); setCalendarYear(2026); }}
                    className="text-[10px] font-bold text-slate-500 hover:text-blue-600 px-2.5 transition-colors font-mono"
                  >
                    Today (june 2026)
                  </button>
                  <button 
                    onClick={handleNextMonth}
                    className="p-1.5 rounded-lg border border-slate-205 hover:bg-slate-50 text-slate-550 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Monthly grid */}
              <div className="grid grid-cols-7 gap-1 bg-slate-100 rounded-2xl overflow-hidden border border-slate-100">
                {/* Headers */}
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((dayName) => (
                  <div key={dayName} className="text-center py-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono bg-slate-50 border-b border-slate-100">
                    {dayName}
                  </div>
                ))}

                {/* Days */}
                {daysInMonthList.map((dtObj, idx) => {
                  const dayStr = dtObj.dayNum ? `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${String(dtObj.dayNum).padStart(2, '0')}` : '';
                  const dayExams = localExams.filter(e => e.date === dayStr);

                  return (
                    <div 
                      key={idx}
                      className={`min-h-[90px] bg-white p-2 flex flex-col justify-between border-r border-b border-slate-105/70 relative ${dtObj.dayNum ? 'hover:bg-slate-50/50 cursor-pointer' : 'bg-slate-50/20'}`}
                      onClick={() => {
                        if (dtObj.dayNum) {
                          setAddDate(dayStr);
                          setShowAddModal(true);
                        }
                      }}
                    >
                      <span className={`text-[10px] font-mono font-bold leading-none ${dtObj.isCurrentMonth ? 'text-slate-850' : 'text-slate-300'}`}>
                        {dtObj.dayNum}
                      </span>
                      
                      {/* Miniature Event cards */}
                      <div className="space-y-1 mt-2.5">
                        {dayExams.map(ex => {
                          const themes = getExamColorTheme(ex.type);
                          return (
                            <div
                              key={ex.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedExam(ex);
                              }}
                              className={`p-1 text-[9px] leading-tight font-sans font-bold rounded-md border text-left truncate flex items-center gap-1 hover:brightness-95 transition-all ${themes.bg} ${themes.text}`}
                              title={`${ex.subjectCode} - ${ex.type}`}
                            >
                              <span className={`h-1 w-1 rounded-full shrink-0 ${themes.dot}`} />
                              <span>{ex.subjectCode}: {ex.type.split(' ')[0]}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Color codes legend labels */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2 text-[10px] font-mono text-slate-450 font-bold justify-center border-t border-slate-50 dashed">
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-blue-500" /> Mid Exams (Blue)</span>
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-purple-500" /> Final Exams (Purple)</span>
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Practical Exams (Green)</span>
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-amber-500" /> Viva Exams (Orange)</span>
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-pink-500" /> Assessment Deadlines (Pink)</span>
              </div>

            </div>
          )}

          {/* ================= THE EXAM ANALYTICS SECTION ================= */}
          <div className="bg-white border border-slate-205 rounded-3xl p-6 shadow-3xs space-y-6">
            <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
              <BarChart3 className="text-blue-600 w-5 h-5" /> Academic Exam Analytics Section
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Chart 1: Performance Trend */}
              <div className="bg-slate-50 border border-slate-150 p-4 rounded-2xl flex flex-col justify-between">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-black text-slate-400 uppercase font-mono tracking-widest block">Exam Performance Trend</span>
                  <p className="text-xs text-slate-500">Subject grade scoring averages across semesters.</p>
                </div>
                
                {/* SVG Line Chart */}
                <div className="h-44 w-full mt-4 relative flex items-end">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 400 130">
                    {/* Gridlines */}
                    <line x1="10" y1="10" x2="390" y2="10" stroke="#e2e8f0" strokeDasharray="3,3" />
                    <line x1="10" y1="50" x2="390" y2="50" stroke="#e2e8f0" strokeDasharray="3,3" />
                    <line x1="10" y1="90" x2="390" y2="90" stroke="#e2e8f0" strokeDasharray="3,3" />
                    <line x1="10" y1="120" x2="390" y2="120" stroke="#cbd5e1" strokeWidth="1" />

                    {/* Gradient fill */}
                    <defs>
                      <linearGradient id="trend-gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path 
                      d="M 20,95 L 110,105 L 200,65 L 290,45 L 380,25" 
                      fill="none" 
                      stroke="#4f46e5" 
                      strokeWidth="3.5" 
                      strokeLinecap="round"
                    />
                    <path 
                      d="M 20,95 L 110,105 L 200,65 L 290,45 L 380,25 L 380,120 L 20,120 Z" 
                      fill="url(#trend-gradient)" 
                    />

                    {/* Plot Points */}
                    <circle cx="20" cy="95" r="4" fill="#4f46e5" stroke="white" strokeWidth="1.5" />
                    <circle cx="110" cy="105" r="4" fill="#4f46e5" stroke="white" strokeWidth="1.5" />
                    <circle cx="200" cy="65" r="4" fill="#4f46e5" stroke="white" strokeWidth="1.5" />
                    <circle cx="290" cy="45" r="4" fill="#4f46e5" stroke="white" strokeWidth="1.5" />
                    <circle cx="380" cy="25" r="4" fill="#4f46e5" stroke="white" strokeWidth="1.5" />

                    {/* Text values */}
                    <text x="20" y="80" className="text-[9px] font-mono font-bold" fill="#4f46e5">74%</text>
                    <text x="110" y="90" className="text-[9px] font-mono font-bold" fill="#4f46e5">71%</text>
                    <text x="200" y="50" className="text-[9px] font-mono font-bold" fill="#4f46e5">83%, B</text>
                    <text x="290" y="30" className="text-[9px] font-mono font-bold" fill="#4f46e5">88%, A-</text>
                    <text x="360" y="15" className="text-[9px] font-mono font-bold" fill="#4f46e5">94% (A)</text>
                  </svg>
                </div>
                <div className="flex justify-between text-[8px] font-mono text-slate-400 font-bold uppercase mt-3 px-1.5">
                  <span>Semester 1</span>
                  <span>Semester 2</span>
                  <span>Semester 3</span>
                  <span>Semester 4</span>
                  <span>Semester 5</span>
                </div>
              </div>

              {/* Chart 2: Marks Distribution Donut */}
              <div className="bg-slate-50 border border-slate-150 p-4 rounded-2xl flex flex-col justify-between">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-black text-slate-400 uppercase font-mono tracking-widest block">Marks Distribution</span>
                  <p className="text-xs text-slate-500">Grade distribution coordinates from standard folders.</p>
                </div>

                {/* SVG Donut Chart */}
                <div className="h-44 w-full mt-4 flex items-center justify-around">
                  <svg className="w-28 h-28 transform -rotate-90 overflow-visible" viewBox="0 0 36 36">
                    {/* Ring 1: A Range (65%) */}
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#6366f1" strokeWidth="3.2" strokeDasharray="65 35" strokeDashoffset="0" />
                    {/* Ring 2: B Range (25%) */}
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#3b82f6" strokeWidth="3.2" strokeDasharray="25 75" strokeDashoffset="-65" />
                    {/* Ring 3: Below B (10%) */}
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#ec4899" strokeWidth="3.2" strokeDasharray="10 90" strokeDashoffset="-90" />
                  </svg>

                  <div className="text-[9px] font-mono font-bold text-slate-650 space-y-1.5 self-center">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-indigo-500" />
                      <span>A Grades: 15 Exams (62.5%)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-blue-500" />
                      <span>B Grades: 7 Exams (29.2%)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-pink-500" />
                      <span>Below B: 2 Exams (8.3%)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chart 3: Performance by Subject (Horizontal bar chart) */}
              <div className="bg-slate-50 border border-slate-150 p-4 rounded-2xl space-y-3">
                <span className="text-[10px] font-black text-slate-400 uppercase font-mono tracking-widest block">Performance by Subject</span>
                
                <div className="space-y-2 text-[10px] font-bold">
                  {/* Subject 1 */}
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-700">CS302 Database Systems</span>
                      <span className="font-mono text-indigo-700">92% Average</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-indigo-600 h-full rounded-full" style={{ width: "92%" }} />
                    </div>
                  </div>

                  {/* Subject 2 */}
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-700">SE401 Software Engineering</span>
                      <span className="font-mono text-purple-700">88% Average</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-purple-600 h-full rounded-full" style={{ width: "88%" }} />
                    </div>
                  </div>

                  {/* Subject 3 */}
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-700">CS420 Machine Learning</span>
                      <span className="font-mono text-blue-700">85% Average</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-blue-600 h-full rounded-full" style={{ width: "85%" }} />
                    </div>
                  </div>

                  {/* Subject 4 */}
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-705">CS308 Computer Networks</span>
                      <span className="font-mono text-pink-700">78% Average</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-pink-600 h-full rounded-full" style={{ width: "78%" }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Chart 4: Average Score Comparison */}
              <div className="bg-slate-50 border border-slate-150 p-4 rounded-2xl space-y-3 flex flex-col justify-between">
                <span className="text-[10px] font-black text-slate-400 uppercase font-mono tracking-widest block">Exam vs Assignment Comparison</span>
                
                {/* Visual indicators */}
                <div className="h-28 flex items-end justify-center gap-6 pb-2 border-b border-slate-200">
                  {/* Exams */}
                  <div className="flex flex-col items-center gap-1.5">
                    <span className="text-[10px] font-black text-blue-700 font-mono">82%</span>
                    <div className="w-8 bg-blue-600 rounded-t-lg transition-all hover:brightness-110" style={{ height: "82px" }} />
                    <span className="text-[9px] font-mono text-slate-505">Exams Avg</span>
                  </div>

                  {/* Assignments */}
                  <div className="flex flex-col items-center gap-1.5">
                    <span className="text-[10px] font-black text-purple-700 font-mono">88%</span>
                    <div className="w-8 bg-purple-600 rounded-t-lg transition-all hover:brightness-110" style={{ height: "88px" }} />
                    <span className="text-[9px] font-mono text-slate-505">Assignments Avg</span>
                  </div>

                  {/* Quizzes */}
                  <div className="flex flex-col items-center gap-1.5">
                    <span className="text-[10px] font-black text-emerald-700 font-mono">85%</span>
                    <div className="w-8 bg-emerald-600 rounded-t-lg transition-all hover:brightness-110" style={{ height: "85px" }} />
                    <span className="text-[9px] font-mono text-slate-505">Quizzes Avg</span>
                  </div>
                </div>

                <p className="text-[10px] text-center text-slate-400 font-bold leading-normal">
                  💡 Study loops indicates assignments score +6% higher than exams on average.
                </p>
              </div>

            </div>

          </div>

        </div>

        {/* RIGHT COLUMN: Interactive bento widgets (4 spans) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* A. UPCOMING EXAMS WIDGET */}
          <div className="bg-white border border-slate-205 rounded-3xl p-5 shadow-3xs space-y-4">
            <h4 className="text-sm font-black text-slate-905 flex items-center gap-1.5 pb-2.5 border-b border-slate-100">
              <Clock className="w-4 h-4 text-amber-500 shrink-0" /> Upcoming Exams Widget
            </h4>
            
            <div className="space-y-3">
              {localExams.filter(e => e.status === 'upcoming').slice(0, 3).map((ex) => {
                const days = ex.daysRemaining || 5;
                const progressWidth = Math.max(10, 100 - (days * 2));
                return (
                  <div 
                    key={ex.id}
                    onClick={() => setSelectedExam(ex)}
                    className="group border border-slate-150 p-3 rounded-xl bg-slate-50/50 hover:bg-slate-50 hover:border-blue-200 transition-all cursor-pointer flex flex-col gap-2"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-0.5 min-w-0">
                        <strong className="text-xs text-slate-805 group-hover:text-blue-700 transition-all font-black truncate block">{ex.subjectName} Final</strong>
                        <span className="text-[9px] font-mono font-bold text-slate-400">{ex.subjectCode} • {ex.type}</span>
                      </div>
                      <span className="text-[9px] font-mono font-bold bg-amber-50 text-amber-700 border border-amber-100 px-1.5 py-0.5 rounded shrink-0">
                        {days} Days Remaining
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[8px] text-slate-400 font-mono">
                        <span>Preparation Tracker Meter</span>
                        <span>{progressWidth}% Done</span>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-indigo-600 h-full rounded-full transition-all" style={{ width: `${progressWidth}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* B. STUDY PLANNER WIDGET */}
          <div className="bg-white border border-slate-205 rounded-3xl p-5 shadow-3xs space-y-4">
            <h4 className="text-sm font-black text-slate-900 flex items-center gap-1.5 pb-2.5 border-b border-slate-100">
              <Layers className="w-4.5 h-4.5 text-blue-600" /> Study Planner Widget
            </h4>

            {/* Micro logs display */}
            <div className="flex items-center gap-4 bg-slate-50 border border-slate-150 p-3.5 rounded-2xl">
              <div className="relative h-12 w-12 shrink-0">
                <svg transform="rotate(-90)" viewBox="0 0 36 36" className="w-12 h-12">
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f1f5f9" strokeWidth="4" />
                  <circle 
                    cx="18" 
                    cy="18" 
                    r="15.915" 
                    fill="none" 
                    stroke="#4f46e5" 
                    strokeWidth="4" 
                    strokeDasharray="100" 
                    strokeDashoffset={100 - Math.round((loggedStudyHours / totalPlannedStudyHours) * 100)} 
                    strokeLinecap="round"
                    className="transition-all"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center font-mono font-bold text-[10px] text-slate-900">
                  {Math.round((loggedStudyHours / totalPlannedStudyHours) * 100)}%
                </div>
              </div>

              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">Completed Study Hours</span>
                <strong className="text-base font-black text-slate-900 block leading-tight mt-0.5">{loggedStudyHours} hrs / {totalPlannedStudyHours} hrs</strong>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-150">
                <strong className="block text-[10px] uppercase font-mono font-extrabold text-blue-700">Weekly Goal</strong>
                <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                  "Complete 15 hours of Database Systems SQL optimization practices and review write-ahead logs."
                </p>
              </div>

              <button
                onClick={() => {
                  setLoggedStudyHours(prev => Math.min(prev + 2, totalPlannedStudyHours));
                  triggerToast("⚡ Good work! Added +2 hours of focused exam studying.");
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-2 px-3 rounded-xl transition-all shadow-xs text-center block cursor-pointer"
              >
                +2 Hours Studied Today
              </button>
            </div>
          </div>

          {/* C. PERFORMANCE INSIGHTS PANEL */}
          <div className="bg-white border border-slate-205 rounded-3xl p-5 shadow-3xs space-y-4">
            <h4 className="text-sm font-black text-slate-900 flex items-center gap-1.5 pb-2.5 border-b border-slate-100">
              <Sparkles className="w-4.5 h-4.5 text-indigo-500" /> Performance Insights Panel
            </h4>

            <div className="space-y-3 font-medium text-xs text-slate-700">
              <div className="flex gap-2 rounded-xl p-2.5 bg-emerald-50 text-emerald-800 border border-emerald-100">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed text-[11px]"><strong>Database Systems</strong> is your strongest exam subject. High consistency.</p>
              </div>

              <div className="flex gap-2 rounded-xl p-2.5 bg-amber-50 text-amber-805 border border-amber-100">
                <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed text-[11px]"><strong>Computer Networks</strong> requires additional revision logic study modules.</p>
              </div>

              <div className="flex gap-2 rounded-xl p-2.5 bg-indigo-50 text-indigo-850 border border-indigo-100">
                <TrendingUp className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                <p className="leading-relaxed text-[11px]">Your average final exam score improved by 8% this semester over previous parameters.</p>
              </div>

              <div className="flex gap-2 rounded-xl p-2.5 bg-blue-50 text-blue-800 border border-blue-100">
                <Award className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <p className="leading-relaxed text-[11px]">Maintaining current performance can increase CGPA by 0.12 index points.</p>
              </div>
            </div>
          </div>

          {/* D. GRADE DISTRIBUTION SECTION */}
          <div className="bg-white border border-slate-205 rounded-3xl p-5 shadow-3xs space-y-4">
            <h4 className="text-sm font-black text-slate-805 flex items-center gap-1.5 pb-2.5 border-b border-slate-100">
              <Trophy className="w-4 h-4 text-amber-501 shrink-0" /> Grade Distribution Section
            </h4>

            {/* Distribution metrics as horizontal bars */}
            <div className="space-y-2.5 text-xs font-semibold">
              {[
                { label: "A+", Count: 4, color: "bg-blue-600" },
                { label: "A", Count: 6, color: "bg-indigo-600" },
                { label: "A-", Count: 5, color: "bg-purple-600" },
                { label: "B+", Count: 4, color: "bg-emerald-600" },
                { label: "B", Count: 3, color: "bg-pink-600" },
                { label: "Below B", Count: 2, color: "bg-slate-400" },
              ].map((g) => (
                <div key={g.label} className="space-y-1 text-[11px]">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-slate-800 font-extrabold">{g.label} Grade Group</span>
                    <span className="font-mono text-slate-405">{g.Count} Exams</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className={`${g.color} h-full rounded-full`} style={{ width: `${(g.Count / 6) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* ================= MODAL: ADD EXAM ================= */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl animate-scale-up">
            
            {/* Modal header */}
            <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <Layers className="text-blue-600 w-5 h-5" />
                <h4 className="text-base font-black text-slate-900">Schedule New Exam</h4>
              </div>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-650 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal body */}
            <form onSubmit={handleAddLocalExam} className="p-6 space-y-4">
              
              <div className="grid grid-cols-2 gap-4">
                
                {/* Subject picker dropdown */}
                <div className="col-span-2 space-y-1">
                  <label className="text-xs text-slate-650 font-bold block">Course Subject Academic Area</label>
                  <select
                    value={addSubjectId}
                    onChange={(e) => setAddSubjectId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:bg-white focus:border-blue-600 text-slate-700 font-bold"
                    required
                  >
                    <option value="">Select course unit</option>
                    {subjects.map(s => (
                      <option key={s.id} value={s.id}>{s.code} - {s.name}</option>
                    ))}
                    <option value="sub-custom">CS315 - Advanced Computational Algorithms</option>
                  </select>
                </div>

                {/* Exam Type input */}
                <div className="space-y-1">
                  <label className="text-xs text-slate-650 font-bold block">Exam Type Classification</label>
                  <select
                    value={addType}
                    onChange={(e) => setAddType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:bg-white focus:border-blue-600 text-slate-700 font-bold"
                  >
                    <option value="Mid Exam">Mid Exam</option>
                    <option value="Final Exam">Final Exam</option>
                    <option value="Practical Exam">Practical Exam</option>
                    <option value="Viva Presentation">Viva Presentation</option>
                    <option value="Assessment Deadline">Assessment Deadline</option>
                  </select>
                </div>

                {/* Date */}
                <div className="space-y-1">
                  <label className="text-xs text-slate-650 font-bold block">Exam Date</label>
                  <input
                    type="date"
                    value={addDate}
                    onChange={(e) => setAddDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:bg-white focus:border-blue-600 text-slate-700 font-mono font-semibold"
                    required
                  />
                </div>

                {/* Start Time */}
                <div className="space-y-1">
                  <label className="text-xs text-slate-650 font-bold block">Start Time</label>
                  <input
                    type="text"
                    value={addStartTime}
                    onChange={(e) => setAddStartTime(e.target.value)}
                    placeholder="e.g. 09:00 AM"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:bg-white focus:border-blue-600 text-slate-700 font-semibold"
                    required
                  />
                </div>

                {/* Duration */}
                <div className="space-y-1">
                  <label className="text-xs text-slate-650 font-bold block">Duration</label>
                  <input
                    type="text"
                    value={addDuration}
                    onChange={(e) => setAddDuration(e.target.value)}
                    placeholder="e.g. 3 Hours"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:bg-white focus:border-blue-600 text-slate-700 font-semibold"
                    required
                  />
                </div>

                {/* Venue */}
                <div className="space-y-1">
                  <label className="text-xs text-slate-650 font-bold block">Exam Hall Venue</label>
                  <input
                    type="text"
                    value={addVenue}
                    onChange={(e) => setAddVenue(e.target.value)}
                    placeholder="e.g. Lab 04 / Hall A"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:bg-white focus:border-blue-600 text-slate-700 font-semibold"
                    required
                  />
                </div>

                {/* Total Marks */}
                <div className="space-y-1">
                  <label className="text-xs text-slate-650 font-bold block">Total Marks Weight</label>
                  <input
                    type="text"
                    value={addTotalMarks}
                    onChange={(e) => setAddTotalMarks(e.target.value)}
                    placeholder="100"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:bg-white focus:border-blue-600 text-slate-700 font-mono font-semibold"
                    required
                  />
                </div>

                {/* Description */}
                <div className="col-span-2 space-y-1">
                  <label className="text-xs text-slate-650 font-bold block">Additional Instructions Description</label>
                  <textarea
                    value={addDescription}
                    onChange={(e) => setAddDescription(e.target.value)}
                    placeholder="e.g. Bring scientific calculator, approved reference sheet, and student identity credentials..."
                    rows={2}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:bg-white focus:border-blue-600 text-slate-700 font-medium"
                  />
                </div>

              </div>

              {/* Action buttons */}
              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-extrabold text-xs py-2.5 rounded-xl cursor-pointer text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs py-2.5 rounded-xl text-center shadow-xs cursor-pointer"
                >
                  Save Exam
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ================= MODAL: UPDATE MARKS AND DETAILS ================= */}
      {showUpdateMarksModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl animate-scale-up">
            
            {/* Modal header */}
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-1.5">
                <Award className="text-emerald-600 w-4.5 h-4.5" />
                <strong className="text-sm font-black text-slate-900">Update Marks Ledger</strong>
              </div>
              <button 
                onClick={() => setShowUpdateMarksModal(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body form */}
            <form onSubmit={handleUpdateLocalMarksSubmit} className="p-5 space-y-4 text-xs">
              
              <div className="text-center bg-slate-50 border border-slate-150 p-3 rounded-2xl space-y-0.5">
                <span className="text-[9px] font-mono font-bold text-slate-400 uppercase">Selected Target</span>
                <h4 className="font-extrabold text-slate-800">{showUpdateMarksModal.subjectCode} - {showUpdateMarksModal.subjectName}</h4>
                <p className="text-[10px] text-slate-400 font-mono font-medium">{showUpdateMarksModal.type}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-655 font-bold block">Marks Obtained (0-100)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={updateMarksObtained}
                    onChange={(e) => setUpdateMarksObtained(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-mono font-extrabold outline-indigo-500"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-655 font-bold block">Grade standing</label>
                  <select
                    value={updateGrade}
                    onChange={(e) => setUpdateGrade(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-extrabold outline-indigo-500"
                  >
                    <option value="A+">A+</option>
                    <option value="A">A</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B">B</option>
                    <option value="B-">B-</option>
                    <option value="C+">C+</option>
                    <option value="C">C</option>
                    <option value="Below C">Below C</option>
                  </select>
                </div>

                <div className="col-span-2 space-y-1">
                  <label className="text-slate-655 font-bold block">Feedback Comments</label>
                  <input
                    type="text"
                    value={updateFeedback}
                    onChange={(e) => setUpdateFeedback(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-semibold"
                    required
                  />
                </div>

                <div className="col-span-2 space-y-1">
                  <label className="text-slate-655 font-bold block">Personal Exam Study Notes</label>
                  <input
                    type="text"
                    value={updateNotes}
                    onChange={(e) => setUpdateNotes(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-semibold"
                    required
                  />
                </div>
              </div>

              {/* trigger buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUpdateMarksModal(null)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-extrabold text-xs py-2 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-2 rounded-xl shadow-xs"
                >
                  Save Results
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ================= MODAL: GENERATED SMART REPORT SUMMARY ================= */}
      {showReportCardModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl animate-scale-up">
            
            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <Sparkles className="text-indigo-600 w-5 h-5 animate-pulse" />
                <h4 className="text-sm font-black text-slate-900 font-sans tracking-tight">Dynamic AI Performance Summary</h4>
              </div>
              <button onClick={() => setShowReportCardModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Generated Body Content */}
            <div className="p-5 space-y-4 text-xs leading-relaxed text-slate-700">
              <div className="p-3 bg-indigo-50/40 border border-indigo-100 rounded-2xl space-y-1">
                <span className="text-[8px] font-bold font-mono text-indigo-700 block uppercase tracking-widest">Platform Core Insight</span>
                <strong className="text-xs text-indigo-950 font-black block leading-none">Database Systems standing is at 92% average</strong>
                <p className="text-[10px] text-slate-505">Maintain this high efficiency to lock first-class classification honours.</p>
              </div>

              <div id="summary-points-report-list" className="space-y-2.5">
                <div className="flex gap-2 items-start">
                  <span className="p-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 font-bold mt-0.5 font-sans leading-none text-[8px]">✔</span>
                  <div>
                    <strong className="text-[11px] text-slate-900 block font-black">Average Final Exam Standing</strong>
                    <span className="text-slate-505 block leading-relaxed text-[11px]">Your average final exam score improved by 8% this semester across all computational course units.</span>
                  </div>
                </div>

                <div className="flex gap-2 items-start">
                  <span className="p-1 rounded-full bg-blue-50 border border-blue-105 text-blue-600 font-bold mt-0.5 font-sans leading-none text-[8px]">i</span>
                  <div>
                    <strong className="text-[11px] text-slate-900 block font-black">Computer Networks Revision alert</strong>
                    <span className="text-slate-505 block leading-relaxed text-[11px]">Computer Networks requires additional study loops. Review routing matrices and sliding window protocols.</span>
                  </div>
                </div>

                <div className="flex gap-2 items-start">
                  <span className="p-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 font-bold mt-0.5 font-sans leading-none text-[8px]">🌟</span>
                  <div>
                    <strong className="text-[11px] text-slate-900 block font-black">Grade Distribution Index</strong>
                    <span className="text-slate-505 block leading-relaxed text-[11px]">You have maintained 15 exam credits within the A range (A+, A, A-), holding strong academic standings.</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-400 font-mono font-medium">Export Date: June 22, 2026</span>
                <button
                  onClick={() => {
                    window.print();
                  }}
                  className="text-xs font-black text-indigo-700 hover:text-indigo-900 flex items-center gap-1 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" /> Print Dossier
                </button>
              </div>
            </div>

            <div className="bg-slate-50 px-5 py-3 border-t border-slate-100 text-right">
              <button
                onClick={() => setShowReportCardModal(false)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs py-1.5 px-4 rounded-xl cursor-pointer"
              >
                Dismiss Summary
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ================= RIGHT DETAILS DRAWER ================= */}
      {selectedExam && (
        <>
          {/* Backdrop screen fog */}
          <div 
            onClick={() => setSelectedExam(null)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-3xs z-40 transition-opacity"
          />

          {/* Drawer Body container */}
          <div id="exam-details-slide-drawer" className="fixed right-0 top-0 h-full w-full max-w-sm bg-white border-l border-slate-200 shadow-2xl z-50 transform transition-transform duration-300 overflow-y-auto font-sans text-xs">
            
            {/* Header row */}
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[8px] font-black font-mono text-slate-400 uppercase tracking-widest block">Exam Details Dossier</span>
                <strong className="text-sm font-black text-slate-950 block">{selectedExam.subjectCode} - {selectedExam.subjectName}</strong>
              </div>
              <button 
                onClick={() => setSelectedExam(null)}
                className="p-1 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-650"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-6">
              
              {/* Profile details block */}
              <div className="space-y-3.5">
                <h5 className="text-[10px] font-black font-mono text-blue-700 uppercase tracking-widest border-s-2 border-blue-600 pl-2">Exam Information Specs</h5>
                
                <div className="bg-slate-50 border border-slate-150 p-3.5 rounded-2xl grid grid-cols-2 gap-3 font-semibold text-slate-700">
                  <div>
                    <span className="text-[9px] text-slate-400 block font-bold leading-normal font-mono">EXAM CLASSIFICATION</span>
                    <span className="text-11px font-extrabold text-slate-900">{selectedExam.type}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block font-bold leading-normal font-mono">EXAM VENUE HALL</span>
                    <span className="text-11px font-extrabold text-slate-900">{selectedExam.venue}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[9px] text-slate-400 block font-bold leading-normal font-mono">SCHEDULE TIME RANGE</span>
                    <span className="text-11px font-extrabold text-slate-900">{selectedExam.date} | {selectedExam.timeRange}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block font-bold leading-normal font-mono">MAX score weight</span>
                    <span className="text-11px font-mono text-slate-900">100 Marks</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block font-bold leading-normal font-mono">STATUS METRIC</span>
                    <span className="text-11px font-mono text-slate-900 capitalize">{selectedExam.status}</span>
                  </div>
                </div>
              </div>

              {/* Performance Section */}
              <div className="space-y-3.5">
                <h5 className="text-[10px] font-black font-mono text-purple-700 uppercase tracking-widest border-s-2 border-purple-600 pl-2">Performance Section Results</h5>
                
                <div className="bg-purple-50/50 border border-purple-100 p-3.5 rounded-2xl flex items-center justify-between">
                  {selectedExam.status === 'completed' ? (
                    <>
                      <div>
                        <span className="text-[8px] text-purple-400 font-bold block font-mono">MARKS EVALUATION STANDINGS</span>
                        <strong className="text-2xl font-black font-mono text-indigo-950">{selectedExam.score} / 100</strong>
                      </div>
                      <div className="text-right">
                        <span className="text-[18px] font-black text-indigo-900 bg-white border border-purple-200 shadow-3xs px-3 py-1 rounded-xl">
                          {selectedExam.grade || 'A-'}
                        </span>
                        <div className="text-[8.5px] text-indigo-400 font-bold font-mono mt-1.5 uppercase leading-none">GPA IMPACT: 3.70</div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-2 w-full text-purple-650 font-bold">
                      <span className="block">Pending performance evaluation.</span>
                      <button
                        onClick={() => {
                          setShowUpdateMarksModal(selectedExam);
                          setUpdateMarksObtained('85');
                          setUpdateGrade('A-');
                        }}
                        className="mt-2 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-[10px] py-1 px-3.5 rounded-lg inline-block"
                      >
                        Input Score Results
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Progress Tracker Slider Section */}
              <div className="space-y-3.5">
                <h5 className="text-[10px] font-black font-mono text-emerald-700 uppercase tracking-widest border-s-2 border-emerald-600 pl-2">Exam Preparation Progress</h5>
                
                <div className="bg-slate-50 border border-slate-150 p-3.5 rounded-2xl space-y-3 font-semibold">
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span>Study Completion Percentage</span>
                      <strong className="font-mono text-blue-700">85%</strong>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-blue-600 h-full rounded-full" style={{ width: "85%" }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span>Revision Progress Details</span>
                      <strong className="font-mono text-purple-700">70%</strong>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-purple-600 h-full rounded-full" style={{ width: "70%" }} />
                    </div>
                  </div>

                  {/* Remaining Topics list */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-200">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">Remaining Syllabus Topics check</span>
                    {[
                      { key: `${selectedExam.subjectCode}-t1`, label: "Write-Ahead Logging protocol files" },
                      { key: `${selectedExam.subjectCode}-t2`, label: "B-Tree Indices and multi-indexing locks" },
                      { key: `${selectedExam.subjectCode}-t3`, label: "Relational Calculus & optimized join algorithms" },
                    ].map((topic) => (
                      <label key={topic.key} className="flex items-center gap-2 text-[11px] text-slate-705 py-0.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!!checkedPrepTopics[topic.key]}
                          onChange={(e) => {
                            setCheckedPrepTopics({ ...checkedPrepTopics, [topic.key]: e.target.checked });
                          }}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
                        />
                        <span className={checkedPrepTopics[topic.key] ? 'line-through text-slate-400 font-medium' : 'font-semibold'}>{topic.label}</span>
                      </label>
                    ))}
                  </div>

                </div>
              </div>

              {/* Study Notes & resources links */}
              <div className="space-y-3.5">
                <h5 className="text-[10px] font-black font-mono text-pink-700 uppercase tracking-widest border-s-2 border-pink-500 pl-2">Study Notes &amp; Resources</h5>
                
                <div className="bg-slate-50 border border-slate-150 p-3.5 rounded-2xl space-y-3">
                  <div className="space-y-1.5">
                    <strong className="text-[10px] text-slate-450 block uppercase font-mono tracking-widest">Exam Notes</strong>
                    <p className="text-[11px] text-slate-600 leading-relaxed font-semibold">
                      "Make sure to review lecture 08 locking structures. Keep calculator batteries ready. 40% grade coefficient impact."
                    </p>
                  </div>

                  <div className="space-y-1 pt-1.5 border-t border-slate-200">
                    <strong className="text-[10px] text-slate-450 block uppercase font-mono tracking-widest mb-1">Study Materials</strong>
                    <div className="space-y-1.5 text-[11px] font-extrabold text-blue-700">
                      <a href="#" onClick={(e) => { e.preventDefault(); triggerToast("📂 PDF resources copy opened in sandbox tab!"); }} className="flex items-center gap-1.5 hover:underline">
                        <FileText className="w-3.5 h-3.5 text-slate-400" /> Standard Database Index cheat sheet.pdf
                      </a>
                      <a href="#" onClick={(e) => { e.preventDefault(); triggerToast("📂 Slide slides folder directory loaded!"); }} className="flex items-center gap-1.5 hover:underline">
                        <FileText className="w-3.5 h-3.5 text-slate-400" /> Lecture 08 Locking slide guidelines.ppt
                      </a>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Quick Action footer */}
            <div className="bg-slate-50/50 p-4 border-t border-slate-150 flex gap-2">
              <button
                onClick={() => {
                  setShowUpdateMarksModal(selectedExam);
                  setUpdateMarksObtained(selectedExam.score ? selectedExam.score.toString() : '85');
                  setUpdateGrade(selectedExam.grade || 'A-');
                }}
                className="flex-1 bg-slate-900 hover:bg-slate-950 text-white font-extrabold py-2 px-3 rounded-xl text-center shadow"
              >
                Edit Score Records
              </button>
              <button
                onClick={() => setSelectedExam(null)}
                className="flex-1 bg-white hover:bg-slate-100 text-slate-700 font-bold py-2 px-3 rounded-xl border border-slate-200 text-center"
              >
                Cancel View
              </button>
            </div>

          </div>
        </>
      )}

    </div>
  );
};
