'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { useCampus } from '@/components/providers/CampusProvider';
import {
  GraduationCap,
  UserPlus,
  Eye,
  Edit,
  Search,
  Filter,
  Download,
  Printer,
  ChevronLeft,
  ChevronRight,
  Phone,
  ArrowUpDown,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Layers,
  Sparkles,
  X,
  CheckSquare,
  Square,
  BookOpen,
  MapPin,
  Mail,
  Shield,
  CreditCard,
  Building2,
  ArrowRight
} from 'lucide-react';
import toast from 'react-hot-toast';

interface StudentItem {
  id: string;
  admissionNo: string;
  rollNo?: string;
  firstName: string;
  lastName: string;
  gender: string;
  dob?: string;
  bloodGroup?: string;
  category?: string;
  session?: string;
  admissionDate?: string;
  city?: string;
  state?: string;
  class: { id: string; name: string };
  section: { id: string; name: string };
  parent?: {
    fatherName: string;
    fatherPhone?: string;
    motherName?: string;
    fatherOccupation?: string;
  } | null;
  user?: {
    email: string;
    phone?: string;
  } | null;
  classEnrollments?: {
    id: string;
    classId: string;
    isPrimary: boolean;
    class: { id: string; name: string };
  }[];
  isActive: boolean;
}

interface ClassOption {
  id: string;
  name: string;
  sections: { id: string; name: string }[];
}

const AVAILABLE_SESSIONS = ['2024-25', '2025-26', '2026-27'];
const CURRENT_SESSION = '2025-26';

export default function StudentsPage() {
  const { selectedCampusId } = useCampus();
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [classes, setClasses] = useState<ClassOption[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters (SA-04, SA-10)
  const [search, setSearch] = useState('');
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedSectionId, setSelectedSectionId] = useState('');
  const [sessionFilter, setSessionFilter] = useState<string>('CURRENT'); // 'CURRENT' | 'ALL' | specific session
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalStudents, setTotalStudents] = useState(0);

  // SA-03: Selection & Bulk Update State
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkAdmissionDate, setBulkAdmissionDate] = useState('');
  const [bulkSession, setBulkSession] = useState(CURRENT_SESSION);
  const [bulkClassId, setBulkClassId] = useState('');
  const [bulkSectionId, setBulkSectionId] = useState('');
  const [bulkStatus, setBulkStatus] = useState<string>('');
  const [updatingBulk, setUpdatingBulk] = useState(false);

  // SA-05: Student Detail Quick View Drawer State
  const [drawerStudent, setDrawerStudent] = useState<StudentItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // SA-06: Multi-Class Assignment Modal State
  const [assignStudent, setAssignStudent] = useState<StudentItem | null>(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assignedClassIds, setAssignedClassIds] = useState<string[]>([]);
  const [savingClasses, setSavingClasses] = useState(false);

  // Load Classes for Dropdowns
  useEffect(() => {
    fetch('/api/classes')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setClasses(data.data);
        }
      })
      .catch((err) => console.error('Failed to load classes', err));
  }, []);

  // Fetch Students with session and campus filters (SA-04, SA-10)
  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set('search', search.trim());
      if (selectedClassId) params.set('classId', selectedClassId);
      if (selectedSectionId) params.set('sectionId', selectedSectionId);
      if (selectedCampusId && selectedCampusId !== 'ALL') params.set('campusId', selectedCampusId);

      // Session filtering
      if (sessionFilter === 'CURRENT') {
        params.set('session', CURRENT_SESSION);
      } else if (sessionFilter !== 'ALL') {
        params.set('session', sessionFilter);
      }

      params.set('page', page.toString());
      params.set('pageSize', '15');

      const res = await fetch(`/api/students?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setStudents(data.data);
        setTotalPages(data.totalPages || 1);
        setTotalStudents(data.total || 0);
      }
    } catch (err) {
      console.error('Failed to fetch students', err);
    } finally {
      setLoading(false);
    }
  }, [search, selectedClassId, selectedSectionId, selectedCampusId, sessionFilter, page]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // Current selected class sections
  const activeSections = classes.find((c) => c.id === selectedClassId)?.sections || [];

  const handleResetFilters = () => {
    setSearch('');
    setSelectedClassId('');
    setSelectedSectionId('');
    setSessionFilter('CURRENT');
    setPage(1);
    setSelectedIds([]);
  };

  // Select all or clear selection
  const handleSelectAll = () => {
    if (selectedIds.length === students.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(students.map((s) => s.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // SA-03: Execute Bulk Update
  const handleBulkUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedIds.length === 0) return;

    setUpdatingBulk(true);
    try {
      const payload: any = { studentIds: selectedIds };
      if (bulkAdmissionDate) payload.admissionDate = bulkAdmissionDate;
      if (bulkSession) payload.session = bulkSession;
      if (bulkClassId) payload.classId = bulkClassId;
      if (bulkSectionId) payload.sectionId = bulkSectionId;
      if (bulkStatus === 'ACTIVE') payload.isActive = true;
      if (bulkStatus === 'INACTIVE') payload.isActive = false;

      const res = await fetch('/api/students/bulk', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success) {
        toast.success(data.message || `Updated ${selectedIds.length} students`);
        setIsBulkModalOpen(false);
        setSelectedIds([]);
        fetchStudents();
      } else {
        toast.error(data.error || 'Failed to bulk update');
      }
    } catch (err: any) {
      toast.error('An error occurred during bulk update');
    } finally {
      setUpdatingBulk(false);
    }
  };

  // SA-05: Open Quick View Drawer
  const handleOpenDetailDrawer = (student: StudentItem) => {
    setDrawerStudent(student);
    setIsDrawerOpen(true);
  };

  // SA-06: Open Multi-Class Assignment Modal
  const handleOpenAssignModal = (student: StudentItem) => {
    setAssignStudent(student);
    // Combine primary class and any extra class enrollments
    const enrolled = student.classEnrollments?.map((e) => e.classId) || [];
    const all = Array.from(new Set([student.class.id, ...enrolled]));
    setAssignedClassIds(all);
    setIsAssignModalOpen(true);
  };

  const toggleAssignClass = (classId: string) => {
    setAssignedClassIds((prev) =>
      prev.includes(classId) ? prev.filter((id) => id !== classId) : [...prev, classId]
    );
  };

  const handleSaveMultiClasses = async () => {
    if (!assignStudent) return;
    setSavingClasses(true);
    try {
      const res = await fetch(`/api/students/${assignStudent.id}/classes`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classIds: assignedClassIds,
          primaryClassId: assignStudent.class.id,
          academicYear: assignStudent.session || CURRENT_SESSION,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Assigned to ${assignedClassIds.length} classes`);
        setIsAssignModalOpen(false);
        fetchStudents();
      } else {
        toast.error(data.error || 'Failed to update classes');
      }
    } catch (err) {
      toast.error('Failed to save class assignments');
    } finally {
      setSavingClasses(false);
    }
  };

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
                <GraduationCap size={18} />
              </div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">Student Information</h1>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Active student directory, multi-class allocation, and academic session roster
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white text-gray-700 hover:bg-gray-50 text-xs font-bold rounded-xl border border-gray-200 transition-all shadow-sm"
            >
              <Printer size={14} />
              <span>Print Roster</span>
            </button>

            <Link
              href="/admission/new"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition-all transform active:scale-95"
            >
              <UserPlus size={15} />
              <span>New Admission</span>
            </Link>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. SA-04: SESSION QUICK FILTER TABS                                        */}
        {/* ========================================================================= */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-2.5 rounded-2xl border border-gray-100 shadow-sm">
          <div className="inline-flex p-1 bg-gray-100 rounded-xl text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setSessionFilter('CURRENT');
                setPage(1);
              }}
              className={`px-4 py-1.5 rounded-lg transition-all ${
                sessionFilter === 'CURRENT'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span>Current Session ({CURRENT_SESSION})</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setSessionFilter('ALL');
                setPage(1);
              }}
              className={`px-4 py-1.5 rounded-lg transition-all ${
                sessionFilter === 'ALL'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span>All Students (All Sessions)</span>
            </button>
          </div>

          {/* Specific Session Dropdown */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-400 font-semibold hidden sm:inline">Academic Session:</span>
            <select
              value={sessionFilter}
              onChange={(e) => {
                setSessionFilter(e.target.value);
                setPage(1);
              }}
              className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-purple-500/20 outline-none"
            >
              <option value="CURRENT">Current Session ({CURRENT_SESSION})</option>
              <option value="ALL">All Academic Sessions</option>
              {AVAILABLE_SESSIONS.map((s) => (
                <option key={s} value={s}>
                  Session {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. FILTER & SEARCH TOOLBAR                                                */}
        {/* ========================================================================= */}
        <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            {/* Search Input */}
            <div className="sm:col-span-5 relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search by student name or admission no..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200/80 rounded-xl text-xs outline-none focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400"
              />
            </div>

            {/* Class Filter */}
            <div className="sm:col-span-3">
              <select
                value={selectedClassId}
                onChange={(e) => {
                  setSelectedClassId(e.target.value);
                  setSelectedSectionId('');
                  setPage(1);
                }}
                className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none"
              >
                <option value="">All Classes</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    Class {cls.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Section Filter */}
            <div className="sm:col-span-2">
              <select
                value={selectedSectionId}
                onChange={(e) => {
                  setSelectedSectionId(e.target.value);
                  setPage(1);
                }}
                disabled={!selectedClassId}
                className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none disabled:opacity-50"
              >
                <option value="">All Sections</option>
                {activeSections.map((sec) => (
                  <option key={sec.id} value={sec.id}>
                    Section {sec.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Reset Button */}
            <div className="sm:col-span-2 flex items-center gap-2">
              <button
                onClick={handleResetFilters}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-colors"
                title="Reset filters"
              >
                <RotateCcw size={13} />
                <span>Reset</span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
            <span>
              Showing <strong>{students.length}</strong> of <strong>{totalStudents}</strong> students
            </span>
            <span className="text-[11px] text-purple-600 font-semibold">
              Page {page} of {totalPages}
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4. SA-03: FLOATING BULK ACTIONS BAR (When rows selected)                   */}
        {/* ========================================================================= */}
        {selectedIds.length > 0 && (
          <div className="bg-purple-900 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center text-xs font-bold">
                {selectedIds.length}
              </span>
              <span className="text-xs font-bold">
                {selectedIds.length} student{selectedIds.length > 1 ? 's' : ''} selected
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setIsBulkModalOpen(true)}
                className="px-4 py-1.5 bg-white text-purple-900 font-bold text-xs rounded-xl hover:bg-purple-50 transition-colors shadow-sm flex items-center gap-1.5"
              >
                <Edit size={13} />
                <span>Bulk Update (Admission Date / Session)</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedIds([])}
                className="p-1.5 rounded-lg text-purple-200 hover:text-white hover:bg-purple-800 transition-colors"
                title="Clear selection"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 5. STUDENTS TABLE                                                         */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-24 flex flex-col items-center justify-center text-center">
              <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-xs font-semibold text-gray-500">Loading student directory...</p>
            </div>
          ) : students.length === 0 ? (
            <div className="py-20 text-center">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-3">
                <GraduationCap size={24} />
              </div>
              <h3 className="text-base font-bold text-gray-900">No students found</h3>
              <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                No enrolled students matched your search criteria. Try modifying your filters or enroll a new student.
              </p>
              <Link
                href="/admission/new"
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-purple-600 text-white text-xs font-bold rounded-xl shadow-md hover:bg-purple-700 transition-all"
              >
                <UserPlus size={14} />
                <span>Add Student Admission</span>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/80 border-b border-gray-100 text-[11px] uppercase font-bold text-gray-400 tracking-wider">
                    {/* SA-03 Select All Checkbox */}
                    <th className="py-3.5 px-4 w-10 text-center">
                      <button
                        type="button"
                        onClick={handleSelectAll}
                        className="text-gray-400 hover:text-purple-600 transition-colors"
                      >
                        {selectedIds.length > 0 && selectedIds.length === students.length ? (
                          <CheckSquare size={16} className="text-purple-600" />
                        ) : (
                          <Square size={16} />
                        )}
                      </button>
                    </th>
                    <th className="py-3.5 px-4">Adm No</th>
                    <th className="py-3.5 px-6">Student Name</th>
                    <th className="py-3.5 px-4">Classes &amp; Enrolled</th>
                    <th className="py-3.5 px-4">Session</th>
                    <th className="py-3.5 px-4">Admission Date</th>
                    <th className="py-3.5 px-4">Parent Contact</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
                  {students.map((st) => {
                    const isSelected = selectedIds.includes(st.id);
                    const extraClasses = st.classEnrollments?.filter((e) => e.classId !== st.class.id) || [];

                    return (
                      <tr
                        key={st.id}
                        className={`transition-colors ${
                          isSelected ? 'bg-purple-50/80' : 'hover:bg-purple-50/30'
                        }`}
                      >
                        {/* SA-03 Row Selection Checkbox */}
                        <td className="py-4 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => toggleSelectOne(st.id)}
                            className="text-gray-400 hover:text-purple-600"
                          >
                            {isSelected ? (
                              <CheckSquare size={16} className="text-purple-600" />
                            ) : (
                              <Square size={16} />
                            )}
                          </button>
                        </td>

                        {/* Admission No */}
                        <td className="py-4 px-4">
                          <span className="font-mono text-xs font-bold px-2.5 py-1 bg-gray-100 text-gray-800 rounded-lg">
                            {st.admissionNo}
                          </span>
                        </td>

                        {/* Student Name */}
                        <td className="py-4 px-6">
                          <button
                            type="button"
                            onClick={() => handleOpenDetailDrawer(st)}
                            className="flex items-center gap-3 group text-left"
                          >
                            <div
                              className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white text-xs shadow-sm ${
                                st.gender === 'FEMALE'
                                  ? 'bg-gradient-to-br from-pink-500 to-rose-600'
                                  : 'bg-gradient-to-br from-blue-500 to-indigo-600'
                              }`}
                            >
                              {st.firstName[0]}
                            </div>
                            <div>
                              <p className="font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                                {st.firstName} {st.lastName}
                              </p>
                              <p className="text-[10px] text-gray-400">Roll: {st.rollNo || 'N/A'}</p>
                            </div>
                          </button>
                        </td>

                        {/* SA-06 Class & Multi-Class badges */}
                        <td className="py-4 px-4">
                          <div className="flex flex-col gap-1">
                            <span className="inline-flex items-center gap-1 font-bold text-gray-900 bg-purple-50 text-purple-700 px-2 py-0.5 rounded-lg border border-purple-100 text-[11px] w-fit">
                              Class {st.class?.name || 'N/A'} - {st.section?.name || 'A'}
                            </span>
                            {extraClasses.length > 0 && (
                              <span className="text-[10px] text-indigo-600 font-semibold">
                                +{extraClasses.length} Extra Class{extraClasses.length > 1 ? 'es' : ''}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* SA-04 Session Badge */}
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center gap-1 font-mono text-[11px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
                            {st.session || CURRENT_SESSION}
                          </span>
                        </td>

                        {/* SA-03 Admission Date */}
                        <td className="py-4 px-4 font-mono text-[11px] text-gray-600">
                          {st.admissionDate ? new Date(st.admissionDate).toLocaleDateString('en-IN') : 'N/A'}
                        </td>

                        {/* Parent Phone */}
                        <td className="py-4 px-4">
                          {st.parent?.fatherPhone || st.user?.phone ? (
                            <a
                              href={`tel:${st.parent?.fatherPhone || st.user?.phone}`}
                              className="inline-flex items-center gap-1 font-mono text-gray-600 hover:text-purple-600 text-[11px]"
                            >
                              <Phone size={11} className="text-gray-400" />
                              <span>{st.parent?.fatherPhone || st.user?.phone}</span>
                            </a>
                          ) : (
                            <span className="text-gray-400 italic">--</span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="py-4 px-4">
                          <span
                            className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                              st.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                st.isActive ? 'bg-emerald-500' : 'bg-rose-500'
                              }`}
                            />
                            {st.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>

                        {/* Actions (SA-05 Quick View, SA-06 Assign Classes, Full Profile) */}
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* SA-05 Quick View Drawer Button */}
                            <button
                              type="button"
                              onClick={() => handleOpenDetailDrawer(st)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 font-bold text-xs transition-colors"
                              title="Quick View Details"
                            >
                              <Eye size={13} />
                              <span className="hidden md:inline">Quick View</span>
                            </button>

                            {/* SA-06 Multi-Class Assignment */}
                            <button
                              type="button"
                              onClick={() => handleOpenAssignModal(st)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-bold text-xs transition-colors"
                              title="Assign to Classes"
                            >
                              <BookOpen size={13} />
                              <span className="hidden lg:inline">Classes</span>
                            </button>

                            <Link
                              href={`/students/${st.id}`}
                              className="p-1.5 rounded-xl text-gray-400 hover:text-purple-600 hover:bg-gray-100 transition-colors"
                              title="Full Profile"
                            >
                              <ArrowRight size={14} />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="p-4 bg-gray-50/60 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-500">
                Page <strong>{page}</strong> of <strong>{totalPages}</strong>
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* SA-03: MODAL FOR BULK UPDATE (Admission Date, Session, Class, Section)      */}
        {/* ========================================================================= */}
        {isBulkModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 relative">
              <button
                onClick={() => setIsBulkModalOpen(false)}
                className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-gray-100 text-gray-400"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <Edit size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Bulk Update Students</h3>
                  <p className="text-xs text-gray-500">
                    Applying changes to <strong>{selectedIds.length}</strong> selected students
                  </p>
                </div>
              </div>

              <form onSubmit={handleBulkUpdateSubmit} className="space-y-4">
                {/* SA-03 Admission Date */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Admission Date
                  </label>
                  <input
                    type="date"
                    value={bulkAdmissionDate}
                    onChange={(e) => setBulkAdmissionDate(e.target.value)}
                    className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none"
                  />
                  <p className="text-[10px] text-gray-400 mt-0.5">Leave empty to preserve existing admission dates</p>
                </div>

                {/* SA-03 Session */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Academic Session
                  </label>
                  <select
                    value={bulkSession}
                    onChange={(e) => setBulkSession(e.target.value)}
                    className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none"
                  >
                    {AVAILABLE_SESSIONS.map((s) => (
                      <option key={s} value={s}>
                        Session {s}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Optional Class & Section update */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      New Class (Optional)
                    </label>
                    <select
                      value={bulkClassId}
                      onChange={(e) => setBulkClassId(e.target.value)}
                      className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white outline-none"
                    >
                      <option value="">Do not change</option>
                      {classes.map((c) => (
                        <option key={c.id} value={c.id}>
                          Class {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Status (Optional)
                    </label>
                    <select
                      value={bulkStatus}
                      onChange={(e) => setBulkStatus(e.target.value)}
                      className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white outline-none"
                    >
                      <option value="">Do not change</option>
                      <option value="ACTIVE">Active</option>
                      <option value="INACTIVE">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-end gap-2 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsBulkModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updatingBulk}
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-md transition-all active:scale-95 disabled:opacity-50"
                  >
                    {updatingBulk ? 'Updating...' : 'Apply Bulk Updates'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SA-05: STUDENT DETAIL QUICK VIEW SLIDE-OUT DRAWER                          */}
        {/* ========================================================================= */}
        {isDrawerOpen && drawerStudent && (
          <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end animate-in fade-in">
            <div className="w-full max-w-md bg-white h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300">
              <div className="space-y-6">
                {/* Drawer Header */}
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white text-base shadow-sm ${
                        drawerStudent.gender === 'FEMALE'
                          ? 'bg-gradient-to-br from-pink-500 to-rose-600'
                          : 'bg-gradient-to-br from-blue-500 to-indigo-600'
                      }`}
                    >
                      {drawerStudent.firstName[0]}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-gray-900">
                        {drawerStudent.firstName} {drawerStudent.lastName}
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="font-mono text-xs font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                          {drawerStudent.admissionNo}
                        </span>
                        <span className="text-[10px] text-purple-600 font-bold bg-purple-50 px-2 py-0.5 rounded-full">
                          Roll: {drawerStudent.rollNo || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsDrawerOpen(false)}
                    className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Academic Quick Facts */}
                <div className="grid grid-cols-2 gap-3 bg-purple-50/60 p-4 rounded-2xl border border-purple-100">
                  <div>
                    <p className="text-[10px] font-bold text-purple-600 uppercase tracking-wider">Primary Grade</p>
                    <p className="text-xs font-extrabold text-gray-900 mt-0.5">
                      Class {drawerStudent.class.name} - {drawerStudent.section.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-purple-600 uppercase tracking-wider">Academic Session</p>
                    <p className="text-xs font-extrabold text-gray-900 mt-0.5 font-mono">
                      {drawerStudent.session || CURRENT_SESSION}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-purple-600 uppercase tracking-wider">Admission Date</p>
                    <p className="text-xs font-semibold text-gray-800 mt-0.5 font-mono">
                      {drawerStudent.admissionDate ? new Date(drawerStudent.admissionDate).toLocaleDateString('en-IN') : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-purple-600 uppercase tracking-wider">Account Status</p>
                    <p className="text-xs font-bold mt-0.5 text-emerald-600">
                      {drawerStudent.isActive ? 'Active Enrolled' : 'Inactive'}
                    </p>
                  </div>
                </div>

                {/* Multi-class assignments (SA-06) */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Enrolled Classes</h4>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-2.5 py-1 rounded-xl bg-purple-100 text-purple-800 text-xs font-bold border border-purple-200">
                      Primary: Class {drawerStudent.class.name}
                    </span>
                    {drawerStudent.classEnrollments?.filter((e) => e.classId !== drawerStudent.class.id).map((e) => (
                      <span key={e.id} className="px-2.5 py-1 rounded-xl bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-100">
                        Class {e.class.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Parent & Guardian Info */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Parent &amp; Guardian</h4>
                  <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-100 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Father Name:</span>
                      <span className="font-bold text-gray-900">{drawerStudent.parent?.fatherName || 'Not recorded'}</span>
                    </div>
                    {drawerStudent.parent?.fatherPhone && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Contact Number:</span>
                        <a href={`tel:${drawerStudent.parent.fatherPhone}`} className="font-mono text-purple-600 font-bold hover:underline">
                          {drawerStudent.parent.fatherPhone}
                        </a>
                      </div>
                    )}
                    {drawerStudent.parent?.motherName && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Mother Name:</span>
                        <span className="font-semibold text-gray-800">{drawerStudent.parent.motherName}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Address & Demographics */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Demographics</h4>
                  <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-100 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Gender / Blood Group:</span>
                      <span className="font-semibold text-gray-800">{drawerStudent.gender} • {drawerStudent.bloodGroup || 'N/A'}</span>
                    </div>
                    {drawerStudent.city && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Location:</span>
                        <span className="font-semibold text-gray-800">{drawerStudent.city}, {drawerStudent.state || 'UP'}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Drawer Bottom Actions */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsDrawerOpen(false);
                    handleOpenAssignModal(drawerStudent);
                  }}
                  className="px-4 py-2 bg-indigo-50 text-indigo-700 font-bold text-xs rounded-xl hover:bg-indigo-100 transition-colors"
                >
                  Manage Classes
                </button>

                <Link
                  href={`/students/${drawerStudent.id}`}
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow transition-colors flex items-center gap-1.5"
                >
                  <span>Open Full Profile</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SA-06: MODAL FOR MULTI-CLASS STUDENT ASSIGNMENT                           */}
        {/* ========================================================================= */}
        {isAssignModalOpen && assignStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 relative">
              <button
                onClick={() => setIsAssignModalOpen(false)}
                className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-gray-100 text-gray-400"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                  <BookOpen size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Assign to Classes</h3>
                  <p className="text-xs text-gray-500">
                    Assign <strong>{assignStudent.firstName} {assignStudent.lastName}</strong> to one or more classes
                  </p>
                </div>
              </div>

              <div className="p-3 bg-purple-50 rounded-2xl text-xs text-purple-900 mb-4">
                Primary Standard: <strong>Class {assignStudent.class.name}</strong>. Check additional elective, remedial, or special courses to enroll this student in multiple classes.
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {classes.map((cls) => {
                  const isChecked = assignedClassIds.includes(cls.id);
                  const isPrimary = cls.id === assignStudent.class.id;

                  return (
                    <label
                      key={cls.id}
                      className={`flex items-center justify-between p-3 rounded-2xl border text-xs font-semibold cursor-pointer transition-colors ${
                        isChecked
                          ? 'bg-purple-50/80 border-purple-200 text-purple-950 font-bold'
                          : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleAssignClass(cls.id)}
                          className="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                        />
                        <span>Class {cls.name}</span>
                      </div>
                      {isPrimary && (
                        <span className="text-[10px] bg-purple-200 text-purple-800 px-2 py-0.5 rounded-md font-extrabold uppercase">
                          Primary Grade
                        </span>
                      )}
                    </label>
                  );
                })}
              </div>

              <div className="pt-4 mt-4 flex items-center justify-between border-t border-gray-100 text-xs">
                <span className="text-gray-500 font-semibold">
                  {assignedClassIds.length} class{assignedClassIds.length > 1 ? 'es' : ''} selected
                </span>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAssignModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveMultiClasses}
                    disabled={savingClasses}
                    className="px-5 py-2 rounded-xl font-bold bg-purple-600 hover:bg-purple-700 text-white shadow transition-all disabled:opacity-50"
                  >
                    {savingClasses ? 'Saving...' : 'Save Assignments'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
