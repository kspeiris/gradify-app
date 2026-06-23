import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  BookOpen, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Plus, 
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Award,
  Sparkles,
  BookmarkPlus,
  Target,
  ArrowUpRight,
  ChevronRight,
  ListTodo,
  CalendarDays,
  Flame,
  BrainCircuit,
  Calculator,
  Play,
  Pause,
  RotateCcw,
  BellRing
} from 'lucide-react';
import { Semester, Subject, Assignment, Exam, AcademicGoal } from '../types';

interface DashboardViewProps {
  semesters: Semester[];
  subjects: Subject[];
  assignments: Assignment[];
  exams: Exam[];
  goals: AcademicGoal[];
  profile: any;
  currentSemesterId: string;
  setActiveTab: (tab: string) => void;
  onAddQuickAssignment: (title: string, subjectId: string, dueDate: string, priority: 'low' | 'medium' | 'high' | 'critical', isGroup: boolean) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  semesters,
  subjects,
  assignments,
  exams,
  goals,
  profile,
  currentSemesterId,
  setActiveTab,
  onAddQuickAssignment
}) => {
  const [quickTitle, setQuickTitle] = useState('');
  const [selectedSub, setSelectedSub] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'critical'>('high');
  const [isGroup, setIsGroup] = useState(false);
  const [quickAddSuccess, setQuickAddSuccess] = useState(false);

  // --- Study Progress Tracker (Pomodoro Widget) state ---
  const [studyTimer, setStudyTimer] = useState(1500); // 25 minutes default
  const [studyRunning, setStudyRunning] = useState(false);
  const [focusBlocksCompleted, setFocusBlocksCompleted] = useState(3);
  const [streakDays, setStreakDays] = useState(14);

  useEffect(() => {
    let interval: any = null;
    if (studyRunning) {
      interval = setInterval(() => {
        setStudyTimer((prev) => {
          if (prev <= 1) {
            setStudyRunning(false);
            setFocusBlocksCompleted(f => f + 1);
            return 1500; // Reset
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [studyRunning]);

  const toggleStudyTimer = () => setStudyRunning(!studyRunning);
  const resetStudyTimer = () => {
    setStudyRunning(false);
    setStudyTimer(1500);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Active Semester Data
  const currentSemester = semesters.find(s => s.id === currentSemesterId) || semesters[4] || semesters[semesters.length - 1];
  const activeSemesterSubjects = subjects.filter(sub => sub.semesterId === currentSemesterId);
  const activeSubjectIds = activeSemesterSubjects.map(s => s.id);

  // Filter schedules
  const upcomingExams = exams
    .filter(e => activeSubjectIds.includes(e.subjectId) || e.status === 'upcoming')
    .slice(0, 3);

  const activeAssignments = assignments
    .filter(a => a.status !== 'completed' && a.status !== 'overdue')
    .sort((a,b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  const overdueAssignments = assignments.filter(a => a.status === 'overdue');

  const completedAssignmentsCount = assignments.filter(a => a.status === 'completed').length;
  const totalAssignmentsCount = assignments.length;
  const assignmentCompletionRate = totalAssignmentsCount > 0 
    ? Math.round((completedAssignmentsCount / totalAssignmentsCount) * 100) 
    : 100;

  // GPA Trend data (Semester 1 to Semester 5 + Goal Semester 6)
  const gpaTrend = [
    { name: 'Sem 1', gpa: 3.52 },
    { name: 'Sem 2', gpa: 3.65 },
    { name: 'Sem 3', gpa: 3.60 },
    { name: 'Sem 4', gpa: 3.70 },
    { name: 'Sem 5', gpa: 3.72 },
    { name: 'Sem 6 (Goal)', gpa: 3.80 }
  ];

  // Productivity per weekday
  const productivityHours = [
    { day: "Mon", hours: 4.8 },
    { day: "Tue", hours: 6.5 },
    { day: "Wed", hours: 3.2 },
    { day: "Thu", hours: 5.8 },
    { day: "Fri", hours: 7.2 },
    { day: "Sat", hours: 2.0 },
    { day: "Sun", hours: 4.5 }
  ];

  const handleQuickAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle || !selectedSub) return;
    
    let finalDueDate = dueDate;
    if (!finalDueDate) {
      const date = new Date();
      date.setDate(date.getDate() + 5);
      finalDueDate = date.toISOString().split('T')[0];
    }

    onAddQuickAssignment(quickTitle, selectedSub, finalDueDate, priority, isGroup);
    setQuickTitle('');
    setDueDate('');
    setIsGroup(false);
    setQuickAddSuccess(true);
    setTimeout(() => setQuickAddSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Hero Section */}
      <div id="dashboard-hero" className="bg-gradient-to-r from-primary to-secondary text-white rounded-3xl p-8 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Trophy className="w-48 h-48" />
        </div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-inverse-on-surface mb-4">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" /> Active Academic Status: Excellent
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">
            Welcome back, {profile.name} 👋
          </h1>
          <p className="text-white/80 text-sm md:text-base mt-2 max-w-xl">
            Here's your Academic Progress Overview. You are making phenomenal headway this semester keeping on track with your full presidential scholarship goals.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-4 pt-5 border-t border-white/10">
            <div className="flex-1">
              <div className="flex justify-between items-center text-xs font-semibold text-white/90 mb-1.5">
                <span>Semester progress indicator</span>
                <span>Week 12 of 16 (75% Complete)</span>
              </div>
              <div className="w-full bg-white/10 h-2 bg-slate-900/40 rounded-full overflow-hidden">
                <div 
                  className="bg-white h-2 rounded-full transition-all duration-500" 
                  style={{ width: '75%' }}
                ></div>
              </div>
            </div>
            <div className="shrink-0 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl flex items-center gap-2">
              <Calendar className="w-4 h-4 text-white/90" />
              <span className="text-xs font-bold font-mono tracking-wide">{currentSemester.name}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards Row */}
      <div id="stats-cards-row" className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        
        {/* 1. Current GPA */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Current GPA</span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
              ▲ 3.72
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 font-mono">3.72</div>
            <p className="text-[10px] text-slate-400 font-medium mt-1">Excellent Honor Range</p>
          </div>
        </div>

        {/* 2. Target GPA */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Target GPA</span>
            <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-1 py-0.5 rounded-md">
              Goal: 3.80
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 font-mono">3.80</div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: '97.8%' }}></div>
            </div>
          </div>
        </div>

        {/* 3. Pending Assignments */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Assignments</span>
            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
              {activeAssignments.length} Pending
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 font-mono">{activeAssignments.length}</div>
            <p className="text-[10px] text-red-500 font-semibold truncate mt-1">
              {overdueAssignments.length > 0 ? `⚠️ ${overdueAssignments.length} Overdue!` : "No overdue items"}
            </p>
          </div>
        </div>

        {/* 4. Upcoming Exams */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Upcoming Exams</span>
            <span className="text-[9px] font-black font-mono text-emerald-600 bg-emerald-50 px-1 rounded">
              Active
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 font-mono">{upcomingExams.length}</div>
            <p className="text-[10px] text-slate-400 font-medium truncate mt-1">First starts June 29</p>
          </div>
        </div>

        {/* 5. Total Subjects */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Subjects</span>
            <span className="text-[10px] font-sans font-bold text-slate-500">
              {activeSemesterSubjects.length} Courses
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 font-mono">6</div>
            <p className="text-[10px] text-slate-400 font-medium mt-1">21 Credits allocated</p>
          </div>
        </div>

        {/* 6. Completed Tasks */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Completed Tasks</span>
            <span className="text-[10px] font-mono text-emerald-600 font-bold bg-emerald-50 px-1 rounded">
              {assignmentCompletionRate}%
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 font-mono">{completedAssignmentsCount}</div>
            <p className="text-[10px] text-slate-400 font-medium mt-1">Out of {totalAssignmentsCount} recorded total</p>
          </div>
        </div>

      </div>

      {/* Charts section: GPA trend + Assignment completion donut */}
      <div id="charts-row" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* GPA Trend line chart card */}
        <div id="chart-gpa-trend" className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800">GPA Trend by Semester</h3>
              <p className="text-xs text-slate-400">Trajectory towards B.Sc graduation target</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-primary rounded-full"></span> GPA Scores</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-emerald-400 rounded-full"></span> Target (3.80)</span>
            </div>
          </div>

          {/* Interactive and custom visual SVG Line Chart */}
          <div className="relative pt-6">
            <svg viewBox="0 0 500 160" className="w-full h-40 overflow-visible">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0058be" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#0058be" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1="120" x2="500" y2="120" stroke="#f1f2f4" strokeWidth="1" strokeDasharray="4 2" />
              <line x1="0" y1="80" x2="500" y2="80" stroke="#f1f2f4" strokeWidth="1" strokeDasharray="4 2" />
              <line x1="0" y1="40" x2="500" y2="40" stroke="#f1f2f4" strokeWidth="1" strokeDasharray="4 2" />

              {/* Axis Label GPA benchmarks */}
              <text x="-5" y="123" textAnchor="end" fill="#94a3b8" className="text-[9px] font-mono">3.4</text>
              <text x="-5" y="83" textAnchor="end" fill="#94a3b8" className="text-[9px] font-mono">3.6</text>
              <text x="-5" y="43" textAnchor="end" fill="#94a3b8" className="text-[9px] font-mono">3.8</text>

              {/* Target constant reference line */}
              <line x1="0" y1="40" x2="500" y2="40" stroke="#34d399" strokeWidth="1.5" strokeDasharray="5 5" opacity="0.8" />

              {/* Gradient Peak and Line formulation */}
              {/* Plot Coordinates calculations:
                  S1: (20, 105)
                  S2: (116, 73)
                  S3: (212, 85)
                  S4: (308, 61)
                  S5: (404, 56)
                  S6: (500, 40)
              */}
              <path 
                d="M 20,105 Q 116,73 212,85 T 404,56 L 500,40"
                fill="none"
                stroke="#0058be"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              <path 
                d="M 20,105 Q 116,73 212,85 T 404,56 L 500,40 L 500,160 L 20,160 Z"
                fill="url(#chartGradient)"
                opacity="1"
              />

              {/* Individual dots with tooltips and hover triggers */}
              {gpaTrend.map((pt, i) => {
                const x = 20 + i * 95;
                const scoreY = 160 - ((pt.gpa - 3.2) * 200); // normalized coordinates
                return (
                  <g key={i} className="group cursor-pointer">
                    <circle 
                      cx={x} 
                      cy={scoreY} 
                      r="4.5" 
                      fill="#ffffff"
                      stroke="#0058be"
                      strokeWidth="3"
                      className="transition-all duration-150 group-hover:r-[6.5px] group-hover:fill-primary"
                    />
                    {/* Floating score label */}
                    <text 
                      x={x} 
                      y={scoreY - 10} 
                      textAnchor="middle" 
                      fill="#0b1c30" 
                      className="text-[10px] font-bold font-mono bg-white"
                    >
                      {pt.gpa.toFixed(2)}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* X-Axis labels */}
            <div className="flex justify-between px-2 pt-2 border-t border-slate-100 font-mono text-[9px] font-semibold text-slate-400">
              {gpaTrend.map((pt, i) => (
                <div key={i} className="text-center">{pt.name}</div>
              ))}
            </div>
          </div>
        </div>

        {/* Assignment Completion rate donut chart */}
        <div id="chart-assignment-donut" className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Assignment Completion</h3>
            <p className="text-xs text-slate-400">Term workload balance percentage</p>
          </div>

          <div className="my-5 flex items-center justify-center relative">
            {/* Round progress indicator circle */}
            <svg width="150" height="150" className="transform -rotate-90">
              <circle
                cx="75"
                cy="75"
                r="60"
                stroke="#f1f5f9"
                strokeWidth="14"
                fill="transparent"
              />
              <circle
                cx="75"
                cy="75"
                r="60"
                stroke="#6b38d4"
                strokeWidth="14"
                fill="transparent"
                strokeDasharray={`${2 * Math.PI * 60}`}
                strokeDashoffset={`${2 * Math.PI * 60 * (1 - assignmentCompletionRate / 100)}`}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-3xl font-black text-slate-800 font-mono">{assignmentCompletionRate}%</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-0.5">Finished</span>
            </div>
          </div>

          {/* Quick Stats legend */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono pt-3 border-t border-slate-50">
            <div>
              <span className="block font-bold text-purple-600">{completedAssignmentsCount}</span>
              <span className="text-[9px] text-slate-400">Done</span>
            </div>
            <div className="border-x border-slate-100">
              <span className="block font-bold text-blue-500">
                {assignments.filter(a => a.status === 'in_progress').length}
              </span>
              <span className="text-[9px] text-slate-400">In Progress</span>
            </div>
            <div>
              <span className="block font-bold text-amber-500">
                {assignments.filter(a => a.status === 'pending').length}
              </span>
              <span className="text-[9px] text-slate-400">Pending</span>
            </div>
          </div>
        </div>

      </div>

      {/* Second Analytics row: Subject Performance Horiz-Chart & Academic Goals Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Subject Performance Horizontal bar chart */}
        <div id="subject-performance-card" className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Subject Performance Analysis</h3>
              <p className="text-xs text-slate-400">Live academic telemetry per coursework element</p>
            </div>
            <button 
              onClick={() => setActiveTab('subjects')}
              className="text-xs text-primary font-bold hover:underline flex items-center"
            >
              All Subjects <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* List of 5 subjects horizontal bar chart */}
          <div className="space-y-4">
            {activeSemesterSubjects.map((sub) => {
              const scorePercent = sub.score;
              // Grade colors
              const gradeColor = sub.grade.startsWith('A') 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                : 'bg-indigo-50 text-indigo-700 border-indigo-200';

              const barColor = sub.score >= 90 ? 'bg-primary' : sub.score >= 80 ? 'bg-secondary' : 'bg-amber-500';

              return (
                <div key={sub.id} className="space-y-1.5 group">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-mono text-[9px] text-slate-400 bg-slate-100 px-1 py-0.5 rounded uppercase shrink-0">
                        {sub.code}
                      </span>
                      <span className="font-bold text-slate-700 truncate">{sub.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-800">{scorePercent}%</span>
                      <span className={`text-[10px] font-extrabold font-mono px-1.5 py-0.2 border rounded ${gradeColor}`}>
                        {sub.grade}
                      </span>
                    </div>
                  </div>
                  {/* Performance bar */}
                  <div className="relative w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-2.5 rounded-full transition-all duration-500 ${barColor}`}
                      style={{ width: `${scorePercent}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-slate-400">
                    <span>Lecturer: {sub.lecturer}</span>
                    <span className="font-mono font-medium">Progress meter: {sub.progress}% complete</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Academic Goals Card */}
        <div id="academic-goals-card" className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <Target className="w-4.5 h-4.5 text-secondary" /> Academic Targets & Goals
              </h3>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                Dean's List Track
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-4">Milestone checkpoints for presidential scholarship endorsement verification.</p>

            <div className="space-y-4">
              {goals.map((goal) => {
                const reached = goal.currentPercent >= goal.targetPercent;
                return (
                  <div key={goal.id} className="border border-slate-50 p-2.5 rounded-xl space-y-1 bg-slate-50/40">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-700 truncate mr-2">{goal.title}</span>
                      <span className={`font-mono font-bold ${reached ? 'text-emerald-600' : 'text-primary'}`}>
                        {goal.currentPercent}% / {goal.targetPercent}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-200/60 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-1.5 rounded-full ${reached ? 'bg-emerald-500' : 'bg-primary'}`}
                        style={{ width: `${(goal.currentPercent / goal.targetPercent) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-[10px] text-slate-400 truncate">{goal.subtitle}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-400 mt-4">
            <span>Scholarship status:</span>
            <span className="text-emerald-500 font-bold">100% Fully Compliant</span>
          </div>
        </div>

      </div>

      {/* Lower Dashboard Area: Recent notifications + Upcoming activities Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Upcoming Activities Panel (simulated timeline logs) */}
        <div id="upcoming-activities-panel" className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-primary" /> Term Timeline Feed
          </h3>

          <div className="space-y-4">
            <div className="flex gap-3 relative before:content-[''] before:absolute before:left-3 before:top-4 before:bottom-0 before:w-0.5 before:bg-slate-100 pb-2">
              <div className="w-6 h-6 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 z-10">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-mono font-semibold block">TODAY, 10:15 AM</span>
                <p className="text-xs font-bold text-slate-800">Socket Programming Assignment Finished</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Checked-in and validated with prof Pendelton.</p>
              </div>
            </div>

            <div className="flex gap-3 relative before:content-[''] before:absolute before:left-3 before:top-4 before:bottom-0 before:w-0.5 before:bg-slate-100 pb-2">
              <div className="w-6 h-6 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 z-10">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-mono font-semibold block">YESTERDAY, 02:30 PM</span>
                <p className="text-xs font-bold text-slate-800">Presidents Merit Scholarship Audited</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Review satisfied. Cumulative performance evaluated above threshold.</p>
              </div>
            </div>

            <div className="flex gap-3 relative">
              <div className="w-6 h-6 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0 z-10">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-mono font-semibold block">JUNE 18, 2026</span>
                <p className="text-xs font-bold text-slate-800">Midterm Examination Scores Filed</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Machine Learning: A- Grade locked to ledger.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Notifications Widget with tray triggers */}
        <div id="recent-notifications-panel" className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <BellRing className="w-4 h-4 text-orange-500" /> Recent Notifications
            </h3>
            <button 
              onClick={() => {
                const btn = document.getElementById('notification-bell-btn');
                if (btn) btn.click();
              }}
              className="text-xs font-semibold text-slate-400 hover:text-primary"
            >
              Manage
            </button>
          </div>

          <div className="space-y-3.5">
            <div className="border-l-2 border-primary pl-3 py-1 bg-slate-50/50 rounded-r-xl">
              <h4 className="text-xs font-bold text-slate-800">Final Exam Date Locked</h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">Database Systems exam confirmed on June 29, Room 302.</p>
              <span className="text-[9px] text-slate-400 font-mono mt-1 block">2 hours ago</span>
            </div>

            <div className="border-l-2 border-purple-500 pl-3 py-1 bg-slate-50/50 rounded-r-xl">
              <h4 className="text-xs font-bold text-slate-800">Web Dev Lab Overdue Notification</h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">Responsive CSS Framework lab deadline expired. Submit for partial grade.</p>
              <span className="text-[9px] text-slate-400 font-mono mt-1 block">1 day ago</span>
            </div>
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div id="quick-actions-panel" className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-3">
            <Calculator className="w-4.5 h-4.5 text-primary" /> Portal Action Triggers
          </h3>
          <p className="text-xs text-slate-400 mb-4">Immediate workflow pipelines to feed data, semesters, or courses into success engine.</p>
          
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={() => setActiveTab('semesters')}
              className="px-3 py-2.5 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 bg-white transition-all text-left group cursor-pointer"
            >
              <span className="block text-[10px] font-bold text-slate-400 uppercase font-mono mb-1">01. Setup</span>
              <span className="text-xs font-bold text-slate-800 group-hover:text-primary flex items-center justify-between">
                Add Semester <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </span>
            </button>

            <button 
              onClick={() => setActiveTab('subjects')}
              className="px-3 py-2.5 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 bg-white transition-all text-left group cursor-pointer"
            >
              <span className="block text-[10px] font-bold text-slate-400 uppercase font-mono mb-1">02. Courses</span>
              <span className="text-xs font-bold text-slate-800 group-hover:text-primary flex items-center justify-between">
                Add Subject <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </span>
            </button>

            <button 
              onClick={() => setActiveTab('assignments')}
              className="px-3 py-2.5 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 bg-white transition-all text-left group cursor-pointer"
            >
              <span className="block text-[10px] font-bold text-slate-400 uppercase font-mono mb-1">03. Pipeline</span>
              <span className="text-xs font-bold text-slate-800 group-hover:text-primary flex items-center justify-between">
                Add Homework <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </span>
            </button>

            <button 
              onClick={() => setActiveTab('exams')}
              className="px-3 py-2.5 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 bg-white transition-all text-left group cursor-pointer"
            >
              <span className="block text-[10px] font-bold text-slate-400 uppercase font-mono mb-1">04. Exams</span>
              <span className="text-xs font-bold text-slate-800 group-hover:text-primary flex items-center justify-between">
                Add Test <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </span>
            </button>
          </div>

          <button 
            onClick={() => setActiveTab('analytics')}
            className="w-full mt-4 bg-primary text-white font-bold text-xs py-2.5 rounded-xl text-center shadow-md shadow-primary/10 hover:bg-primary/95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <TrendingUp className="w-3.5 h-3.5" /> Open GPA Analytics Dashboard
          </button>
        </div>

      </div>

      {/* Bonus Widgets Row: Academic Calendar Mini Widget + Study progress Pomodoro tracker + Speed Task Injector */}
      <div id="bonus-widgets-row" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Academic Calendar Mini Widget */}
        <div id="widget-calendar-mini" className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <CalendarDays className="w-4 h-4 text-primary" /> June 2026 Grid
            </h3>
            <span className="text-[10px] text-slate-400 font-mono font-bold">TODAY: JUNE 22</span>
          </div>

          {/* Simple Grid Calendar representation */}
          <div className="grid grid-cols-7 gap-1 text-center font-mono text-[10px] font-semibold text-slate-400 pb-2 border-b border-slate-100">
            <div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div><div>S</div>
          </div>
          <div className="grid grid-cols-7 gap-1.5 text-center mt-2.5 font-mono text-[10px]">
            {/* Blanks */}
            <div className="py-1">1</div><div className="py-1">2</div><div className="py-1">3</div><div className="py-1">4</div><div className="py-1">5</div><div className="py-1">6</div><div className="py-1">7</div>
            <div className="py-1">8</div><div className="py-1">9</div>
            {/* Overdue */}
            <div className="py-1 bg-rose-50 text-rose-600 font-bold border border-rose-100 rounded-md relative group">
              10
              <div className="absolute hidden group-hover:block bottom-6 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[9px] px-1.5 py-0.5 rounded whitespace-nowrap z-20">Overdue assignment!</div>
            </div>
            <div className="py-1">11</div><div className="py-1">12</div><div className="py-1">13</div><div className="py-1">14</div>
            <div className="py-1">15</div><div className="py-1">16</div><div className="py-1">17</div><div className="py-1">18</div><div className="py-1">19</div><div className="py-1">20</div><div className="py-1">21</div>
            {/* Active June 22 */}
            <div className="py-1 bg-primary text-white font-bold rounded-md border border-primary relative">
              22
              <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white"></span>
            </div>
            <div className="py-1">23</div><div className="py-1">24</div>
            {/* Assignment Sunday June 28 */}
            <div className="py-1 bg-amber-50 text-amber-700 font-bold border border-amber-200 rounded-md relative group">
              25
              <div className="absolute hidden group-hover:block bottom-6 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[9px] px-1.5 py-0.5 rounded whitespace-nowrap z-20">SQL optimization lab due</div>
            </div>
            <div className="py-1">26</div><div className="py-1">27</div><div className="py-1">28</div>
            {/* Exam June 29 */}
            <div className="py-1 bg-indigo-50 leading-tight text-indigo-700 font-bold border border-indigo-200 rounded-md relative group">
              29
              <div className="absolute hidden group-hover:block bottom-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[9px] px-1.5 py-0.5 rounded whitespace-nowrap z-20">Database Systems Final Exam</div>
            </div>
            <div className="py-1">30</div>
          </div>
        </div>

        {/* Study Progress Pomodoro Tracker Widget */}
        <div id="widget-learning-tracker" className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <Flame className="w-5 h-5 text-orange-500" /> Focus Session Timer
              </h3>
              <span className="text-[10px] font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                🔥 {streakDays} Day Streak
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-4">Improve memory retention with custom structured study blocks.</p>

            <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl text-center space-y-3">
              <div className="text-3xl font-black font-mono text-slate-800 tracking-wider">
                {formatTimer(studyTimer)}
              </div>
              <div className="flex items-center justify-center gap-2">
                <button 
                  onClick={toggleStudyTimer}
                  className={`px-4 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 cursor-pointer transition-all ${
                    studyRunning 
                      ? 'bg-amber-100 text-amber-700 border border-amber-200 hover:bg-amber-200' 
                      : 'bg-primary text-white hover:bg-primary/95 shadow-md shadow-primary/10'
                  }`}
                >
                  {studyRunning ? <><Pause className="w-3.5 h-3.5" /> Pause</> : <><Play className="w-3.5 h-3.5" /> Go Focus</>}
                </button>
                <button 
                  onClick={resetStudyTimer}
                  className="p-1.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-100 cursor-pointer"
                  title="Reset"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-50 flex justify-between text-[11px] font-mono text-slate-400 mt-4 leading-none">
            <span>Blocks completed today:</span>
            <span className="font-bold text-slate-800">{focusBlocksCompleted} blocks</span>
          </div>
        </div>

        {/* Quick Creator / Add Task Assignment Panel */}
        <div id="quick-assignment-creator" className="bg-gradient-to-br from-slate-50 to-indigo-50/25 border border-indigo-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <BookmarkPlus className="w-4 h-4 text-primary" /> Speed Task Injector
            </h4>
            <p className="text-xs text-slate-400 mt-1 mb-3">
              Instantly schedule another coursework deadline in the pipeline.
            </p>

            <form onSubmit={handleQuickAddSubmit} className="space-y-3.5">
              <div>
                <input 
                  id="quick-add-title"
                  type="text" 
                  value={quickTitle}
                  onChange={(e) => setQuickTitle(e.target.value)}
                  placeholder="e.g., Normalization exercises"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs outline-none focus:border-primary text-slate-700"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <select
                    id="quick-add-subject"
                    value={selectedSub}
                    onChange={(e) => setSelectedSub(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-2 py-1.5 text-xs outline-none focus:border-primary text-slate-700"
                    required
                  >
                    <option value="">Course</option>
                    {activeSemesterSubjects.map(sub => (
                      <option key={sub.id} value={sub.id}>
                        {sub.code}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <select
                    id="quick-add-priority"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-2 py-1.5 text-xs outline-none focus:border-primary text-slate-700"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                    <option value="critical">Critical Priority</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input 
                  id="quick-add-group-check"
                  type="checkbox"
                  checked={isGroup}
                  onChange={(e) => setIsGroup(e.target.checked)}
                  className="rounded border-slate-200 accent-primary"
                />
                <label htmlFor="quick-add-group-check" className="text-xs font-medium text-slate-400 font-sans cursor-pointer">
                  This is a team project code
                </label>
              </div>

              <button 
                id="quick-add-submit-btn"
                type="submit"
                className="w-full bg-primary hover:bg-primary/95 text-white font-bold text-xs py-2 rounded-xl transition-all flex items-center justify-center gap-1 shadow-md shadow-primary/10 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Inject Graded HW
              </button>
            </form>
          </div>

          {quickAddSuccess && (
            <div id="quick-add-success-alert" className="text-center text-[10px] font-bold text-emerald-600 bg-emerald-50 py-1 rounded-lg border border-emerald-200/50 mt-2">
              🌱 Added! Check the Assignments Hub.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
