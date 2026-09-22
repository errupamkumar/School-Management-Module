'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import {
  Clock,
  Printer,
  Plus,
  Calendar,
  BookOpen,
  UserCheck,
  Building2,
  CheckCircle2,
  X,
  AlertCircle
} from 'lucide-react';

interface ClassItem {
  id: string;
  name: string;
  sections: { id: string; name: string }[];
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const PERIODS = [
  { id: 1, name: 'Period 1', time: '08:00 - 08:45 AM' },
  { id: 2, name: 'Period 2', time: '08:45 - 09:30 AM' },
  { id: 3, name: 'Period 3', time: '09:30 - 10:15 AM' },
  { id: 'break', name: 'Recess Break', time: '10:15 - 10:45 AM', isBreak: true },
  { id: 4, name: 'Period 4', time: '10:45 - 11:30 AM' },
  { id: 5, name: 'Period 5', time: '11:30 - 12:15 PM' },
  { id: 6, name: 'Period 6', time: '12:15 - 01:00 PM' },
];

// Initial default timetable schedule matrix
const initialSchedule: Record<string, { subject: string; teacher: string; room: string }> = {
  'Monday-1': { subject: 'Mathematics', teacher: 'Arun Sharma', room: 'Room 101' },
  'Monday-2': { subject: 'English', teacher: 'Priya Singh', room: 'Room 101' },
  'Monday-3': { subject: 'Science', teacher: 'Deepak Verma', room: 'Physics Lab' },
  'Monday-4': { subject: 'Hindi', teacher: 'Sunita Gupta', room: 'Room 101' },
  'Monday-5': { subject: 'Social Science', teacher: 'Kavita Mishra', room: 'Room 101' },
  'Monday-6': { subject: 'Computer Science', teacher: 'Amit Yadav', room: 'Computer Lab' },

  'Tuesday-1': { subject: 'Science', teacher: 'Rakesh Tiwari', room: 'Chemistry Lab' },
  'Tuesday-2': { subject: 'Mathematics', teacher: 'Arun Sharma', room: 'Room 101' },
  'Tuesday-3': { subject: 'English', teacher: 'Priya Singh', room: 'Room 101' },
  'Tuesday-4': { subject: 'Social Science', teacher: 'Kavita Mishra', room: 'Room 101' },
  'Tuesday-5': { subject: 'Physical Education', teacher: 'Sunita Gupta', room: 'Playground' },
  'Tuesday-6': { subject: 'Hindi', teacher: 'Sunita Gupta', room: 'Room 101' },

  'Wednesday-1': { subject: 'Mathematics', teacher: 'Arun Sharma', room: 'Room 101' },
  'Wednesday-2': { subject: 'Computer Science', teacher: 'Amit Yadav', room: 'Computer Lab' },
  'Wednesday-3': { subject: 'Science', teacher: 'Neha Pandey', room: 'Bio Lab' },
  'Wednesday-4': { subject: 'English', teacher: 'Priya Singh', room: 'Room 101' },
  'Wednesday-5': { subject: 'Hindi', teacher: 'Sunita Gupta', room: 'Room 101' },
  'Wednesday-6': { subject: 'Art & Craft', teacher: 'Deepak Verma', room: 'Art Room' },

  'Thursday-1': { subject: 'English', teacher: 'Priya Singh', room: 'Room 101' },
  'Thursday-2': { subject: 'Mathematics', teacher: 'Arun Sharma', room: 'Room 101' },
  'Thursday-3': { subject: 'Social Science', teacher: 'Kavita Mishra', room: 'Room 101' },
  'Thursday-4': { subject: 'Science', teacher: 'Deepak Verma', room: 'Room 101' },
  'Thursday-5': { subject: 'Hindi', teacher: 'Sunita Gupta', room: 'Room 101' },
  'Thursday-6': { subject: 'General Knowledge', teacher: 'Kavita Mishra', room: 'Room 101' },

  'Friday-1': { subject: 'Science', teacher: 'Rakesh Tiwari', room: 'Chemistry Lab' },
  'Friday-2': { subject: 'Mathematics', teacher: 'Arun Sharma', room: 'Room 101' },
  'Friday-3': { subject: 'Computer Science', teacher: 'Amit Yadav', room: 'Computer Lab' },
  'Friday-4': { subject: 'English', teacher: 'Priya Singh', room: 'Room 101' },
  'Friday-5': { subject: 'Social Science', teacher: 'Kavita Mishra', room: 'Room 101' },
  'Friday-6': { subject: 'Physical Education', teacher: 'Deepak Verma', room: 'Playground' },

  'Saturday-1': { subject: 'Mathematics', teacher: 'Arun Sharma', room: 'Room 101' },
  'Saturday-2': { subject: 'Science Quiz', teacher: 'Neha Pandey', room: 'Auditorium' },
  'Saturday-3': { subject: 'English Debate', teacher: 'Priya Singh', room: 'Room 101' },
  'Saturday-4': { subject: 'Sports & Games', teacher: 'Amit Yadav', room: 'Playground' },
  'Saturday-5': { subject: 'Library Period', teacher: 'Sunita Gupta', room: 'Library' },
  'Saturday-6': { subject: 'Class Activity', teacher: 'Arun Sharma', room: 'Room 101' },
};

export default function TimetablePage() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedSectionId, setSelectedSectionId] = useState('');
  const [schedule, setSchedule] = useState(initialSchedule);

  // Edit slot modal
  const [editingSlotKey, setEditingSlotKey] = useState<string | null>(null);
  const [editSubject, setEditSubject] = useState('');
  const [editTeacher, setEditTeacher] = useState('');
  const [editRoom, setEditRoom] = useState('');

  useEffect(() => {
    fetch('/api/classes')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data.length > 0) {
          setClasses(data.data);
          setSelectedClassId(data.data[0].id);
          if (data.data[0].sections.length > 0) {
            setSelectedSectionId(data.data[0].sections[0].id);
          }
        }
      });
  }, []);

  const openSlotEdit = (key: string) => {
    const current = schedule[key] || { subject: '', teacher: '', room: '' };
    setEditingSlotKey(key);
    setEditSubject(current.subject);
    setEditTeacher(current.teacher);
    setEditRoom(current.room);
  };

  const handleSaveSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSlotKey) return;
    setSchedule((prev) => ({
      ...prev,
      [editingSlotKey]: {
        subject: editSubject,
        teacher: editTeacher,
        room: editRoom || 'Room 101',
      },
    }));
    setEditingSlotKey(null);
  };

  const activeClass = classes.find((c) => c.id === selectedClassId);
  const activeSections = activeClass?.sections || [];

  return (
    <DashboardLayout>
      <div className="space-y-6 pb-12">
        {/* ========================================================================= */}
        {/* 1. HEADER                                                                 */}
        {/* ========================================================================= */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                <Clock size={18} />
              </div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">Class Timetable</h1>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Weekly class schedule matrix, teacher allocations, and room slots
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white text-gray-700 hover:bg-gray-50 text-xs font-bold rounded-xl border border-gray-200 transition-all shadow-sm"
            >
              <Printer size={14} />
              <span>Print Schedule</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. SELECTOR BAR                                                           */}
        {/* ========================================================================= */}
        <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                Select Class
              </label>
              <select
                value={selectedClassId}
                onChange={(e) => {
                  setSelectedClassId(e.target.value);
                  const cls = classes.find((c) => c.id === e.target.value);
                  if (cls && cls.sections.length > 0) {
                    setSelectedSectionId(cls.sections[0].id);
                  }
                }}
                className="text-xs font-bold px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none"
              >
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    Class {cls.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                Section
              </label>
              <select
                value={selectedSectionId}
                onChange={(e) => setSelectedSectionId(e.target.value)}
                className="text-xs font-bold px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none"
              >
                {activeSections.map((sec) => (
                  <option key={sec.id} value={sec.id}>
                    Section {sec.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>Timing: <strong>08:00 AM - 01:00 PM</strong></span>
            <span>&bull;</span>
            <span>6 Periods + 1 Recess</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. TIMETABLE MATRIX TABLE                                                 */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-[11px] uppercase font-bold text-gray-400 tracking-wider">
                  <th className="py-3.5 px-4 w-32">Day / Time</th>
                  {PERIODS.map((p) => (
                    <th key={p.id} className="py-3.5 px-3 text-center">
                      <p className="font-bold text-gray-800">{p.name}</p>
                      <p className="text-[10px] text-gray-400 lowercase font-normal">{p.time}</p>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {DAYS.map((day) => (
                  <tr key={day} className="hover:bg-purple-50/20 transition-colors">
                    {/* Day Column */}
                    <td className="py-4 px-4 font-bold text-gray-900 bg-gray-50/40 border-r border-gray-100">
                      {day}
                    </td>

                    {/* Period Columns */}
                    {PERIODS.map((period) => {
                      if (period.isBreak) {
                        return (
                          <td
                            key={period.id}
                            className="py-3 px-2 text-center bg-amber-50/40 text-[11px] font-bold text-amber-700 border-x border-gray-100"
                          >
                            Break
                          </td>
                        );
                      }

                      const slotKey = `${day}-${period.id}`;
                      const slot = schedule[slotKey];

                      return (
                        <td
                          key={period.id}
                          onClick={() => openSlotEdit(slotKey)}
                          className="py-2.5 px-2 text-center cursor-pointer group hover:bg-purple-100/40 transition-colors"
                        >
                          {slot ? (
                            <div className="p-2.5 rounded-2xl bg-purple-50 group-hover:bg-white border border-purple-100 shadow-xs transition-all text-left">
                              <p className="font-bold text-purple-900 leading-tight truncate">
                                {slot.subject}
                              </p>
                              <p className="text-[10px] text-gray-600 mt-1 truncate flex items-center gap-1">
                                <UserCheck size={10} className="text-purple-600" />
                                <span>{slot.teacher}</span>
                              </p>
                              <p className="text-[9px] text-gray-400 mt-0.5 truncate font-mono">
                                {slot.room}
                              </p>
                            </div>
                          ) : (
                            <div className="p-2.5 rounded-2xl border border-dashed border-gray-200 text-gray-300 text-[11px] hover:border-purple-300 hover:text-purple-600 transition-colors">
                              + Assign
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4. MODAL: EDIT SLOT                                                       */}
        {/* ========================================================================= */}
        {editingSlotKey && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-gray-100 relative">
              <button
                onClick={() => setEditingSlotKey(null)}
                className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <Clock size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Configure Period Slot</h3>
                  <p className="text-xs text-gray-500">{editingSlotKey.replace('-', ' • ')}</p>
                </div>
              </div>

              <form onSubmit={handleSaveSlot} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Subject Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mathematics"
                    value={editSubject}
                    onChange={(e) => setEditSubject(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Teacher Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Arun Sharma"
                    value={editTeacher}
                    onChange={(e) => setEditTeacher(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Room / Lab
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Room 101 or Computer Lab"
                    value={editRoom}
                    onChange={(e) => setEditRoom(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none"
                  />
                </div>

                <div className="pt-3 flex items-center justify-end gap-2 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setEditingSlotKey(null)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-md transition-all active:scale-95"
                  >
                    Save Slot
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
