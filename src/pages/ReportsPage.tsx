import { useState } from 'react';
import { Download, FileSpreadsheet, FileText, Printer } from 'lucide-react';
import PageHeader from '../components/shared/PageHeader';
import TabBar from '../components/shared/TabBar';
import Toast from '../components/Toast';
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
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);

  const handleExport = (format: 'PDF' | 'CSV' | 'Excel') => {
    setToast({
      message: `${reportTabs.find(t => t.id === activeTab)?.label} exported as ${format}.`,
      type: 'success',
    });
  };

  return (
    <div className="max-w-[1600px] mx-auto">
      <PageHeader
        title="Reports & Analytics"
        subtitle="Generate, view and export organizational intelligence reports"
        breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Reports & Analytics' }]}
        actions={
          <div className="flex gap-2">
            <button
              onClick={() => handleExport('CSV')}
              className="px-3 py-2 bg-white border rounded-lg hover:bg-slate-50 flex items-center gap-1.5 text-xs font-medium"
            >
              <FileSpreadsheet size={16} /> CSV
            </button>
            <button
              onClick={() => handleExport('Excel')}
              className="px-3 py-2 bg-white border rounded-lg hover:bg-slate-50 flex items-center gap-1.5 text-xs font-medium"
            >
              <Download size={16} /> Excel
            </button>
            <button
              onClick={() => handleExport('PDF')}
              className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1.5 text-xs font-medium"
            >
              <FileText size={16} /> Export PDF
            </button>
          </div>
        }
      />

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden mb-6">
        <TabBar tabs={reportTabs} activeTab={activeTab} onChange={setActiveTab} />
      </div>

      {activeTab === 'attendance' && (
        <div className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border shadow-sm">
              <h3 className="font-bold mb-4">Monthly Attendance Trends (%)</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={reportData.attendanceReport.monthly}>
                    <XAxis dataKey="month" />
                    <YAxis domain={[80, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="present" name="Present %" stroke="#10b981" strokeWidth={3} />
                    <Line type="monotone" dataKey="late" name="Late %" stroke="#f59e0b" strokeWidth={2} />
                    <Line type="monotone" dataKey="absent" name="Absent %" stroke="#ef4444" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border shadow-sm">
              <h3 className="font-bold mb-4">Attendance Rate by Department (%)</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={reportData.attendanceReport.byDepartment}>
                    <XAxis dataKey="department" angle={-30} textAnchor="end" height={60} tick={{ fontSize: 11 }} />
                    <YAxis domain={[80, 100]} />
                    <Tooltip />
                    <Bar dataKey="rate" name="Attendance %" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'leave' && (
        <div className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border shadow-sm">
              <h3 className="font-bold mb-4">Leave Distribution by Type</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={reportData.leaveReport.byType} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="count" nameKey="type">
                      {reportData.leaveReport.byType.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border shadow-sm">
              <h3 className="font-bold mb-4">Monthly Leave Frequency</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={reportData.leaveReport.monthly}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="casual" name="Casual" stackId="a" fill="#3b82f6" />
                    <Bar dataKey="sick" name="Sick" stackId="a" fill="#ef4444" />
                    <Bar dataKey="earned" name="Earned" stackId="a" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'payroll' && (
        <div className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border shadow-sm">
              <h3 className="font-bold mb-4">Gross vs Net Payroll Expenditure (₹ in Lakhs)</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={reportData.payrollReport.monthly}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="gross" name="Gross Pay" fill="#6366f1" />
                    <Bar dataKey="net" name="Net Salary" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border shadow-sm">
              <h3 className="font-bold mb-4">Payroll Expense by Department (₹ in Thousands)</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={reportData.payrollReport.byDepartment}>
                    <XAxis dataKey="department" angle={-30} textAnchor="end" height={60} tick={{ fontSize: 11 }} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="cost" name="Expense (k)" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'recruitment' && (
        <div className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border shadow-sm">
              <h3 className="font-bold mb-4">Candidate Funnel Stage Count</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={reportData.recruitmentReport.pipeline} layout="vertical">
                    <XAxis type="number" />
                    <YAxis dataKey="stage" type="category" width={90} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="count" name="Candidates" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border shadow-sm">
              <h3 className="font-bold mb-4">Applications vs Hires</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={reportData.recruitmentReport.monthly}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="applications" name="Applications" stroke="#6366f1" strokeWidth={2} />
                    <Line type="monotone" dataKey="hired" name="Hired" stroke="#10b981" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'department' && (
        <div className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border shadow-sm">
              <h3 className="font-bold mb-4">Headcount Distribution</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={reportData.departmentReport.headcount} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="count" nameKey="department">
                      {reportData.departmentReport.headcount.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border shadow-sm">
              <h3 className="font-bold mb-4">Average Salary by Department (₹ in Thousands)</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={reportData.departmentReport.avgSalary}>
                    <XAxis dataKey="department" angle={-30} textAnchor="end" height={60} tick={{ fontSize: 11 }} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="salary" name="Avg Salary (k)" fill="#ec4899" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
}
