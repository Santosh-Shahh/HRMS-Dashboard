import { useState } from 'react';
import { CalendarMinus, Check, X, Plus, Filter, Clock, CheckCircle2, XCircle } from 'lucide-react';
import PageHeader from '../components/shared/PageHeader';
import StatsCard from '../components/shared/StatsCard';
import FilterBar from '../components/shared/FilterBar';
import StatusBadge from '../components/shared/StatusBadge';
import Modal from '../components/shared/Modal';
import FormField from '../components/shared/FormField';
import Toast from '../components/Toast';
import { leaveRequests as initialLeaves, leaveBalances, leaveSummary } from '../data/leaves';
import type { LeaveRequest, LeaveType } from '../types';

export default function LeavePage() {
  const [leaves, setLeaves] = useState<LeaveRequest[]>(initialLeaves);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [applyOpen, setApplyOpen] = useState(false);
  const [form, setForm] = useState({
    employeeName: '',
    department: 'Engineering',
    leaveType: 'Casual Leave' as LeaveType,
    startDate: '',
    endDate: '',
    reason: '',
  });
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);

  const filteredLeaves = leaves.filter(l => {
    if (deptFilter && l.department !== deptFilter) return false;
    if (typeFilter && l.leaveType !== typeFilter) return false;
    if (statusFilter && l.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        l.employeeName.toLowerCase().includes(q) ||
        l.employeeId.toLowerCase().includes(q) ||
        l.reason.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleAction = (id: string, action: 'Approved' | 'Rejected') => {
    setLeaves(prev =>
      prev.map(l => (l.id === id ? { ...l, status: action, approvedBy: 'Admin User' } : l))
    );
    setToast({
      message: `Leave request ${action.toLowerCase()} successfully.`,
      type: action === 'Approved' ? 'success' : 'error',
    });
  };

  const handleApply = () => {
    if (!form.employeeName || !form.startDate || !form.endDate) return;
    const start = new Date(form.startDate);
    const end = new Date(form.endDate);
    const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)) + 1);

    const newLeave: LeaveRequest = {
      id: `LV-0${leaves.length + 1}`,
      employeeId: 'EMP-1001',
      employeeName: form.employeeName,
      department: form.department as any,
      leaveType: form.leaveType,
      startDate: form.startDate,
      endDate: form.endDate,
      days,
      reason: form.reason,
      status: 'Pending',
      appliedOn: new Date().toISOString().split('T')[0],
      initials: form.employeeName.split(' ').map(n => n[0]).join('').toUpperCase(),
    };

    setLeaves([newLeave, ...leaves]);
    setApplyOpen(false);
    setForm({
      employeeName: '',
      department: 'Engineering',
      leaveType: 'Casual Leave',
      startDate: '',
      endDate: '',
      reason: '',
    });
    setToast({ message: 'Leave request submitted successfully.', type: 'success' });
  };

  return (
    <div className="max-w-[1600px] mx-auto">
      <PageHeader
        title="Leave Management"
        subtitle="Track, manage and approve employee leave requests"
        breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Leave Requests' }]}
        actions={
          <button
            onClick={() => setApplyOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm"
          >
            <Plus size={16} /> Apply Leave
          </button>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-6">
        <StatsCard
          title="Pending Requests"
          value={leaves.filter(l => l.status === 'Pending').length}
          subtitle="Requires action"
          icon={<Clock size={20} />}
          color="amber"
        />
        <StatsCard
          title="Approved Leaves"
          value={leaves.filter(l => l.status === 'Approved').length}
          subtitle="This month"
          icon={<CheckCircle2 size={20} />}
          color="green"
        />
        <StatsCard
          title="Rejected Requests"
          value={leaves.filter(l => l.status === 'Rejected').length}
          subtitle="This month"
          icon={<XCircle size={20} />}
          color="red"
        />
        <StatsCard
          title="Total On Leave"
          value={leaveSummary.totalOnLeave}
          subtitle="Currently absent"
          icon={<CalendarMinus size={20} />}
          color="blue"
        />
      </div>

      {/* Leave Balance Overview */}
      <div className="bg-white rounded-xl border shadow-sm p-6 mb-6">
        <h2 className="text-base font-bold text-slate-900 mb-4">Leave Policy & Balances (Default Allocation)</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border bg-slate-50/50">
            <span className="text-xs text-slate-500 font-semibold uppercase">Casual Leave (CL)</span>
            <p className="text-xl font-bold mt-1 text-slate-900">12 Days / Year</p>
            <p className="text-xs text-slate-400 mt-1">Paid leave for personal matters</p>
          </div>
          <div className="p-4 rounded-xl border bg-slate-50/50">
            <span className="text-xs text-slate-500 font-semibold uppercase">Sick Leave (SL)</span>
            <p className="text-xl font-bold mt-1 text-slate-900">8 Days / Year</p>
            <p className="text-xs text-slate-400 mt-1">Medical leave requiring cert &gt; 2 days</p>
          </div>
          <div className="p-4 rounded-xl border bg-slate-50/50">
            <span className="text-xs text-slate-500 font-semibold uppercase">Earned Leave (EL)</span>
            <p className="text-xl font-bold mt-1 text-slate-900">15 Days / Year</p>
            <p className="text-xs text-slate-400 mt-1">Privilege leave accrued monthly</p>
          </div>
          <div className="p-4 rounded-xl border bg-slate-50/50">
            <span className="text-xs text-slate-500 font-semibold uppercase">Unpaid Leave (LWP)</span>
            <p className="text-xl font-bold mt-1 text-slate-900">Unlimited</p>
            <p className="text-xs text-slate-400 mt-1">Subject to manager approval</p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar
        search={{ value: search, onChange: setSearch, placeholder: 'Search by employee or reason...' }}
        filters={[
          {
            name: 'department',
            label: 'All Departments',
            value: deptFilter,
            options: ['Engineering', 'Call Center', 'Hunt Ads', 'Support', 'HR', 'Finance', 'Marketing', 'Management'].map(d => ({ value: d, label: d })),
          },
          {
            name: 'type',
            label: 'All Leave Types',
            value: typeFilter,
            options: [
              { value: 'Casual Leave', label: 'Casual Leave' },
              { value: 'Sick Leave', label: 'Sick Leave' },
              { value: 'Earned Leave', label: 'Earned Leave' },
              { value: 'Unpaid Leave', label: 'Unpaid Leave' },
            ],
          },
          {
            name: 'status',
            label: 'All Statuses',
            value: statusFilter,
            options: [
              { value: 'Pending', label: 'Pending' },
              { value: 'Approved', label: 'Approved' },
              { value: 'Rejected', label: 'Rejected' },
            ],
          },
        ]}
        onFilterChange={(name, val) => {
          if (name === 'department') setDeptFilter(val);
          if (name === 'type') setTypeFilter(val);
          if (name === 'status') setStatusFilter(val);
        }}
      />

      {/* Requests Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b bg-slate-50/80 text-xs uppercase text-slate-500 font-semibold">
                <th className="p-4">Employee</th>
                <th>Leave Details</th>
                <th>Dates & Duration</th>
                <th>Applied On</th>
                <th>Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeaves.map(l => (
                <tr key={l.id} className="border-b hover:bg-slate-50/50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-800 text-white font-bold text-xs flex items-center justify-center">
                        {l.initials}
                      </div>
                      <div>
                        <b className="text-slate-900">{l.employeeName}</b>
                        <div className="text-xs text-slate-500">{l.department} • {l.employeeId}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <b className="text-xs text-blue-600 block">{l.leaveType}</b>
                    <span className="text-xs text-slate-600">"{l.reason}"</span>
                  </td>
                  <td>
                    <div className="font-medium text-slate-900">{l.startDate} to {l.endDate}</div>
                    <div className="text-xs text-slate-500">{l.days} Day(s)</div>
                  </td>
                  <td className="text-xs text-slate-500">{l.appliedOn}</td>
                  <td>
                    <StatusBadge status={l.status} />
                  </td>
                  <td className="p-4 text-right">
                    {l.status === 'Pending' ? (
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleAction(l.id, 'Approved')}
                          className="px-2.5 py-1 border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded flex items-center gap-1 text-xs font-medium"
                        >
                          <Check size={14} /> Approve
                        </button>
                        <button
                          onClick={() => handleAction(l.id, 'Rejected')}
                          className="px-2.5 py-1 border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 rounded flex items-center gap-1 text-xs font-medium"
                        >
                          <X size={14} /> Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">
                        {l.status === 'Approved' ? `Approved by ${l.approvedBy || 'Admin'}` : 'Request Rejected'}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Apply Leave Modal */}
      <Modal
        isOpen={applyOpen}
        onClose={() => setApplyOpen(false)}
        title="Apply for Leave"
        size="md"
        footer={
          <>
            <button onClick={() => setApplyOpen(false)} className="px-4 py-2 border rounded-lg text-sm">
              Cancel
            </button>
            <button onClick={handleApply} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">
              Submit Request
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <FormField
            label="Employee Name"
            name="employeeName"
            value={form.employeeName}
            onChange={(n, v) => setForm(f => ({ ...f, [n]: v }))}
            placeholder="e.g. Aarav Sharma"
            required
          />
          <FormField
            label="Department"
            name="department"
            type="select"
            value={form.department}
            onChange={(n, v) => setForm(f => ({ ...f, [n]: v }))}
            options={['Engineering', 'Call Center', 'Hunt Ads', 'Support', 'HR', 'Finance', 'Marketing', 'Management'].map(d => ({ value: d, label: d }))}
          />
          <FormField
            label="Leave Type"
            name="leaveType"
            type="select"
            value={form.leaveType}
            onChange={(n, v) => setForm(f => ({ ...f, [n]: v }))}
            options={[
              { value: 'Casual Leave', label: 'Casual Leave' },
              { value: 'Sick Leave', label: 'Sick Leave' },
              { value: 'Earned Leave', label: 'Earned Leave' },
              { value: 'Unpaid Leave', label: 'Unpaid Leave' },
            ]}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Start Date"
              name="startDate"
              type="date"
              value={form.startDate}
              onChange={(n, v) => setForm(f => ({ ...f, [n]: v }))}
              required
            />
            <FormField
              label="End Date"
              name="endDate"
              type="date"
              value={form.endDate}
              onChange={(n, v) => setForm(f => ({ ...f, [n]: v }))}
              required
            />
          </div>
          <FormField
            label="Reason"
            name="reason"
            type="textarea"
            value={form.reason}
            onChange={(n, v) => setForm(f => ({ ...f, [n]: v }))}
            placeholder="Explain reason for leave..."
          />
        </div>
      </Modal>

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
}
