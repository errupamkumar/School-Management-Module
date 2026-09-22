'use client';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { StatCard } from '@/components/ui';
import { GraduationCap, IndianRupee, CheckSquare, BookOpen, Calendar, Award, FileText, Bell } from 'lucide-react';
import { formatCurrency } from '@/utils/helpers';

export default function ParentDashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-violet-600 to-purple-700 rounded-2xl p-6 text-white">
          <h2 className="text-2xl font-bold">Welcome, Parent!</h2>
          <p className="text-violet-200 mt-1">Stay updated with your child&apos;s progress and school activities.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Child: Aarav Kumar" value="Class 10-A" icon={<GraduationCap size={24} />} color="blue" />
          <StatCard title="Attendance (This Month)" value="92%" icon={<CheckSquare size={24} />} color="green" />
          <StatCard title="Fee Due" value={formatCurrency(3000)} icon={<IndianRupee size={24} />} color="red" />
          <StatCard title="Last Exam Rank" value="#5" icon={<Award size={24} />} color="purple" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><Calendar size={20} /> Upcoming</h3>
            <div className="space-y-3">
              {[
                { date: 'Oct 15', title: 'Half Yearly Exam Starts', type: 'EXAM' },
                { date: 'Oct 20', title: 'Diwali Vacation Begins', type: 'HOLIDAY' },
                { date: 'Nov 5', title: 'Parent-Teacher Meeting', type: 'PTM' },
              ].map((e, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex flex-col items-center justify-center">
                    <span className="text-[10px] text-primary-600 font-medium">{e.date.split(' ')[0]}</span>
                    <span className="text-sm font-bold text-primary-700">{e.date.split(' ')[1]}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{e.title}</p>
                    <span className={`text-xs ${e.type === 'EXAM' ? 'text-red-500' : e.type === 'HOLIDAY' ? 'text-green-500' : 'text-blue-500'}`}>{e.type}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><Bell size={20} /> Recent Notices</h3>
            <div className="space-y-3">
              {[
                { title: 'Fee Payment Reminder', date: '2 days ago', type: 'FEE' },
                { title: 'Half Yearly Exam Schedule Released', date: '5 days ago', type: 'EXAM' },
                { title: 'Annual Day Celebration Notice', date: '1 week ago', type: 'EVENT' },
              ].map((n, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-2 h-2 rounded-full bg-primary-500 mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">{n.title}</p>
                    <p className="text-xs text-gray-500">{n.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
