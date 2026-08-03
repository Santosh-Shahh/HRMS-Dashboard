import { useState } from 'react';
import { CalendarMinus, Check, X, Plus, Filter, Clock, CheckCircle2, XCircle } from 'lucide-react';
import PageHeader from '../components/shared/PageHeader';
import StatsCard from '../components/shared/StatsCard';
import FilterBar from '../components/shared/FilterBar';
import StatusBadge from '../components/shared/StatusBadge';
import Modal from '../components/shared/Modal';
import FormField from '../components/shared/FormField';
import { useToast } from '../contexts/ToastContext';
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
  const { addToast } = useToast();

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
    addToast(`Leave request ${action.toLowerCase()} successfully.`, action === 'Approved' ? 'success' : 'error');
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
    addToast('Leave request submitted successfully.', 'success');
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-6">
      <PageHeader
        title="Leave Management"
        subtitle="Track, manage and approve employee leave requests"
        actions={
          <button
            onClick={() => setApplyOpen(true)}
            className="px-4 py-2 bg-blue-600 shadow-sm text-white font-medium rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm transition-colors"
          >
            <Plus size={16} /> Apply Leave
          </button>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
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
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-base font-bold text-slate-900 mb-4">Leave Policy & Balances (Default Allocation)</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/50 hover:bg-blue-50 transition-colors">
            <span className="text-xs text-blue-600 font-bold uppercase tracking-wider">Casual Leave (CL)</span>
            <p className="text-2xl font-bold mt-2 text-slate-900">12 Days <span className="text-sm text-slate-500 font-normal">/ Year</span></p>
            <p className="text-xs text-slate-500 mt-2">Paid leave for personal matters</p>
          </div>
          <div className="p-4 rounded-xl border border-red-100 bg-red-50/50 hover:bg-red-50 transition-colors">
            <span className="text-xs text-red-600 font-bold uppercase tracking-wider">Sick Leave (SL)</span>
            <p className="text-2xl font-bold mt-2 text-slate-900">8 Days <span className="text-sm text-slate-500 font-normal">/ Year</span></p>
            <p className="text-xs text-slate-500 mt-2">Medical leave requiring cert &gt; 2 days</p>
          </div>
          <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/50 hover:bg-emerald-50 transition-colors">
            <span className="text-xs text-emerald-600 font-bold uppercase tracking-wider">Earned Leave (EL)</span>
            <p className="text-2xl font-bold mt-2 text-slate-900">15 Days <span className="text-sm text-slate-500 font-normal">/ Year</span></p>
            <p className="text-xs text-slate-500 mt-2">Privilege leave accrued monthly</p>
          </div>
          <div className="p-4 rounded-xl border border-amber-100 bg-amber-50/50 hover:bg-amber-50 transition-colors">
            <span className="text-xs text-amber-600 font-bold uppercase tracking-wider">Unpaid Leave (LWP)</span>
            <p className="text-2xl font-bold mt-2 text-slate-900">Unlimited</p>
            <p className="text-xs text-slate-500 mt-2">Subject to manager approval</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
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
        <div className="mt-4 border border-slate-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500 font-semibold tracking-wider">
                  <th className="p-4">Employee</th>
                  <th className="p-4">Leave Details</th>
                  <th className="p-4">Dates & Duration</th>
                  <th className="p-4">Applied On</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLeaves.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500 font-medium">
                      No leave requests found matching your filters.
                    </td>
                  </tr>
                ) : (
                  filteredLeaves.map(l => (
                    <tr key={l.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                            {l.initials}
                          </div>
                          <div>
                            <b className="text-slate-900 block">{l.employeeName}</b>
                            <div className="text-xs text-slate-500 mt-0.5">{l.department} • {l.employeeId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <b className="text-xs text-blue-600 block mb-1">{l.leaveType}</b>
                        <span className="text-xs text-slate-600 italic">"{l.reason}"</span>
                      </td>
                      <td className="p-4">
                        <div className="font-medium text-slate-900">{l.startDate} to {l.endDate}</div>
                        <div className="text-xs text-slate-500 mt-1">{l.days} Day(s)</div>
                      </td>
                      <td className="p-4 text-xs text-slate-500">{l.appliedOn}</td>
                      <td className="p-4">
                        <StatusBadge status={l.status} />
                      </td>
                      <td className="p-4 text-right">
                        {l.status === 'Pending' ? (
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleAction(l.id, 'Approved')}
                              className="px-3 py-1.5 border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:border-emerald-300 rounded-md flex items-center gap-1.5 text-xs font-medium transition-colors shadow-sm"
                            >
                              <Check size={14} /> Approve
                            </button>
                            <button
                              onClick={() => handleAction(l.id, 'Rejected')}
                              className="px-3 py-1.5 border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 hover:border-red-300 rounded-md flex items-center gap-1.5 text-xs font-medium transition-colors shadow-sm"
                            >
                              <X size={14} /> Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 font-medium">
                            {l.status === 'Approved' ? `Approved by ${l.approvedBy || 'Admin'}` : 'Request Rejected'}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
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
            <button onClick={() => setApplyOpen(false)} className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-sm font-medium transition-colors">
              Cancel
            </button>
            <button onClick={handleApply} className="px-4 py-2 bg-blue-600 shadow-sm text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors">
              Submit Request
            </button>
          </>
        }
      >
        <div className="space-y-4 p-1">
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
    </div>
  );
}
