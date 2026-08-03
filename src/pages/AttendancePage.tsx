import { useState, useMemo } from 'react';
import { Fingerprint, Clock, UserX, AlertTriangle, Download, CheckSquare } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import PageHeader from '../components/shared/PageHeader';
import StatsCard from '../components/shared/StatsCard';
import TabBar from '../components/shared/TabBar';
import StatusBadge from '../components/shared/StatusBadge';
import Modal from '../components/shared/Modal';
import FormField from '../components/shared/FormField';
import { useToast } from '../contexts/ToastContext';
import { attendanceRecords, todayAttendanceSummary, monthlyAttendanceTrend, departmentAttendance } from '../data/attendance';

const viewTabs = [
  { id: 'daily', label: 'Daily View' },
  { id: 'weekly', label: 'Weekly View' },
  { id: 'monthly', label: 'Monthly View' },
];

export default function AttendancePage() {
  const [view, setView] = useState('daily');
  const [selectedDate, setSelectedDate] = useState('2026-07-18');
  const [deptFilter, setDeptFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [markOpen, setMarkOpen] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [markForm, setMarkForm] = useState({ employeeId: '', status: 'Present', checkIn: '09:00', checkOut: '18:00' });
  const { addToast } = useToast();
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const dayRecords = useMemo(() => {
    let records = attendanceRecords.filter(r => r.date === selectedDate);
    if (deptFilter) records = records.filter(r => r.department === deptFilter);
    if (statusFilter) records = records.filter(r => r.status === statusFilter);
    if (search) {
      const q = search.toLowerCase();
      records = records.filter(r => r.employeeName.toLowerCase().includes(q) || r.employeeId.toLowerCase().includes(q));
    }
    return records;
  }, [selectedDate, deptFilter, statusFilter, search]);

  const totalPages = Math.ceil(dayRecords.length / pageSize);
  const pagedRecords = dayRecords.slice((page - 1) * pageSize, page * pageSize);

  const handleMarkAttendance = () => {
    setMarkOpen(false);
    addToast('Attendance marked successfully.', 'success');
  };

  const handleBulkUpdate = () => {
    setBulkOpen(false);
    addToast('Bulk attendance updated for selected employees.', 'success');
  };

  const handleExportCSV = () => {
    addToast('Attendance report exported as CSV.', 'success');
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-6">
      <PageHeader
        title="Attendance Management"
        subtitle="Track and manage employee attendance"
        actions={
          <div className="flex gap-3">
            <button onClick={handleExportCSV} className="px-4 py-2 bg-white border border-slate-200 shadow-sm text-slate-700 font-medium rounded-lg hover:bg-slate-50 flex items-center gap-2 text-sm transition-colors"><Download size={16} /> Export CSV</button>
            <button onClick={() => setBulkOpen(true)} className="px-4 py-2 bg-white border border-slate-200 shadow-sm text-slate-700 font-medium rounded-lg hover:bg-slate-50 flex items-center gap-2 text-sm transition-colors"><CheckSquare size={16} /> Bulk Update</button>
            <button onClick={() => setMarkOpen(true)} className="px-4 py-2 bg-blue-600 shadow-sm text-white font-medium rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm transition-colors"><Fingerprint size={16} /> Mark Attendance</button>
          </div>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatsCard title="Attendance %" value={`${todayAttendanceSummary.attendancePercentage}%`} subtitle="Today's overall rate" icon={<Fingerprint size={20} />} color="blue" progress={todayAttendanceSummary.attendancePercentage} />
        <StatsCard title="Present Today" value={todayAttendanceSummary.totalPresent} subtitle="Employees checked in" icon={<Clock size={20} />} color="green" />
        <StatsCard title="Late Arrivals" value={todayAttendanceSummary.totalLate} subtitle="Arrived after 9:30 AM" icon={<AlertTriangle size={20} />} color="amber" />
        <StatsCard title="Absent Today" value={todayAttendanceSummary.totalAbsent} subtitle="Did not check in" icon={<UserX size={20} />} color="red" />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="font-bold text-slate-800 mb-6">Monthly Attendance Trend (%)</h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyAttendanceTrend} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis domain={[80, 100]} tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                <Line type="monotone" dataKey="present" name="Present %" stroke="#10b981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="late" name="Late %" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                <Line type="monotone" dataKey="absent" name="Absent %" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="font-bold text-slate-800 mb-6">Department Attendance Comparison</h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentAttendance} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <XAxis dataKey="department" angle={-30} textAnchor="end" height={60} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis domain={[80, 100]} tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="present" name="Present %" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar dataKey="late" name="Late %" fill="#f59e0b" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-2 border-b border-slate-100 bg-slate-50/50">
          <TabBar tabs={viewTabs} activeTab={view} onChange={setView} />
        </div>
        <div className="p-4 flex flex-wrap items-center gap-3 border-b border-slate-100 bg-white">
          <input type="date" value={selectedDate} onChange={e => { setSelectedDate(e.target.value); setPage(1); }} className="px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
          <input placeholder="Search employee..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} className="px-3 py-2 border border-slate-200 rounded-lg text-sm min-w-[250px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
          <select value={deptFilter} onChange={e => { setDeptFilter(e.target.value); setPage(1); }} className="px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
            <option value="">All Departments</option>
            {['Engineering', 'Call Center', 'Hunt Ads', 'Support', 'HR', 'Finance', 'Marketing', 'Management'].map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }} className="px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
            <option value="">All Statuses</option>
            {['Present', 'Absent', 'Late', 'Half Day'].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-xs uppercase text-slate-500 font-semibold tracking-wider">
                <th className="px-4 py-3">Employee</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Check In</th>
                <th className="px-4 py-3">Check Out</th>
                <th className="px-4 py-3">Work Hours</th>
                <th className="px-4 py-3">Overtime</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pagedRecords.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-slate-500 font-medium">No attendance records for this date.</td></tr>
              ) : (
                pagedRecords.map(r => (
                  <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900">{r.employeeName}</p>
                      <p className="text-xs text-slate-500">{r.employeeId}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-700">{r.department}</td>
                    <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-600">{r.checkIn}</td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-600">{r.checkOut}</td>
                    <td className="px-4 py-3 font-medium text-slate-700">{r.workHours}</td>
                    <td className="px-4 py-3 text-xs">{r.overtime !== '0h 0m' ? <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded font-medium">{r.overtime}</span> : <span className="text-slate-300">—</span>}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between text-sm bg-slate-50">
            <span className="text-slate-500 font-medium">Showing {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, dayRecords.length)} of {dayRecords.length}</span>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 bg-white border border-slate-200 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-slate-700 transition-colors shadow-sm" onClick={() => setPage(p => p - 1)} disabled={page === 1}>Previous</button>
              <button className="px-3 py-1.5 bg-white border border-slate-200 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-slate-700 transition-colors shadow-sm" onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>Next</button>
            </div>
          </div>
        )}
      </div>

      {/* Mark Attendance Modal */}
      <Modal isOpen={markOpen} onClose={() => setMarkOpen(false)} title="Mark Attendance" size="md"
        footer={<>
          <button onClick={() => setMarkOpen(false)} className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-sm font-medium transition-colors">Cancel</button>
          <button onClick={handleMarkAttendance} className="px-4 py-2 bg-blue-600 shadow-sm text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors">Mark Attendance</button>
        </>}
      >
        <div className="space-y-4 p-1">
          <FormField label="Employee ID" name="employeeId" value={markForm.employeeId} onChange={(n, v) => setMarkForm(f => ({ ...f, [n]: v }))} placeholder="e.g. EMP-1001" required />
          <FormField label="Status" name="status" type="select" value={markForm.status} onChange={(n, v) => setMarkForm(f => ({ ...f, [n]: v }))} options={[{ value: 'Present', label: 'Present' }, { value: 'Absent', label: 'Absent' }, { value: 'Half Day', label: 'Half Day' }, { value: 'Late', label: 'Late' }]} />
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Check In" name="checkIn" value={markForm.checkIn} onChange={(n, v) => setMarkForm(f => ({ ...f, [n]: v }))} />
            <FormField label="Check Out" name="checkOut" value={markForm.checkOut} onChange={(n, v) => setMarkForm(f => ({ ...f, [n]: v }))} />
          </div>
        </div>
      </Modal>

      {/* Bulk Update Modal */}
      <Modal isOpen={bulkOpen} onClose={() => setBulkOpen(false)} title="Bulk Attendance Update" size="md"
        footer={<>
          <button onClick={() => setBulkOpen(false)} className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-sm font-medium transition-colors">Cancel</button>
          <button onClick={handleBulkUpdate} className="px-4 py-2 bg-blue-600 shadow-sm text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors">Update All</button>
        </>}
      >
        <div className="space-y-4 p-1">
          <div className="bg-amber-50 border border-amber-100 rounded-lg p-3">
            <p className="text-sm text-amber-800 font-medium">This will mark all unrecorded employees for the selected date as the default status.</p>
          </div>
          <FormField label="Default Status" name="bulkStatus" type="select" value="Present" onChange={() => {}} options={[{ value: 'Present', label: 'Present' }, { value: 'Absent', label: 'Absent' }]} />
          <FormField label="Date" name="bulkDate" type="date" value={selectedDate} onChange={() => {}} />
        </div>
      </Modal>
    </div>
  );
}
