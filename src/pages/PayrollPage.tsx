import { useState } from 'react';
import { Wallet, DollarSign, FileText, Download, CheckCircle, Clock, Play } from 'lucide-react';
import PageHeader from '../components/shared/PageHeader';
import StatsCard from '../components/shared/StatsCard';
import FilterBar from '../components/shared/FilterBar';
import StatusBadge from '../components/shared/StatusBadge';
import Modal from '../components/shared/Modal';
import Toast from '../components/Toast';
import { payrollRecords as initialRecords, payrollSummary, payrollMonthlyTrend } from '../data/payroll';
import type { PayrollRecord } from '../types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

export default function PayrollPage() {
  const [records, setRecords] = useState<PayrollRecord[]>(initialRecords);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedPayslip, setSelectedPayslip] = useState<PayrollRecord | null>(null);
  const [processOpen, setProcessOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);

  const filteredRecords = records.filter(r => {
    if (deptFilter && r.department !== deptFilter) return false;
    if (statusFilter && r.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        r.employeeName.toLowerCase().includes(q) ||
        r.employeeId.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleProcessPayroll = () => {
    setRecords(prev =>
      prev.map(r => (r.status === 'Pending' || r.status === 'Processing' ? { ...r, status: 'Processed' } : r))
    );
    setProcessOpen(false);
    setToast({ message: 'July 2026 Payroll processed successfully for all employees.', type: 'success' });
  };

  const handleDownloadPDF = () => {
    setToast({ message: `Payslip for ${selectedPayslip?.employeeName} downloaded as PDF.`, type: 'success' });
  };

  return (
    <div className="max-w-[1600px] mx-auto">
      <PageHeader
        title="Payroll & Compensation"
        subtitle="Manage employee salaries, disbursements, and payslips"
        breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Payroll' }]}
        actions={
          <div className="flex gap-3">
            <button
              onClick={() => setProcessOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm"
            >
              <Play size={16} /> Run Payroll Cycle
            </button>
          </div>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-6">
        <StatsCard
          title="Monthly Cost"
          value={`₹${(payrollSummary.totalMonthlyCost / 100000).toFixed(2)} Lakhs`}
          subtitle="July 2026 total payout"
          icon={<Wallet size={20} />}
          color="indigo"
        />
        <StatsCard
          title="Pending Payroll"
          value={records.filter(r => r.status === 'Pending' || r.status === 'Processing').length}
          subtitle="Employees pending"
          icon={<Clock size={20} />}
          color="amber"
        />
        <StatsCard
          title="Processed Payroll"
          value={records.filter(r => r.status === 'Processed' || r.status === 'Paid').length}
          subtitle="Ready for bank transfer"
          icon={<CheckCircle size={20} />}
          color="green"
        />
        <StatsCard
          title="Avg Net Salary"
          value={`₹${Math.round(records.reduce((acc, r) => acc + r.netSalary, 0) / (records.length || 1)).toLocaleString()}`}
          subtitle="Per employee"
          icon={<DollarSign size={20} />}
          color="blue"
        />
      </div>

      {/* Chart */}
      <div className="bg-white rounded-xl border shadow-sm p-6 mb-6">
        <h3 className="font-bold mb-4">Monthly Payroll Cost Trend (₹ in Lakhs)</h3>
        <div className="h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={payrollMonthlyTrend}>
              <XAxis dataKey="month" />
              <YAxis tickFormatter={v => `₹${(v / 100).toFixed(1)}L`} />
              <Tooltip formatter={(value: any) => [`₹${(value / 100).toFixed(2)} Lakhs`, 'Cost']} />
              <Bar dataKey="cost" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar
        search={{ value: search, onChange: setSearch, placeholder: 'Search by employee or ID...' }}
        filters={[
          {
            name: 'department',
            label: 'All Departments',
            value: deptFilter,
            options: ['Engineering', 'Call Center', 'Hunt Ads', 'Support', 'HR', 'Finance', 'Marketing', 'Management'].map(d => ({ value: d, label: d })),
          },
          {
            name: 'status',
            label: 'All Statuses',
            value: statusFilter,
            options: [
              { value: 'Pending', label: 'Pending' },
              { value: 'Processing', label: 'Processing' },
              { value: 'Processed', label: 'Processed' },
              { value: 'Paid', label: 'Paid' },
            ],
          },
        ]}
        onFilterChange={(name, val) => {
          if (name === 'department') setDeptFilter(val);
          if (name === 'status') setStatusFilter(val);
        }}
      />

      {/* Payroll Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b bg-slate-50/80 text-xs uppercase text-slate-500 font-semibold">
                <th className="p-4">Employee</th>
                <th>Basic Salary</th>
                <th>Allowances (HRA+DA+Bonus)</th>
                <th>Deductions (PF+Tax)</th>
                <th>Net Salary</th>
                <th>Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map(r => (
                <tr key={r.id} className="border-b hover:bg-slate-50/50">
                  <td className="p-4">
                    <b className="text-slate-900">{r.employeeName}</b>
                    <div className="text-xs text-slate-500">{r.department} • {r.employeeId}</div>
                  </td>
                  <td className="font-medium text-slate-700">₹{r.basicSalary.toLocaleString()}</td>
                  <td className="text-emerald-700 font-medium">+₹{(r.hra + r.da + r.bonus + r.incentives).toLocaleString()}</td>
                  <td className="text-red-600 font-medium">-₹{r.totalDeductions.toLocaleString()}</td>
                  <td className="font-bold text-slate-900">₹{r.netSalary.toLocaleString()}</td>
                  <td>
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => setSelectedPayslip(r)}
                      className="px-3 py-1.5 border rounded hover:bg-slate-50 text-xs font-medium text-blue-600 flex items-center gap-1.5 ml-auto"
                    >
                      <FileText size={14} /> View Payslip
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payslip View Modal */}
      <Modal
        isOpen={!!selectedPayslip}
        onClose={() => setSelectedPayslip(null)}
        title={`Payslip - ${selectedPayslip?.month} ${selectedPayslip?.year}`}
        size="lg"
        footer={
          <>
            <button onClick={() => setSelectedPayslip(null)} className="px-4 py-2 border rounded-lg text-sm">
              Close
            </button>
            <button
              onClick={handleDownloadPDF}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm flex items-center gap-2"
            >
              <Download size={16} /> Download Payslip PDF
            </button>
          </>
        }
      >
        {selectedPayslip && (
          <div className="space-y-6">
            <div className="flex justify-between border-b pb-4">
              <div>
                <h3 className="font-bold text-lg text-slate-900">Hunt Digital Media Pvt. Ltd.</h3>
                <p className="text-xs text-slate-500">42 MG Road, Sector 14, Gurgaon</p>
              </div>
              <div className="text-right">
                <span className="text-xs uppercase text-slate-400 font-mono">Payslip Ref</span>
                <p className="text-sm font-bold font-mono">{selectedPayslip.id}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm bg-slate-50 p-4 rounded-xl">
              <div>
                <p className="text-xs text-slate-500 uppercase">Employee Name</p>
                <p className="font-bold">{selectedPayslip.employeeName}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase">Employee ID</p>
                <p className="font-bold">{selectedPayslip.employeeId}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase">Department</p>
                <p className="font-medium">{selectedPayslip.department}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase">Designation</p>
                <p className="font-medium">{selectedPayslip.designation}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-xs uppercase text-slate-500 mb-2">Earnings</h4>
                <div className="space-y-2 text-sm border-t pt-2">
                  <div className="flex justify-between"><span>Basic Salary</span><span>₹{selectedPayslip.basicSalary.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span>HRA</span><span>₹{selectedPayslip.hra.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span>DA</span><span>₹{selectedPayslip.da.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span>Bonus</span><span>₹{selectedPayslip.bonus.toLocaleString()}</span></div>
                  <div className="flex justify-between font-bold border-t pt-2 text-slate-900"><span>Gross Salary</span><span>₹{selectedPayslip.grossSalary.toLocaleString()}</span></div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-xs uppercase text-slate-500 mb-2">Deductions</h4>
                <div className="space-y-2 text-sm border-t pt-2">
                  <div className="flex justify-between"><span>Provident Fund (PF)</span><span>₹{selectedPayslip.pf.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span>Income Tax (TDS)</span><span>₹{selectedPayslip.tax.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span>Other Deductions</span><span>₹{selectedPayslip.otherDeductions.toLocaleString()}</span></div>
                  <div className="flex justify-between font-bold border-t pt-2 text-red-600"><span>Total Deductions</span><span>₹{selectedPayslip.totalDeductions.toLocaleString()}</span></div>
                </div>
              </div>
            </div>

            <div className="border-t pt-4 flex justify-between items-center bg-blue-50 p-4 rounded-xl">
              <span className="font-bold text-slate-900 text-lg">Net Transfer Amount:</span>
              <span className="font-extrabold text-blue-700 text-2xl">₹{selectedPayslip.netSalary.toLocaleString()}</span>
            </div>
          </div>
        )}
      </Modal>

      {/* Run Payroll Modal */}
      <Modal
        isOpen={processOpen}
        onClose={() => setProcessOpen(false)}
        title="Run Payroll Cycle - July 2026"
        size="md"
        footer={
          <>
            <button onClick={() => setProcessOpen(false)} className="px-4 py-2 border rounded-lg text-sm">
              Cancel
            </button>
            <button onClick={handleProcessPayroll} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">
              Confirm & Process
            </button>
          </>
        }
      >
        <div className="space-y-4 text-sm text-slate-600">
          <p>You are about to process payroll for <b>{records.length} employees</b> for the month of <b>July 2026</b>.</p>
          <div className="p-4 bg-slate-50 border rounded-lg space-y-2">
            <div className="flex justify-between"><span>Total Gross Payout:</span><span className="font-bold text-slate-900">₹32.50 Lakhs</span></div>
            <div className="flex justify-between"><span>Total Tax / PF Deductions:</span><span className="font-bold text-slate-900">₹4.00 Lakhs</span></div>
            <div className="flex justify-between border-t pt-2 font-bold text-slate-900"><span>Net Disbursement:</span><span className="text-blue-600">₹28.50 Lakhs</span></div>
          </div>
        </div>
      </Modal>

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
}
