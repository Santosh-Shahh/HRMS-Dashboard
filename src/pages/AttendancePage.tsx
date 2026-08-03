import { useState, useMemo } from 'react';
import { Fingerprint, Clock, UserX, AlertTriangle, Download, CheckSquare } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import PageHeader from '../components/shared/PageHeader';
import StatsCard from '../components/shared/StatsCard';
import TabBar from '../components/shared/TabBar';
import StatusBadge from '../components/shared/StatusBadge';
import Modal from '../components/shared/Modal';
import FormField from '../components/shared/FormField';
import Toast from '../components/Toast';
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
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);
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
    setToast({ message: 'Attendance marked successfully.', type: 'success' });
  };

  const handleBulkUpdate = () => {
    setBulkOpen(false);
    setToast({ message: 'Bulk attendance updated for selected employees.', type: 'success' });
  };

  const handleExportCSV = () => {
    setToast({ message: 'Attendance report exported as CSV.', type: 'success' });
  };

  return (
    <div className="max-w-[1600px] mx-auto">
      <PageHeader
        title="Attendance Management"
        subtitle="Track and manage employee attendance"
        breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Attendance' }]}
        actions={
          <div className="flex gap-3">
            <button onClick={handleExportCSV} className="px-4 py-2 bg-white border rounded-lg hover:bg-slate-50 flex items-center gap-2 text-sm"><Download size={16} /> Export CSV</button>
            <button onClick={() => setBulkOpen(true)} className="px-4 py-2 bg-white border rounded-lg hover:bg-slate-50 flex items-center gap-2 text-sm"><CheckSquare size={16} /> Bulk Update</button>
            <button onClick={() => setMarkOpen(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm"><Fingerprint size={16} /> Mark Attendance</button>
          </div>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
        <StatsCard title="Attendance %" value={`${todayAttendanceSummary.attendancePercentage}%`} subtitle="Today's overall rate" icon={<Fingerprint size={20} />} color="blue" progress={todayAttendanceSummary.attendancePercentage} />
        <StatsCard title="Present Today" value={todayAttendanceSummary.totalPresent} subtitle="Employees checked in" icon={<Clock size={20} />} color="green" />
        <StatsCard title="Late Arrivals" value={todayAttendanceSummary.totalLate} subtitle="Arrived after 9:30 AM" icon={<AlertTriangle size={20} />} color="amber" />
        <StatsCard title="Absent Today" value={todayAttendanceSummary.totalAbsent} subtitle="Did not check in" icon={<UserX size={20} />} color="red" />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-5 mb-6">
        <div className="bg-white rounded-xl border shadow-sm p-6">
          <h3 className="font-bold mb-4">Monthly Attendance Trend (%)</h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyAttendanceTrend}>
                <XAxis dataKey="month" />
                <YAxis domain={[80, 100]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="present" name="Present %" stroke="#10b981" strokeWidth={3} />
                <Line type="monotone" dataKey="late" name="Late %" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" />
                <Line type="monotone" dataKey="absent" name="Absent %" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white rounded-xl border shadow-sm p-6">
          <h3 className="font-bold mb-4">Department Attendance Comparison</h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentAttendance}>
                <XAxis dataKey="department" angle={-30} textAnchor="end" height={60} tick={{ fontSize: 11 }} />
                <YAxis domain={[80, 100]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="present" name="Present %" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="late" name="Late %" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="p-4 border-b">
          <TabBar tabs={viewTabs} activeTab={view} onChange={setView} />
        </div>
        <div className="p-4 flex flex-wrap items-center gap-3 border-b">
          <input type="date" value={selectedDate} onChange={e => { setSelectedDate(e.target.value); setPage(1); }} className="px-3 py-2 border rounded-lg text-sm" />
          <input placeholder="Search employee..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} className="px-3 py-2 border rounded-lg text-sm min-w-[200px]" />
          <select value={deptFilter} onChange={e => { setDeptFilter(e.target.value); setPage(1); }} className="px-3 py-2 border rounded-lg text-sm">
            <option value="">All Departments</option>
            {['Engineering', 'Call Center', 'Hunt Ads', 'Support', 'HR', 'Finance', 'Marketing', 'Management'].map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }} className="px-3 py-2 border rounded-lg text-sm">
            <option value="">All Statuses</option>
            {['Present', 'Absent', 'Late', 'Half Day'].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b bg-slate-50/80 text-xs uppercase text-slate-500">
                <th className="px-4 py-3">Employee</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Check In</th>
                <th className="px-4 py-3">Check Out</th>
                <th className="px-4 py-3">Work Hours</th>
                <th className="px-4 py-3">Overtime</th>
              </tr>
            </thead>
            <tbody>
              {pagedRecords.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-slate-400">No attendance records for this date.</td></tr>
              ) : (
                pagedRecords.map(r => (
                  <tr key={r.id} className="border-b hover:bg-slate-50/50">
                    <td className="px-4 py-3">
                      <p className="font-medium">{r.employeeName}</p>
                      <p className="text-xs text-slate-400">{r.employeeId}</p>
                    </td>
                    <td className="px-4 py-3">{r.department}</td>
                    <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                    <td className="px-4 py-3 font-mono text-xs">{r.checkIn}</td>
                    <td className="px-4 py-3 font-mono text-xs">{r.checkOut}</td>
                    <td className="px-4 py-3">{r.workHours}</td>
                    <td className="px-4 py-3 text-xs">{r.overtime !== '0h 0m' ? <span className="text-blue-600 font-medium">{r.overtime}</span> : <span className="text-slate-300">—</span>}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t flex items-center justify-between text-sm">
            <span className="text-slate-500">Showing {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, dayRecords.length)} of {dayRecords.length}</span>
            <div className="flex gap-1">
              <button className="px-3 py-1 border rounded hover:bg-slate-50 disabled:opacity-40" onClick={() => setPage(p => p - 1)} disabled={page === 1}>Prev</button>
              <button className="px-3 py-1 border rounded hover:bg-slate-50 disabled:opacity-40" onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>Next</button>
            </div>
          </div>
        )}
      </div>

      {/* Mark Attendance Modal */}
      <Modal isOpen={markOpen} onClose={() => setMarkOpen(false)} title="Mark Attendance" size="md"
        footer={<>
          <button onClick={() => setMarkOpen(false)} className="px-4 py-2 border rounded-lg text-sm">Cancel</button>
          <button onClick={handleMarkAttendance} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">Mark Attendance</button>
        </>}
      >
        <div className="space-y-4">
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
          <button onClick={() => setBulkOpen(false)} className="px-4 py-2 border rounded-lg text-sm">Cancel</button>
          <button onClick={handleBulkUpdate} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">Update All</button>
        </>}
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">This will mark all unrecorded employees for today as the selected status.</p>
          <FormField label="Default Status" name="bulkStatus" type="select" value="Present" onChange={() => {}} options={[{ value: 'Present', label: 'Present' }, { value: 'Absent', label: 'Absent' }]} />
          <FormField label="Date" name="bulkDate" type="date" value={selectedDate} onChange={() => {}} />
        </div>
      </Modal>

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
}
