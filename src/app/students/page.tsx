'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/layouts/DashboardLayout';
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
  AlertCircle
} from 'lucide-react';

interface StudentItem {
  id: string;
  admissionNo: string;
  rollNo?: string;
  firstName: string;
  lastName: string;
  gender: string;
  class: { id: string; name: string };
  section: { id: string; name: string };
  parent?: {
    fatherName: string;
    fatherPhone?: string;
  } | null;
  user?: {
    email: string;
    phone?: string;
  } | null;
  isActive: boolean;
}

interface ClassOption {
  id: string;
  name: string;
  sections: { id: string; name: string }[];
}

export default function StudentsPage() {
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [classes, setClasses] = useState<ClassOption[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedSectionId, setSelectedSectionId] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalStudents, setTotalStudents] = useState(0);

  // Load Classes for Dropdown
  useEffect(() => {
    fetch('/api/classes')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setClasses(data.data);
      })
      .catch((err) => console.error('Failed to load classes', err));
  }, []);

  // Fetch Students
  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set('search', search.trim());
      if (selectedClassId) params.set('classId', selectedClassId);
      if (selectedSectionId) params.set('sectionId', selectedSectionId);
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
  }, [search, selectedClassId, selectedSectionId, page]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // Current selected class sections
  const activeSections = classes.find((c) => c.id === selectedClassId)?.sections || [];

  const handleResetFilters = () => {
    setSearch('');
    setSelectedClassId('');
    setSelectedSectionId('');
    setPage(1);
  };

  const handlePrint = () => {
    window.print();
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
              Active student roster, academic grade allocation, and parent contacts
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handlePrint}
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
        {/* 2. FILTER & SEARCH TOOLBAR                                                */}
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
        {/* 3. STUDENTS TABLE                                                         */}
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
                    <th className="py-3.5 px-6">Adm No</th>
                    <th className="py-3.5 px-6">Student Name</th>
                    <th className="py-3.5 px-6">Class & Sec</th>
                    <th className="py-3.5 px-6">Gender</th>
                    <th className="py-3.5 px-6">Father Name</th>
                    <th className="py-3.5 px-6">Contact</th>
                    <th className="py-3.5 px-6">Status</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
                  {students.map((st) => (
                    <tr key={st.id} className="hover:bg-purple-50/40 transition-colors">
                      {/* Admission No */}
                      <td className="py-4 px-6">
                        <span className="font-mono text-xs font-bold px-2.5 py-1 bg-gray-100 text-gray-800 rounded-lg">
                          {st.admissionNo}
                        </span>
                      </td>

                      {/* Student Name */}
                      <td className="py-4 px-6">
                        <Link
                          href={`/students/${st.id}`}
                          className="flex items-center gap-3 group"
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
                            <p className="text-[10px] text-gray-400">Roll No: {st.rollNo || 'N/A'}</p>
                          </div>
                        </Link>
                      </td>

                      {/* Class & Section */}
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-1 font-bold text-gray-900 bg-purple-50 text-purple-700 px-2.5 py-1 rounded-lg border border-purple-100 text-[11px]">
                          Class {st.class?.name || 'N/A'} - {st.section?.name || 'A'}
                        </span>
                      </td>

                      {/* Gender */}
                      <td className="py-4 px-6">
                        <span
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                            st.gender === 'FEMALE'
                              ? 'bg-pink-50 text-pink-700'
                              : 'bg-blue-50 text-blue-700'
                          }`}
                        >
                          {st.gender}
                        </span>
                      </td>

                      {/* Father Name */}
                      <td className="py-4 px-6 font-medium text-gray-800">
                        {st.parent?.fatherName || 'Not recorded'}
                      </td>

                      {/* Phone */}
                      <td className="py-4 px-6">
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
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                            st.isActive
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-rose-50 text-rose-700'
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

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <Link
                          href={`/students/${st.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 font-bold text-xs transition-colors"
                        >
                          <Eye size={13} />
                          <span>Profile</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
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
      </div>
    </DashboardLayout>
  );
}
