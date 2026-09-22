'use client';

import { useEffect, useState, useCallback } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import {
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Save,
  Users,
  Search,
  AlertCircle,
  Calendar,
  School,
  X,
  Send,
  Printer
} from 'lucide-react';

interface ClassOption {
  id: string;
  name: string;
  sections: { id: string; name: string }[];
}

interface StudentAttendanceItem {
  id: string;
  rollNo?: string;
  admissionNo: string;
  firstName: string;
  lastName: string;
  gender: string;
  attendance?: {
    status: string;
    remarks?: string;
  } | null;
}

export default function AttendancePage() {
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [classes, setClasses] = useState<ClassOption[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [selectedSectionId, setSelectedSectionId] = useState<string>('');

  const [students, setStudents] = useState<StudentAttendanceItem[]>([]);
  const [records, setRecords] = useState<Record<string, string>>({});
  const [remarks, setRemarks] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Load Classes
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
      })
      .catch((err) => console.error('Failed to load classes', err));
  }, []);

  // Update Section when class changes
  const handleClassChange = (classId: string) => {
    setSelectedClassId(classId);
    const cls = classes.find((c) => c.id === classId);
    if (cls && cls.sections.length > 0) {
      setSelectedSectionId(cls.sections[0].id);
    } else {
      setSelectedSectionId('');
    }
  };

  // Load Students & existing Attendance for section and date
  const loadRoster = useCallback(async () => {
    if (!selectedSectionId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/attendance?sectionId=${selectedSectionId}&date=${date}`);
      const json = await res.json();
      if (json.success) {
        setStudents(json.data);
        const initialStatus: Record<string, string> = {};
        const initialRemarks: Record<string, string> = {};
        json.data.forEach((s: StudentAttendanceItem) => {
          initialStatus[s.id] = s.attendance?.status || 'PRESENT';
          if (s.attendance?.remarks) initialRemarks[s.id] = s.attendance.remarks;
        });
        setRecords(initialStatus);
        setRemarks(initialRemarks);
      }
    } catch (err) {
      console.error('Failed to load attendance roster', err);
    } finally {
      setLoading(false);
    }
  }, [selectedSectionId, date]);

  useEffect(() => {
    if (selectedSectionId) {
      loadRoster();
    }
  }, [loadRoster, selectedSectionId]);

  const setAll = (status: string) => {
    const updated: Record<string, string> = {};
    students.forEach((s) => {
      updated[s.id] = status;
    });
    setRecords(updated);
  };

  const toggleStatus = (id: string) => {
    const sequence = ['PRESENT', 'ABSENT', 'LATE', 'HALF_DAY'];
    const current = records[id] || 'PRESENT';
    const next = sequence[(sequence.indexOf(current) + 1) % sequence.length];
    setRecords((prev) => ({ ...prev, [id]: next }));
  };

  // Counts
  const counts = students.reduce(
    (acc, s) => {
      const status = records[s.id] || 'PRESENT';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    { PRESENT: 0, ABSENT: 0, LATE: 0, HALF_DAY: 0 } as Record<string, number>
  );

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // Save Attendance to Database
  const handleSaveAttendance = async () => {
    if (!selectedSectionId || students.length === 0) return;
    setSaving(true);

    try {
      const recordPayload = students.map((s) => ({
        studentId: s.id,
        status: records[s.id] || 'PRESENT',
        remarks: remarks[s.id] || null,
      }));

      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sectionId: selectedSectionId,
          date,
          records: recordPayload,
        }),
      });

      const json = await res.json();
      if (json.success) {
        showNotification('success', `Attendance saved successfully for ${students.length} students!`);
      } else {
        showNotification('error', json.error || 'Failed to save attendance.');
      }
    } catch (err: any) {
      showNotification('error', err.message || 'Error saving attendance.');
    } finally {
      setSaving(false);
    }
  };

  const activeClass = classes.find((c) => c.id === selectedClassId);
  const activeSections = activeClass?.sections || [];

  return (
    <DashboardLayout>
      <div className="space-y-6 pb-12">
        {/* Notification Toast */}
        {notification && (
          <div
            className={`fixed top-16 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl shadow-xl border text-sm font-semibold animate-in slide-in-from-top-2 ${
              notification.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle2 size={18} className="text-emerald-600" />
            ) : (
              <AlertCircle size={18} className="text-rose-600" />
            )}
            <span>{notification.message}</span>
            <button onClick={() => setNotification(null)} className="ml-2 text-gray-400 hover:text-gray-700">
              <X size={14} />
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 1. HEADER                                                                 */}
        {/* ========================================================================= */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                <CalendarCheck size={18} />
              </div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">Mark Attendance</h1>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Daily student attendance register, status toggles, and attendance ledger
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white text-gray-700 hover:bg-gray-50 text-xs font-bold rounded-xl border border-gray-200 transition-all shadow-sm"
            >
              <Printer size={14} />
              <span>Print Sheet</span>
            </button>

            <button
              onClick={handleSaveAttendance}
              disabled={saving || students.length === 0}
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition-all disabled:opacity-50 transform active:scale-95"
            >
              <Save size={15} />
              <span>{saving ? 'Saving...' : 'Save Attendance'}</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. CONTROLS & SELECTION BAR                                               */}
        {/* ========================================================================= */}
        <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            {/* Date */}
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                Attendance Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none"
              />
            </div>

            {/* Class */}
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                Class Grade
              </label>
              <select
                value={selectedClassId}
                onChange={(e) => handleClassChange(e.target.value)}
                className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none"
              >
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    Class {cls.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Section */}
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                Section
              </label>
              <select
                value={selectedSectionId}
                onChange={(e) => setSelectedSectionId(e.target.value)}
                className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none"
              >
                {activeSections.map((sec) => (
                  <option key={sec.id} value={sec.id}>
                    Section {sec.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Refresh / Load */}
            <div className="flex items-end">
              <button
                onClick={loadRoster}
                className="w-full py-2.5 px-4 bg-purple-50 text-purple-700 hover:bg-purple-100 font-bold text-xs rounded-xl border border-purple-200 transition-colors"
              >
                Refresh Roster
              </button>
            </div>
          </div>

          {/* Quick Mark Strip & Live Summary Counters */}
          <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Quick Actions:</span>
              <button
                onClick={() => setAll('PRESENT')}
                className="px-3 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-bold rounded-lg border border-emerald-200 transition-colors"
              >
                Mark All Present
              </button>
              <button
                onClick={() => setAll('ABSENT')}
                className="px-3 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-bold rounded-lg border border-rose-200 transition-colors"
              >
                Mark All Absent
              </button>
            </div>

            {/* Summary Counters */}
            <div className="flex items-center gap-4 text-xs font-bold">
              <span className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                <CheckCircle2 size={13} /> Present: {counts.PRESENT}
              </span>
              <span className="flex items-center gap-1.5 text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg">
                <XCircle size={13} /> Absent: {counts.ABSENT}
              </span>
              <span className="flex items-center gap-1.5 text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg">
                <Clock size={13} /> Late: {counts.LATE}
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. ATTENDANCE TABLE                                                       */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-24 flex flex-col items-center justify-center text-center">
              <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-xs font-semibold text-gray-500">Loading student roster...</p>
            </div>
          ) : students.length === 0 ? (
            <div className="py-20 text-center">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-3">
                <Users size={24} />
              </div>
              <h3 className="text-base font-bold text-gray-900">No students found</h3>
              <p className="text-xs text-gray-400 mt-1">There are no students enrolled in this section yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/80 border-b border-gray-100 text-[11px] uppercase font-bold text-gray-400 tracking-wider">
                    <th className="py-3.5 px-6">Roll No</th>
                    <th className="py-3.5 px-6">Admission No</th>
                    <th className="py-3.5 px-6">Student Name</th>
                    <th className="py-3.5 px-6">Gender</th>
                    <th className="py-3.5 px-6 text-center">Attendance Status</th>
                    <th className="py-3.5 px-6">Remarks / Note</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
                  {students.map((st, idx) => {
                    const status = records[st.id] || 'PRESENT';

                    return (
                      <tr key={st.id} className="hover:bg-purple-50/30 transition-colors">
                        {/* Roll No */}
                        <td className="py-4 px-6 font-mono font-bold text-gray-900">
                          {st.rollNo || idx + 1}
                        </td>

                        {/* Adm No */}
                        <td className="py-4 px-6 font-mono text-[11px] text-gray-500">
                          {st.admissionNo}
                        </td>

                        {/* Student Name */}
                        <td className="py-4 px-6">
                          <span className="font-bold text-gray-900">
                            {st.firstName} {st.lastName}
                          </span>
                        </td>

                        {/* Gender */}
                        <td className="py-4 px-6">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              st.gender === 'FEMALE' ? 'bg-pink-50 text-pink-700' : 'bg-blue-50 text-blue-700'
                            }`}
                          >
                            {st.gender}
                          </span>
                        </td>

                        {/* Status Toggle Buttons */}
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => setRecords((prev) => ({ ...prev, [st.id]: 'PRESENT' }))}
                              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                                status === 'PRESENT'
                                  ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-400/30'
                                  : 'bg-gray-100 text-gray-600 hover:bg-emerald-50 hover:text-emerald-700'
                              }`}
                            >
                              Present
                            </button>

                            <button
                              type="button"
                              onClick={() => setRecords((prev) => ({ ...prev, [st.id]: 'ABSENT' }))}
                              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                                status === 'ABSENT'
                                  ? 'bg-rose-600 text-white shadow-sm ring-2 ring-rose-400/30'
                                  : 'bg-gray-100 text-gray-600 hover:bg-rose-50 hover:text-rose-700'
                              }`}
                            >
                              Absent
                            </button>

                            <button
                              type="button"
                              onClick={() => setRecords((prev) => ({ ...prev, [st.id]: 'LATE' }))}
                              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                                status === 'LATE'
                                  ? 'bg-amber-500 text-white shadow-sm ring-2 ring-amber-400/30'
                                  : 'bg-gray-100 text-gray-600 hover:bg-amber-50 hover:text-amber-700'
                              }`}
                            >
                              Late
                            </button>
                          </div>
                        </td>

                        {/* Remarks */}
                        <td className="py-4 px-6">
                          <input
                            type="text"
                            placeholder="Optional note..."
                            value={remarks[st.id] || ''}
                            onChange={(e) =>
                              setRemarks((prev) => ({ ...prev, [st.id]: e.target.value }))
                            }
                            className="w-full text-[11px] px-2.5 py-1.5 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:ring-1 focus:ring-purple-500 outline-none"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Footer with save button */}
          {!loading && students.length > 0 && (
            <div className="p-4 bg-gray-50/70 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-500">
                Total <strong>{students.length}</strong> students in Section {activeSections.find((s) => s.id === selectedSectionId)?.name}
              </span>

              <button
                onClick={handleSaveAttendance}
                disabled={saving}
                className="inline-flex items-center gap-1.5 px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95"
              >
                <Save size={14} />
                <span>{saving ? 'Saving...' : 'Save & Submit Attendance'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
