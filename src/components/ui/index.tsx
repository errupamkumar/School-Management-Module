'use client';
import { ReactNode, useState } from 'react';
import { cn } from '@/utils/helpers';
import { X, ChevronLeft, ChevronRight, Download, Printer, FileSpreadsheet, FileText } from 'lucide-react';

// ============ STAT CARD ============
interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: { value: number; label: string };
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'orange';
}

const colorMap = {
  blue: 'from-blue-500 to-blue-600',
  green: 'from-green-500 to-green-600',
  red: 'from-red-500 to-red-600',
  yellow: 'from-amber-500 to-amber-600',
  purple: 'from-purple-500 to-purple-600',
  orange: 'from-orange-500 to-orange-600',
};

export function StatCard({ title, value, icon, trend, color = 'blue' }: StatCardProps) {
  return (
    <div className="stat-card bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">{value}</p>
          {trend && (
            <p className={cn('text-xs mt-2 font-medium', trend.value >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400')}>
              {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}% {trend.label}
            </p>
          )}
        </div>
        <div className={cn('w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white', colorMap[color])}>
          {icon}
        </div>
      </div>
    </div>
  );
}

// ============ PAGE HEADER ============
interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{title}</h1>
        {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

// ============ DATA TABLE ============
interface Column<T> {
  key: string;
  title: string;
  render?: (item: T) => ReactNode;
  sortable?: boolean;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onExport?: (format: 'excel' | 'csv' | 'pdf') => void;
  onPrint?: () => void;
  searchable?: boolean;
  onSearch?: (query: string) => void;
  emptyMessage?: string;
  pageSize?: number;
  totalItems?: number;
}

export function DataTable<T extends Record<string, any>>({
  columns, data, loading, page = 1, totalPages = 1, onPageChange, onExport, onPrint, searchable, onSearch, emptyMessage = 'No data found', pageSize = 10, totalItems,
}: DataTableProps<T>) {
  const [search, setSearch] = useState('');

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <span>Page {page} of {totalPages}</span>
          {totalItems && <span className="text-gray-400 dark:text-gray-500">({totalItems} records)</span>}
        </div>
        <div className="flex items-center gap-2">
          {searchable && (
            <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); onSearch?.(e.target.value); }} placeholder="Search..." className="form-input w-48 text-sm" />
          )}
          {onExport && (
            <>
              <button onClick={() => onExport('excel')} className="btn-ghost text-xs" title="Export Excel"><FileSpreadsheet size={16} /></button>
              <button onClick={() => onExport('csv')} className="btn-ghost text-xs" title="Export CSV"><Download size={16} /></button>
              <button onClick={() => onExport('pdf')} className="btn-ghost text-xs" title="Export PDF"><FileText size={16} /></button>
            </>
          )}
          {onPrint && <button onClick={onPrint} className="btn-ghost text-xs" title="Print"><Printer size={16} /></button>}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="data-table w-full">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-800">
              {columns.map((col) => (
                <th key={col.key} className={cn('px-4 py-3 text-left', col.className)}>{col.title}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={columns.length} className="px-4 py-12 text-center">
                <div className="flex items-center justify-center gap-2 text-gray-400 dark:text-gray-500">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                  Loading...
                </div>
              </td></tr>
            ) : data.length === 0 ? (
              <tr><td colSpan={columns.length} className="px-4 py-12 text-center text-gray-400 dark:text-gray-500">{emptyMessage}</td></tr>
            ) : (
              data.map((item, idx) => (
                <tr key={item.id || idx} className="border-b border-gray-50 dark:border-gray-800/60 hover:bg-gray-50/50 dark:hover:bg-gray-800/40 transition-colors">
                  {columns.map((col) => (
                    <td key={col.key} className={cn('px-4 py-3', col.className)}>
                      {col.render ? col.render(item) : item[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 dark:border-gray-800">
          <button onClick={() => onPageChange?.(page - 1)} disabled={page <= 1} className="btn-ghost text-sm disabled:opacity-30">
            <ChevronLeft size={16} /> Previous
          </button>
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => onPageChange?.(p)} className={cn('w-8 h-8 rounded-lg text-sm font-medium transition-colors', p === page ? 'bg-primary-600 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800')}>
                {p}
              </button>
            ))}
          </div>
          <button onClick={() => onPageChange?.(page + 1)} disabled={page >= totalPages} className="btn-ghost text-sm disabled:opacity-30">
            Next <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

// ============ MODAL ============
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  footer?: ReactNode;
}

const sizeMap = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl', full: 'max-w-6xl' };

export function Modal({ isOpen, onClose, title, children, size = 'md', footer }: ModalProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className={cn('relative bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-2xl w-full overflow-hidden', sizeMap[size])}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"><X size={20} className="text-gray-400 dark:text-gray-500" /></button>
        </div>
        <div className="px-6 py-4 max-h-[70vh] overflow-y-auto text-gray-700 dark:text-gray-300">{children}</div>
        {footer && <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
}

// ============ FILTER BAR ============
interface FilterBarProps {
  filters: { key: string; label: string; options: { value: string; label: string }[] }[];
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
  onReset?: () => void;
  onFilter?: () => void;
}

export function FilterBar({ filters, values, onChange, onReset, onFilter }: FilterBarProps) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 mb-4">
      <div className="flex flex-wrap items-end gap-3">
        {filters.map((f) => (
          <div key={f.key} className="flex-1 min-w-[150px]">
            <label className="form-label">{f.label}</label>
            <select value={values[f.key] || ''} onChange={(e) => onChange(f.key, e.target.value)} className="form-select">
              <option value="">Select {f.label}</option>
              {f.options.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        ))}
        <div className="flex gap-2">
          {onFilter && <button onClick={onFilter} className="btn-primary">Filter</button>}
          {onReset && <button onClick={onReset} className="btn-secondary">Reset</button>}
        </div>
      </div>
    </div>
  );
}

// ============ LOADING SPINNER ============
export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClass = { sm: 'h-4 w-4', md: 'h-8 w-8', lg: 'h-12 w-12' };
  return (
    <div className="flex items-center justify-center py-12">
      <svg className={cn('animate-spin text-primary-600', sizeClass[size])} viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
    </div>
  );
}

// ============ EMPTY STATE ============
export function EmptyState({ icon, title, description, action }: { icon: ReactNode; title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center text-gray-400 dark:text-gray-500 mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
      {description && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-sm">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
