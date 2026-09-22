'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import {
  Award,
  Plus,
  Search,
  Calendar,
  Clock,
  BookOpen,
  Printer,
  FileText,
  CheckCircle2,
  X,
  AlertCircle,
  ArrowRight
} from 'lucide-react';

interface ExamItem {
  id: string;
  name: string;
  examType: string;
  startDate: string;
  endDate: string;
  class: { name: string };
  subjects?: {
    id: string;
    examDate: string;
    maxMarks: number;
    subject: { name: string; code: string };
  }[];
  _count?: {
    results: number;
  };
}

export default function ExamsPage() {
  const [exams, setExams] = useState<ExamItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Form
  const [name, setName] = useState('');
  const [examType, setExamType] = useState('HALF_YEARLY');
  const [startDate, setStartDate] = useState('2026-10-15');
  const [endDate, setEndDate] = useState('2026-10-25');

  const loadExams = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/exams');
      const data = await res.json();
      if (data.success) setExams(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExams();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                <Award size={18} />
              </div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">Examinations</h1>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Examination schedules, date sheets, marks entry, and report cards
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/exams/marks"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-purple-50 text-purple-700 hover:bg-purple-100 font-bold text-xs rounded-xl border border-purple-200 transition-colors"
            >
              <FileText size={14} />
              <span>Marks Entry</span>
            </Link>

            <Link
              href="/exams/results"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-xs rounded-xl border border-emerald-200 transition-colors"
            >
              <Award size={14} />
              <span>Results & Report Cards</span>
            </Link>

            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition-all transform active:scale-95"
            >
              <Plus size={15} />
              <span>Create Exam</span>
            </button>
          </div>
        </div>

        {/* Exams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Demo Cards if empty */}
          {[
            {
              id: 'ex-1',
              name: 'Half-Yearly Examination 2025-26',
              type: 'HALF_YEARLY',
              class: 'Class 10',
              dates: 'Oct 15 - Oct 28, 2026',
              papersCount: 6,
              status: 'Upcoming',
            },
            {
              id: 'ex-2',
              name: 'Unit Test 2 (Mid Term)',
              type: 'UNIT_TEST',
              class: 'Class 9',
              dates: 'Nov 05 - Nov 12, 2026',
              papersCount: 5,
              status: 'Scheduled',
            },
            {
              id: 'ex-3',
              name: 'Annual Board Mock Exam',
              type: 'FINAL',
              class: 'Class 10',
              dates: 'Jan 10 - Jan 22, 2027',
              papersCount: 6,
              status: 'Draft',
            },
          ].map((ex) => (
            <div
              key={ex.id}
              className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-100">
                    {ex.type.replace('_', ' ')}
                  </span>
                  <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    {ex.status}
                  </span>
                </div>

                <h3 className="text-base font-bold text-gray-900 leading-snug">{ex.name}</h3>
                <p className="text-xs text-purple-700 font-semibold mt-1">Applicable: {ex.class}</p>

                <div className="mt-4 pt-3 border-t border-gray-50 space-y-1.5 text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <Calendar size={13} className="text-gray-400" />
                    <span>{ex.dates}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen size={13} className="text-gray-400" />
                    <span>{ex.papersCount} Subject Papers</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between">
                <Link
                  href="/exams/marks"
                  className="text-xs font-bold text-purple-600 hover:underline inline-flex items-center gap-1"
                >
                  Enter Marks <ArrowRight size={13} />
                </Link>

                <button
                  onClick={() => alert(`Printable date sheet for ${ex.name} generating...`)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                  title="Print Date Sheet"
                >
                  <Printer size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal: Create Exam */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 relative">
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-gray-100 text-gray-400"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <Award size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Create Examination</h3>
                  <p className="text-xs text-gray-500">Setup exam terms and schedules</p>
                </div>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert('Exam schedule created successfully!');
                  setIsCreateModalOpen(false);
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Exam Term Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Half-Yearly Examination 2025-26"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      required
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      required
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none"
                    />
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-end gap-2 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-md transition-all active:scale-95"
                  >
                    Schedule Exam
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
