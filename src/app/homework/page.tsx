'use client';

import { useState, useEffect, useMemo } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import {
  BookOpen,
  Plus,
  Search,
  Calendar,
  Clock,
  CheckCircle2,
  X,
  AlertCircle,
  FileText,
  Paperclip,
  Upload,
  Sparkles,
  Users
} from 'lucide-react';

interface HomeworkItem {
  id: string;
  title: string;
  description: string;
  className: string;
  subjectName: string;
  dueDate: string;
  assignedDate: string;
  totalStudents: number;
  submittedCount: number;
  attachmentName?: string;
}

const initialHomeworkList: HomeworkItem[] = [
  {
    id: 'hw-1',
    title: 'Quadratic Equations Practice Set 4.2',
    description: 'Solve questions 1 to 15 from Chapter 4 in your Maths notebook. Show all steps clearly.',
    className: 'Class 10',
    subjectName: 'Mathematics',
    dueDate: '2026-09-24',
    assignedDate: '2026-09-22',
    totalStudents: 38,
    submittedCount: 29,
    attachmentName: 'maths-ch4-worksheet.pdf',
  },
  {
    id: 'hw-2',
    title: 'Light Reflection & Refraction Diagram Drawing',
    description: 'Draw ray diagrams for concave and convex mirrors for all 6 object positions with labels.',
    className: 'Class 10',
    subjectName: 'Science',
    dueDate: '2026-09-25',
    assignedDate: '2026-09-22',
    totalStudents: 38,
    submittedCount: 22,
    attachmentName: 'ray-diagrams-guide.pdf',
  },
  {
    id: 'hw-3',
    title: 'Formal Letter to Municipal Commissioner',
    description: 'Write a formal complaint letter about irregular garbage disposal in your locality (120 words).',
    className: 'Class 9',
    subjectName: 'English',
    dueDate: '2026-09-23',
    assignedDate: '2026-09-21',
    totalStudents: 40,
    submittedCount: 36,
  },
  {
    id: 'hw-4',
    title: 'HTML & CSS Web Page Layout Assignment',
    description: 'Create a simple 2-page static website about Renewable Energy using HTML5 semantic tags.',
    className: 'Class 8',
    subjectName: 'Computer Science',
    dueDate: '2026-09-26',
    assignedDate: '2026-09-22',
    totalStudents: 35,
    submittedCount: 14,
  },
];

export default function HomeworkPage() {
  const [homeworkList, setHomeworkList] = useState<HomeworkItem[]>(initialHomeworkList);
  const [search, setSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [className, setClassName] = useState('Class 10');
  const [subjectName, setSubjectName] = useState('Mathematics');
  const [dueDate, setDueDate] = useState('2026-09-25');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleCreateHomework = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const newHw: HomeworkItem = {
      id: `hw-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      className,
      subjectName,
      dueDate,
      assignedDate: new Date().toISOString().split('T')[0],
      totalStudents: 40,
      submittedCount: 0,
    };

    setHomeworkList([newHw, ...homeworkList]);
    showNotification('success', `Homework assigned to ${className} successfully!`);
    setIsAddModalOpen(false);
    setTitle('');
    setDescription('');
  };

  const filteredList = useMemo(() => {
    return homeworkList.filter((hw) => {
      const q = search.toLowerCase();
      return (
        hw.title.toLowerCase().includes(q) ||
        hw.className.toLowerCase().includes(q) ||
        hw.subjectName.toLowerCase().includes(q)
      );
    });
  }, [homeworkList, search]);

  return (
    <DashboardLayout>
      <div className="space-y-6 pb-12">
        {/* Toast */}
        {notification && (
          <div
            className={`fixed top-16 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl shadow-xl border text-sm font-semibold animate-in slide-in-from-top-2 ${
              notification.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}
          >
            <CheckCircle2 size={18} className="text-emerald-600" />
            <span>{notification.message}</span>
            <button onClick={() => setNotification(null)} className="ml-2 text-gray-400">
              <X size={14} />
            </button>
          </div>
        )}

        {/* 1. Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                <BookOpen size={18} />
              </div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">Daily Homework</h1>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Assign subject tasks, track submission status, and upload study material
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition-all transform active:scale-95"
          >
            <Plus size={15} />
            <span>Assign Homework</span>
          </button>
        </div>

        {/* 2. Search Toolbar */}
        <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search homework by subject or title..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200/80 rounded-xl text-xs outline-none focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400"
            />
          </div>

          <span className="text-xs text-gray-500">
            Showing <strong>{filteredList.length}</strong> assignments
          </span>
        </div>

        {/* 3. Homework Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredList.map((hw) => {
            const submissionRate = Math.round((hw.submittedCount / hw.totalStudents) * 100);

            return (
              <div
                key={hw.id}
                className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-lg bg-purple-50 text-purple-700 font-bold text-xs border border-purple-100">
                        {hw.className}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-700 font-bold text-xs border border-blue-100">
                        {hw.subjectName}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-amber-600 font-semibold bg-amber-50 px-2 py-0.5 rounded-md">
                      <Clock size={12} />
                      <span>Due: {hw.dueDate}</span>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-gray-900 mt-3 leading-snug">
                    {hw.title}
                  </h3>
                  <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                    {hw.description}
                  </p>

                  {hw.attachmentName && (
                    <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gray-50 border border-gray-200/80 text-[11px] font-medium text-gray-700">
                      <Paperclip size={12} className="text-purple-600" />
                      <span>{hw.attachmentName}</span>
                    </div>
                  )}
                </div>

                {/* Submissions Progress */}
                <div className="mt-5 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-gray-500 font-medium">Student Submissions</span>
                    <span className="font-bold text-gray-800">
                      {hw.submittedCount} / {hw.totalStudents} ({submissionRate}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${submissionRate}%` }}
                      className="h-full bg-emerald-500 rounded-full transition-all"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 4. Modal: Assign Homework */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 relative">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-gray-100 text-gray-400"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <BookOpen size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Assign Daily Homework</h3>
                  <p className="text-xs text-gray-500">Post instructions and submission deadline</p>
                </div>
              </div>

              <form onSubmit={handleCreateHomework} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Grade Class
                    </label>
                    <select
                      value={className}
                      onChange={(e) => setClassName(e.target.value)}
                      className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none"
                    >
                      {['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'].map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Subject
                    </label>
                    <select
                      value={subjectName}
                      onChange={(e) => setSubjectName(e.target.value)}
                      className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none"
                    >
                      {['Mathematics', 'Science', 'English', 'Hindi', 'Social Science', 'Computer Science'].map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Assignment Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chapter 4 Practice Questions"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Instructions & Description *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Explain the assignment tasks..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Submission Due Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none"
                  />
                </div>

                <div className="pt-3 flex items-center justify-end gap-2 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-md transition-all active:scale-95"
                  >
                    Assign to Class
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
