'use client';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { StatCard } from '@/components/ui';
import { GraduationCap, CheckSquare, BookOpen, Award, Clock, Calendar } from 'lucide-react';

export default function StudentDashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-cyan-600 to-blue-700 rounded-2xl p-6 text-white">
          <h2 className="text-2xl font-bold">Hello, Aarav! 👋</h2>
          <p className="text-cyan-200 mt-1">Class 10-A | Roll No: 1 | ADM251000</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="My Attendance" value="92%" icon={<CheckSquare size={24} />} color="green" />
          <StatCard title="Pending Homework" value="2" icon={<BookOpen size={24} />} color="yellow" />
          <StatCard title="Last Exam Score" value="87%" icon={<Award size={24} />} color="purple" />
          <StatCard title="Next Exam In" value="12 Days" icon={<Clock size={24} />} color="orange" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><Calendar size={20} /> Today&apos;s Timetable</h3>
            <div className="space-y-2">
              {[
                { period: 1, time: '08:00-08:45', subject: 'Mathematics', teacher: 'Mr. Arun Sharma' },
                { period: 2, time: '08:45-09:30', subject: 'English', teacher: 'Mrs. Priya Singh' },
                { period: 3, time: '09:45-10:30', subject: 'Science', teacher: 'Mr. Deepak Verma' },
                { period: 4, time: '10:30-11:15', subject: 'Hindi', teacher: 'Mrs. Sunita Gupta' },
                { period: 5, time: '11:30-12:15', subject: 'Social Science', teacher: 'Mrs. Kavita Mishra' },
                { period: 6, time: '12:15-01:00', subject: 'Computer', teacher: 'Mr. Amit Yadav' },
              ].map((p) => (
                <div key={p.period} className="flex items-center gap-4 p-3 rounded-xl bg-gray-50">
                  <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center text-sm font-bold text-primary-700">{p.period}</div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{p.subject}</p>
                    <p className="text-xs text-gray-500">{p.teacher}</p>
                  </div>
                  <span className="text-xs text-gray-400 font-mono">{p.time}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><BookOpen size={20} /> Pending Homework</h3>
            <div className="space-y-3">
              {[
                { subject: 'Mathematics', title: 'Complete Exercise 5.3', due: 'Tomorrow', teacher: 'Mr. Arun Sharma' },
                { subject: 'English', title: 'Essay on Climate Change', due: 'Oct 12', teacher: 'Mrs. Priya Singh' },
              ].map((hw, i) => (
                <div key={i} className="p-4 rounded-xl border border-gray-200 hover:border-primary-300 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="badge-info">{hw.subject}</span>
                    <span className="text-xs text-red-500 font-medium">Due: {hw.due}</span>
                  </div>
                  <p className="text-sm font-medium">{hw.title}</p>
                  <p className="text-xs text-gray-500 mt-1">Assigned by: {hw.teacher}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
