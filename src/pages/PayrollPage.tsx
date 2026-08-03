import { useState } from 'react';
import { Wallet, DollarSign, FileText, Download, CheckCircle, Clock, Play } from 'lucide-react';
import PageHeader from '../components/shared/PageHeader';
import StatsCard from '../components/shared/StatsCard';
import FilterBar from '../components/shared/FilterBar';
import StatusBadge from '../components/shared/StatusBadge';
import Modal from '../components/shared/Modal';
import { useToast } from '../contexts/ToastContext';
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
  const { addToast } = useToast();

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
    addToast('July 2026 Payroll processed successfully for all employees.', 'success');
  };

  const handleDownloadPDF = () => {
    addToast(`Payslip for ${selectedPayslip?.employeeName} downloaded as PDF.`, 'success');
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-6">
      <PageHeader
        title="Payroll & Compensation"
        subtitle="Manage employee salaries, disbursements, and payslips"
        actions={
          <div className="flex gap-3">
            <button
              onClick={() => setProcessOpen(true)}
              className="px-4 py-2 bg-blue-600 shadow-sm text-white font-medium rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm transition-colors"
            >
              <Play size={16} /> Run Payroll Cycle
            </button>
          </div>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
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
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h3 className="font-bold text-slate-800 mb-6">Monthly Payroll Cost Trend (₹ in Lakhs)</h3>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={payrollMonthlyTrend} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={v => `₹${(v / 100).toFixed(1)}L`} tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} formatter={(value: any) => [`₹${(value / 100).toFixed(2)} Lakhs`, 'Cost']} />
              <Bar dataKey="cost" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={50} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
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
        <div className="mt-4 border border-slate-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500 font-semibold tracking-wider">
                  <th className="p-4">Employee</th>
                  <th className="p-4">Basic Salary</th>
                  <th className="p-4">Allowances (HRA+DA+Bonus)</th>
                  <th className="p-4">Deductions (PF+Tax)</th>
                  <th className="p-4">Net Salary</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-500 font-medium">
                      No payroll records found matching your filters.
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map(r => (
                    <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4">
                        <b className="text-slate-900 block">{r.employeeName}</b>
                        <div className="text-xs text-slate-500 mt-0.5">{r.department} • {r.employeeId}</div>
                      </td>
                      <td className="p-4 font-medium text-slate-700">₹{r.basicSalary.toLocaleString()}</td>
                      <td className="p-4 text-emerald-600 font-medium">+₹{(r.hra + r.da + r.bonus + r.incentives).toLocaleString()}</td>
                      <td className="p-4 text-rose-600 font-medium">-₹{r.totalDeductions.toLocaleString()}</td>
                      <td className="p-4 font-bold text-slate-900">₹{r.netSalary.toLocaleString()}</td>
                      <td className="p-4">
                        <StatusBadge status={r.status} />
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => setSelectedPayslip(r)}
                          className="px-3 py-1.5 border border-slate-200 rounded-md hover:bg-slate-50 hover:border-slate-300 text-xs font-medium text-blue-600 flex items-center gap-1.5 ml-auto transition-colors shadow-sm"
                        >
                          <FileText size={14} /> View Payslip
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
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
            <button onClick={() => setSelectedPayslip(null)} className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-sm font-medium transition-colors">
              Close
            </button>
            <button
              onClick={handleDownloadPDF}
              className="px-4 py-2 bg-blue-600 shadow-sm text-white rounded-lg hover:bg-blue-700 text-sm font-medium flex items-center gap-2 transition-colors"
            >
              <Download size={16} /> Download Payslip PDF
            </button>
          </>
        }
      >
        {selectedPayslip && (
          <div className="space-y-6 p-2">
            <div className="flex justify-between border-b border-slate-200 pb-5">
              <div>
                <h3 className="font-bold text-xl text-slate-900 tracking-tight">Hunt Digital Media Pvt. Ltd.</h3>
                <p className="text-sm text-slate-500 mt-1">42 MG Road, Sector 14, Gurgaon</p>
              </div>
              <div className="text-right">
                <span className="text-xs uppercase text-slate-400 font-bold tracking-wider">Payslip Ref</span>
                <p className="text-sm font-bold font-mono text-slate-700 mt-1">{selectedPayslip.id}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm bg-slate-50 border border-slate-100 p-5 rounded-xl">
              <div>
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Employee Name</p>
                <p className="font-bold text-slate-900 mt-1">{selectedPayslip.employeeName}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Employee ID</p>
                <p className="font-bold text-slate-900 mt-1">{selectedPayslip.employeeId}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Department</p>
                <p className="font-medium text-slate-700 mt-1">{selectedPayslip.department}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Designation</p>
                <p className="font-medium text-slate-700 mt-1">{selectedPayslip.designation}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div>
                <h4 className="font-bold text-xs uppercase text-slate-500 mb-3 tracking-wider">Earnings</h4>
                <div className="space-y-2.5 text-sm border-t border-slate-100 pt-3">
                  <div className="flex justify-between text-slate-600"><span>Basic Salary</span><span className="font-medium">₹{selectedPayslip.basicSalary.toLocaleString()}</span></div>
                  <div className="flex justify-between text-slate-600"><span>HRA</span><span className="font-medium">₹{selectedPayslip.hra.toLocaleString()}</span></div>
                  <div className="flex justify-between text-slate-600"><span>DA</span><span className="font-medium">₹{selectedPayslip.da.toLocaleString()}</span></div>
                  <div className="flex justify-between text-slate-600"><span>Bonus</span><span className="font-medium">₹{selectedPayslip.bonus.toLocaleString()}</span></div>
                  <div className="flex justify-between font-bold border-t border-slate-100 pt-2.5 text-slate-900"><span>Gross Salary</span><span>₹{selectedPayslip.grossSalary.toLocaleString()}</span></div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-xs uppercase text-slate-500 mb-3 tracking-wider">Deductions</h4>
                <div className="space-y-2.5 text-sm border-t border-slate-100 pt-3">
                  <div className="flex justify-between text-slate-600"><span>Provident Fund (PF)</span><span className="font-medium text-rose-600">₹{selectedPayslip.pf.toLocaleString()}</span></div>
                  <div className="flex justify-between text-slate-600"><span>Income Tax (TDS)</span><span className="font-medium text-rose-600">₹{selectedPayslip.tax.toLocaleString()}</span></div>
                  <div className="flex justify-between text-slate-600"><span>Other Deductions</span><span className="font-medium text-rose-600">₹{selectedPayslip.otherDeductions.toLocaleString()}</span></div>
                  <div className="flex justify-between font-bold border-t border-slate-100 pt-2.5 text-rose-600"><span>Total Deductions</span><span>₹{selectedPayslip.totalDeductions.toLocaleString()}</span></div>
                </div>
              </div>
            </div>

            <div className="border-t border-blue-200 mt-2 flex justify-between items-center bg-blue-50 p-5 rounded-xl">
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
            <button onClick={() => setProcessOpen(false)} className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-sm font-medium transition-colors">
              Cancel
            </button>
            <button onClick={handleProcessPayroll} className="px-4 py-2 bg-blue-600 shadow-sm text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors">
              Confirm & Process
            </button>
          </>
        }
      >
        <div className="space-y-4 text-sm text-slate-600 p-1">
          <p>You are about to process payroll for <b className="text-slate-900">{records.length} employees</b> for the month of <b className="text-slate-900">July 2026</b>.</p>
          <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg space-y-3">
            <div className="flex justify-between items-center"><span>Total Gross Payout:</span><span className="font-bold text-slate-900 text-base">₹32.50 Lakhs</span></div>
            <div className="flex justify-between items-center"><span>Total Tax / PF Deductions:</span><span className="font-bold text-slate-900 text-base">₹4.00 Lakhs</span></div>
            <div className="flex justify-between items-center border-t border-slate-200 pt-3 font-bold text-slate-900"><span className="text-base">Net Disbursement:</span><span className="text-blue-600 text-xl">₹28.50 Lakhs</span></div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
