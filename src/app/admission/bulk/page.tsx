'use client';

import { useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import {
  Upload,
  Download,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  X,
  FileText
} from 'lucide-react';

export default function BulkAdmissionPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [targetClass, setTargetClass] = useState('Class 10');
  const [targetSection, setTargetSection] = useState('Section A');
  const [targetSession, setTargetSession] = useState('2025-26');
  const [admissionDate, setAdmissionDate] = useState(new Date().toISOString().split('T')[0]);
  const [importing, setImporting] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const sampleRows = [
    { name: 'Aarav Sharma', gender: 'MALE', dob: '2011-05-14', admissionDate: '2026-04-01', session: '2025-26', father: 'Ramesh Sharma', phone: '9876500001' },
    { name: 'Diya Verma', gender: 'FEMALE', dob: '2011-08-22', admissionDate: '2026-04-01', session: '2025-26', father: 'Sanjay Verma', phone: '9876500002' },
    { name: 'Kabir Gupta', gender: 'MALE', dob: '2011-03-10', admissionDate: '2026-04-02', session: '2025-26', father: 'Anil Gupta', phone: '9876500003' },
  ];

  const handleImport = (e: React.FormEvent) => {
    e.preventDefault();
    setImporting(true);
    setTimeout(() => {
      setImporting(false);
      setNotification(`Bulk import completed! 42 students enrolled into ${targetClass} ${targetSection} for Session ${targetSession}!`);
      setSelectedFile(null);
    }, 1200);
  };

  const downloadSampleTemplate = () => {
    const csvContent = 'data:text/csv;charset=utf-8,First Name,Last Name,Gender,DOB,Admission Date,Session,Father Name,Father Phone,Mother Name,Address\nAarav,Sharma,MALE,2011-05-14,2026-04-01,2025-26,Ramesh Sharma,9876500001,Suman Sharma,Civil Lines\n';
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'student_admission_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 pb-12">
        {/* Toast */}
        {notification && (
          <div className="fixed top-16 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl shadow-xl border border-emerald-200 bg-emerald-50 text-emerald-800 text-sm font-semibold animate-in slide-in-from-top-2">
            <CheckCircle2 size={18} className="text-emerald-600" />
            <span>{notification}</span>
            <button onClick={() => setNotification(null)} className="ml-2 text-gray-400">
              <X size={14} />
            </button>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Link
              href="/admission"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-700 hover:text-purple-900 transition-colors mb-2"
            >
              <ArrowLeft size={14} />
              <span>Back to Admission Hub</span>
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                <Upload size={18} />
              </div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">Bulk Student Admission</h1>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Import multiple student records and parent accounts simultaneously from CSV or Excel sheets
            </p>
          </div>

          <button
            onClick={downloadSampleTemplate}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-purple-50 text-purple-700 hover:bg-purple-100 font-bold text-xs rounded-xl border border-purple-200 transition-colors"
          >
            <Download size={14} />
            <span>Download Sample CSV Template</span>
          </button>
        </div>

        {/* Upload Form Card */}
        <form onSubmit={handleImport} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Target Grade Class
              </label>
              <select
                value={targetClass}
                onChange={(e) => setTargetClass(e.target.value)}
                className="w-full text-xs font-bold px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none"
              >
                {['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Target Section
              </label>
              <select
                value={targetSection}
                onChange={(e) => setTargetSection(e.target.value)}
                className="w-full text-xs font-bold px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none"
              >
                <option>Section A</option>
                <option>Section B</option>
                <option>Section C</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Academic Session (SA-03)
              </label>
              <select
                value={targetSession}
                onChange={(e) => setTargetSession(e.target.value)}
                className="w-full text-xs font-bold px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none"
              >
                <option value="2024-25">Session 2024-25</option>
                <option value="2025-26">Session 2025-26</option>
                <option value="2026-27">Session 2026-27</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Admission Date (SA-03)
              </label>
              <input
                type="date"
                value={admissionDate}
                onChange={(e) => setAdmissionDate(e.target.value)}
                className="w-full text-xs font-bold px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none"
              />
            </div>
          </div>

          {/* Drag and Drop Zone */}
          <div className="border-2 border-dashed border-purple-200 hover:border-purple-400 bg-purple-50/40 rounded-3xl p-8 text-center transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mx-auto mb-3">
              <FileSpreadsheet size={24} />
            </div>
            <h3 className="text-base font-bold text-gray-900">Upload CSV or XLSX File</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
              Click to browse or drag and drop your completed student roster template here. Maximum file size: 10MB.
            </p>

            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  setSelectedFile(e.target.files[0]);
                }
              }}
              className="mt-4 text-xs font-semibold text-purple-700 cursor-pointer file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-purple-600 file:text-white hover:file:bg-purple-700"
            />
          </div>

          {/* Sample Preview */}
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              Template Column Structure Preview
            </h4>
            <div className="border border-gray-100 rounded-2xl overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-50 text-[10px] uppercase font-bold text-gray-500">
                    <th className="py-2.5 px-4">Student Name</th>
                    <th className="py-2.5 px-4">Gender</th>
                    <th className="py-2.5 px-4">DOB</th>
                    <th className="py-2.5 px-4">Adm Date</th>
                    <th className="py-2.5 px-4">Session</th>
                    <th className="py-2.5 px-4">Father Name</th>
                    <th className="py-2.5 px-4">Phone Number</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-600">
                  {sampleRows.map((r, i) => (
                    <tr key={i}>
                      <td className="py-2.5 px-4 font-semibold text-gray-900">{r.name}</td>
                      <td className="py-2.5 px-4">{r.gender}</td>
                      <td className="py-2.5 px-4 font-mono">{r.dob}</td>
                      <td className="py-2.5 px-4 font-mono text-purple-700 font-bold">{r.admissionDate}</td>
                      <td className="py-2.5 px-4 font-mono text-indigo-700 font-bold">{r.session}</td>
                      <td className="py-2.5 px-4">{r.father}</td>
                      <td className="py-2.5 px-4 font-mono">{r.phone}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="pt-3 flex items-center justify-end gap-3 border-t border-gray-100">
            <button
              type="submit"
              disabled={importing}
              className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50"
            >
              {importing ? 'Validating & Importing...' : 'Import Students Now'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
