import { useState } from 'react';
import { Download, FileSpreadsheet, FileText, Printer } from 'lucide-react';
import PageHeader from '../components/shared/PageHeader';
import TabBar from '../components/shared/TabBar';
import { useToast } from '../contexts/ToastContext';
import { reportData } from '../data/reports';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';

const reportTabs = [
  { id: 'attendance', label: 'Attendance Report' },
  { id: 'leave', label: 'Leave Report' },
  { id: 'payroll', label: 'Payroll Report' },
  { id: 'recruitment', label: 'Recruitment Report' },
  { id: 'department', label: 'Department Report' },
];

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState('attendance');
  const { addToast } = useToast();

  const handleExport = (format: 'PDF' | 'CSV' | 'Excel') => {
    addToast(`${reportTabs.find(t => t.id === activeTab)?.label} exported as ${format}.`, 'success');
  };

  const commonChartProps = {
    margin: { top: 5, right: 20, bottom: 5, left: 0 }
  };

  const CustomTooltipStyle = {
    borderRadius: '8px',
    border: 'none',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
  };

  const commonAxisProps = {
    tick: { fontSize: 12, fill: '#64748b' },
    axisLine: false,
    tickLine: false
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-6">
      <PageHeader
        title="Reports & Analytics"
        subtitle="Generate, view and export organizational intelligence reports"
        actions={
          <div className="flex gap-3">
            <button
              onClick={() => handleExport('CSV')}
              className="px-4 py-2 bg-white border border-slate-200 shadow-sm text-slate-700 font-medium rounded-lg hover:bg-slate-50 flex items-center gap-2 text-sm transition-colors"
            >
              <FileSpreadsheet size={16} /> CSV
            </button>
            <button
              onClick={() => handleExport('Excel')}
              className="px-4 py-2 bg-white border border-slate-200 shadow-sm text-slate-700 font-medium rounded-lg hover:bg-slate-50 flex items-center gap-2 text-sm transition-colors"
            >
              <Download size={16} /> Excel
            </button>
            <button
              onClick={() => handleExport('PDF')}
              className="px-4 py-2 bg-blue-600 shadow-sm text-white font-medium rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm transition-colors"
            >
              <FileText size={16} /> Export PDF
            </button>
          </div>
        }
      />

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-2">
        <TabBar tabs={reportTabs} activeTab={activeTab} onChange={setActiveTab} />
      </div>

      {activeTab === 'attendance' && (
        <div className="space-y-6 animate-in fade-in duration-500">
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-6 tracking-tight">Monthly Attendance Trends (%)</h3>
              <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={reportData.attendanceReport.monthly} {...commonChartProps}>
                    <XAxis dataKey="month" {...commonAxisProps} />
                    <YAxis domain={[80, 100]} {...commonAxisProps} />
                    <Tooltip cursor={{ stroke: '#e2e8f0', strokeWidth: 2 }} contentStyle={CustomTooltipStyle} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                    <Line type="monotone" dataKey="present" name="Present %" stroke="#10b981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="late" name="Late %" stroke="#f59e0b" strokeWidth={2} dot={false} strokeDasharray="5 5" />
                    <Line type="monotone" dataKey="absent" name="Absent %" stroke="#ef4444" strokeWidth={2} dot={false} strokeDasharray="5 5" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-6 tracking-tight">Attendance Rate by Department (%)</h3>
              <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={reportData.attendanceReport.byDepartment} {...commonChartProps}>
                    <XAxis dataKey="department" angle={-30} textAnchor="end" height={60} {...commonAxisProps} />
                    <YAxis domain={[80, 100]} {...commonAxisProps} />
                    <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={CustomTooltipStyle} />
                    <Bar dataKey="rate" name="Attendance %" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={50} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'leave' && (
        <div className="space-y-6 animate-in fade-in duration-500">
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-6 tracking-tight">Leave Distribution by Type</h3>
              <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={reportData.leaveReport.byType} cx="50%" cy="50%" innerRadius={70} outerRadius={110} dataKey="count" nameKey="type" paddingAngle={5}>
                      {reportData.leaveReport.byType.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={CustomTooltipStyle} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-6 tracking-tight">Monthly Leave Frequency</h3>
              <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={reportData.leaveReport.monthly} {...commonChartProps}>
                    <XAxis dataKey="month" {...commonAxisProps} />
                    <YAxis {...commonAxisProps} />
                    <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={CustomTooltipStyle} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                    <Bar dataKey="casual" name="Casual" stackId="a" fill="#3b82f6" maxBarSize={50} />
                    <Bar dataKey="sick" name="Sick" stackId="a" fill="#ef4444" maxBarSize={50} />
                    <Bar dataKey="earned" name="Earned" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={50} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'payroll' && (
        <div className="space-y-6 animate-in fade-in duration-500">
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-6 tracking-tight">Gross vs Net Payroll Expenditure (₹ in Lakhs)</h3>
              <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={reportData.payrollReport.monthly} {...commonChartProps}>
                    <XAxis dataKey="month" {...commonAxisProps} />
                    <YAxis {...commonAxisProps} />
                    <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={CustomTooltipStyle} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                    <Bar dataKey="gross" name="Gross Pay" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    <Bar dataKey="net" name="Net Salary" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-6 tracking-tight">Payroll Expense by Department (₹ in Thousands)</h3>
              <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={reportData.payrollReport.byDepartment} {...commonChartProps}>
                    <XAxis dataKey="department" angle={-30} textAnchor="end" height={60} {...commonAxisProps} />
                    <YAxis {...commonAxisProps} />
                    <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={CustomTooltipStyle} />
                    <Bar dataKey="cost" name="Expense (k)" fill="#8b5cf6" radius={[4, 4, 0, 0]} maxBarSize={50} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'recruitment' && (
        <div className="space-y-6 animate-in fade-in duration-500">
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-6 tracking-tight">Candidate Funnel Stage Count</h3>
              <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={reportData.recruitmentReport.pipeline} layout="vertical" margin={{ top: 5, right: 20, bottom: 5, left: 30 }}>
                    <XAxis type="number" {...commonAxisProps} />
                    <YAxis dataKey="stage" type="category" width={90} {...commonAxisProps} />
                    <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={CustomTooltipStyle} />
                    <Bar dataKey="count" name="Candidates" fill="#3b82f6" radius={[0, 4, 4, 0]} maxBarSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-6 tracking-tight">Applications vs Hires</h3>
              <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={reportData.recruitmentReport.monthly} {...commonChartProps}>
                    <XAxis dataKey="month" {...commonAxisProps} />
                    <YAxis {...commonAxisProps} />
                    <Tooltip cursor={{ stroke: '#e2e8f0', strokeWidth: 2 }} contentStyle={CustomTooltipStyle} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                    <Line type="monotone" dataKey="applications" name="Applications" stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="hired" name="Hired" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'department' && (
        <div className="space-y-6 animate-in fade-in duration-500">
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-6 tracking-tight">Headcount Distribution</h3>
              <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={reportData.departmentReport.headcount} cx="50%" cy="50%" innerRadius={70} outerRadius={110} dataKey="count" nameKey="department" paddingAngle={5}>
                      {reportData.departmentReport.headcount.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={CustomTooltipStyle} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-6 tracking-tight">Average Salary by Department (₹ in Thousands)</h3>
              <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={reportData.departmentReport.avgSalary} {...commonChartProps}>
                    <XAxis dataKey="department" angle={-30} textAnchor="end" height={60} {...commonAxisProps} />
                    <YAxis {...commonAxisProps} />
                    <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={CustomTooltipStyle} />
                    <Bar dataKey="salary" name="Avg Salary (k)" fill="#ec4899" radius={[4, 4, 0, 0]} maxBarSize={50} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
