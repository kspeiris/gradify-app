import React from 'react';
import { 
  X, 
  Bell, 
  CheckCheck, 
  Sparkles, 
  Clock, 
  Trash2,
  FileText,
  Award,
  TrendingUp,
  Target,
  Inbox
} from 'lucide-react';
import { NotificationItem } from '../types';

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllAsRead: () => void;
  onMarkAsRead: (id: string) => void;
  onClearAll: () => void;
  setActiveTab: (tab: string) => void;
}

export const NotificationsPanel: React.FC<NotificationsPanelProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onMarkAsRead,
  onClearAll,
  setActiveTab
}) => {
  if (!isOpen) return null;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'assignments': return <FileText className="w-4 h-4 text-orange-500" />;
      case 'exams': return <Award className="w-4 h-4 text-indigo-500" />;
      case 'gpa': return <TrendingUp className="w-4 h-4 text-emerald-500" />;
      case 'goals': return <Target className="w-4 h-4 text-blue-500" />;
      default: return <Bell className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
      <div className="absolute inset-0 overflow-hidden">
        {/* Backdrop background overlay */}
        <div 
          onClick={onClose} 
          className="absolute inset-0 bg-slate-900/45 backdrop-blur-xs transition-opacity cursor-pointer"
        ></div>

        <div className="absolute inset-y-0 right-0 pl-10 max-w-full flex sm:pl-16">
          <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col h-full border-l border-slate-250 animate-slide-left">
            
            {/* Header elements */}
            <div className="p-6 bg-slate-50 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-orange-100 flex items-center justify-center">
                    <Bell className="w-4.5 h-4.5 text-orange-600" />
                  </div>
                  <h2 id="slide-over-title" className="text-base font-bold text-slate-800">
                    Student Activities Feed
                  </h2>
                </div>
                <button 
                  onClick={onClose}
                  className="rounded-xl border border-slate-200 bg-white p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Feed quick actions */}
              {notifications.length > 0 && (
                <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-200 text-xs font-mono">
                  <button 
                    onClick={onMarkAllAsRead}
                    className="text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <CheckCheck className="w-4 h-4" /> Mark all read
                  </button>
                  <button 
                    onClick={onClearAll}
                    className="text-slate-400 hover:text-rose-600 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Clear Feed
                  </button>
                </div>
              )}
            </div>

            {/* List scroll element */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {notifications.map((not) => (
                <div 
                  key={not.id}
                  className={`border rounded-2xl p-4 transition-all relative ${
                    not.isRead 
                      ? 'border-slate-100 bg-slate-50/50' 
                      : 'border-orange-100 bg-orange-50/10 shadow-xs'
                  }`}
                >
                  {/* Unread indicator circle */}
                  {!not.isRead && (
                    <span className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full bg-orange-500"></span>
                  )}

                  <div className="flex gap-3">
                    <div className={`h-8 w-8 rounded-lg border flex items-center justify-center shrink-0 ${
                      not.isRead ? 'bg-white border-slate-200' : 'bg-orange-50 border-orange-100'
                    }`}>
                      {getCategoryIcon(not.category)}
                    </div>

                    <div className="space-y-1.5 flex-1 min-w-0 pr-4">
                      <h4 className="text-xs font-extrabold text-slate-800 leading-snug">
                        {not.title}
                      </h4>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {not.message}
                      </p>

                      <div className="flex items-center justify-between pt-1 text-[10px] font-mono text-slate-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> {not.timeLabel}
                        </span>

                        {!not.isRead && (
                          <button
                            onClick={() => onMarkAsRead(not.id)}
                            className="text-indigo-600 hover:text-indigo-805 font-bold cursor-pointer"
                          >
                            Mark Read
                          </button>
                        )}
                      </div>

                      {not.actionLabel && not.actionTab && (
                        <button
                          onClick={() => {
                            if (not.actionTab) {
                              setActiveTab(not.actionTab);
                              onClose();
                            }
                          }}
                          className="mt-2 text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline block cursor-pointer"
                        >
                          {not.actionLabel} &rarr;
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {notifications.length === 0 && (
                <div className="text-center py-16">
                  <Inbox className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs text-slate-400 font-mono">Operations notification inbox is empty.</p>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
