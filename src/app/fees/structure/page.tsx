'use client';

import { useState, useEffect, useMemo } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { formatCurrency } from '@/utils/helpers';
import {
  CreditCard,
  Plus,
  Search,
  School,
  Settings,
  Calendar,
  CheckCircle2,
  X,
  AlertCircle,
  Tag,
  Building2
} from 'lucide-react';

interface FeeStructureItem {
  id: string;
  name: string;
  feeType: string;
  amount: number;
  frequency: string;
  academicYear: string;
  className: string;
}

const initialStructures: FeeStructureItem[] = [
  { id: 'fs-1', name: 'Monthly Tuition Fee', feeType: 'TUITION', amount: 2500, frequency: 'MONTHLY', academicYear: '2025-26', className: 'Class 10' },
  { id: 'fs-2', name: 'Computer Lab Fee', feeType: 'COMPUTER', amount: 500, frequency: 'MONTHLY', academicYear: '2025-26', className: 'Class 10' },
  { id: 'fs-3', name: 'Half-Yearly Examination Fee', feeType: 'EXAM', amount: 1500, frequency: 'HALF_YEARLY', academicYear: '2025-26', className: 'Class 10' },
  { id: 'fs-4', name: 'Annual Development Charges', feeType: 'ANNUAL', amount: 5000, frequency: 'YEARLY', academicYear: '2025-26', className: 'Class 10' },

  { id: 'fs-5', name: 'Monthly Tuition Fee', feeType: 'TUITION', amount: 2200, frequency: 'MONTHLY', academicYear: '2025-26', className: 'Class 9' },
  { id: 'fs-6', name: 'Computer Lab Fee', feeType: 'COMPUTER', amount: 500, frequency: 'MONTHLY', academicYear: '2025-26', className: 'Class 9' },
  { id: 'fs-7', name: 'Annual Development Charges', feeType: 'ANNUAL', amount: 5000, frequency: 'YEARLY', academicYear: '2025-26', className: 'Class 9' },

  { id: 'fs-8', name: 'Primary Tuition Fee', feeType: 'TUITION', amount: 1800, frequency: 'MONTHLY', academicYear: '2025-26', className: 'Class 5' },
  { id: 'fs-9', name: 'Activity & Sports Fee', feeType: 'ACTIVITY', amount: 300, frequency: 'MONTHLY', academicYear: '2025-26', className: 'Class 5' },
];

export default function FeeStructurePage() {
  const [structures, setStructures] = useState<FeeStructureItem[]>(initialStructures);
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [feeType, setFeeType] = useState('TUITION');
  const [amount, setAmount] = useState('2500');
  const [frequency, setFrequency] = useState('MONTHLY');
  const [className, setClassName] = useState('Class 10');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleCreateStructure = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newItem: FeeStructureItem = {
      id: `fs-${Date.now()}`,
      name: name.trim(),
      feeType,
      amount: Number(amount) || 0,
      frequency,
      academicYear: '2025-26',
      className,
    };

    setStructures([newItem, ...structures]);
    showNotification('success', `Fee head "${name}" configured for ${className}!`);
    setIsAddModalOpen(false);
    setName('');
  };

  const filteredStructures = useMemo(() => {
    return structures.filter((s) => {
      const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
      const matchClass = classFilter === 'ALL' || s.className === classFilter;
      return matchSearch && matchClass;
    });
  }, [structures, search, classFilter]);

  const uniqueClasses = Array.from(new Set(structures.map((s) => s.className)));

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
                <CreditCard size={18} />
              </div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">Fee Structure</h1>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Class-wise tuition, transport, lab, and annual fee schedule configuration
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition-all transform active:scale-95"
          >
            <Plus size={15} />
            <span>Add Fee Structure</span>
          </button>
        </div>

        {/* 2. Filters & Toolbar */}
        <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search fee heads (e.g. Tuition)..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200/80 rounded-xl text-xs outline-none focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="text-xs font-semibold px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none"
            >
              <option value="ALL">All Classes</option>
              {uniqueClasses.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* 3. Table */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-[11px] uppercase font-bold text-gray-400 tracking-wider">
                  <th className="py-3.5 px-6">Fee Head Name</th>
                  <th className="py-3.5 px-6">Class Grade</th>
                  <th className="py-3.5 px-6">Category Type</th>
                  <th className="py-3.5 px-6">Billing Frequency</th>
                  <th className="py-3.5 px-6">Academic Year</th>
                  <th className="py-3.5 px-6 text-right">Fee Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
                {filteredStructures.map((s) => (
                  <tr key={s.id} className="hover:bg-purple-50/30 transition-colors">
                    <td className="py-4 px-6 font-bold text-gray-900">{s.name}</td>
                    <td className="py-4 px-6">
                      <span className="font-semibold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-100 text-[11px]">
                        {s.className}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-mono text-[11px] text-gray-600 bg-gray-100 px-2 py-0.5 rounded-md">
                        {s.feeType}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-medium text-gray-600">{s.frequency}</td>
                    <td className="py-4 px-6 text-gray-500">{s.academicYear}</td>
                    <td className="py-4 px-6 text-right font-black text-sm text-emerald-600">
                      {formatCurrency(s.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. Modal: Add Structure */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 relative">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-gray-100 text-gray-400"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <CreditCard size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Add Fee Head</h3>
                  <p className="text-xs text-gray-500">Configure class billing item</p>
                </div>
              </div>

              <form onSubmit={handleCreateStructure} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Fee Head Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Science Lab Fee"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Applicable Class
                    </label>
                    <select
                      value={className}
                      onChange={(e) => setClassName(e.target.value)}
                      className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none"
                    >
                      {['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'].map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Billing Cycle
                    </label>
                    <select
                      value={frequency}
                      onChange={(e) => setFrequency(e.target.value)}
                      className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none"
                    >
                      <option value="MONTHLY">Monthly</option>
                      <option value="QUARTERLY">Quarterly</option>
                      <option value="HALF_YEARLY">Half Yearly</option>
                      <option value="YEARLY">Yearly (Annual)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Fee Amount (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none font-bold"
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
                    Save Structure
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
