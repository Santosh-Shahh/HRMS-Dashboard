import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, Calendar, Briefcase, Edit, FileText, Clock, Award } from 'lucide-react';
import PageHeader from '../components/shared/PageHeader';
import TabBar from '../components/shared/TabBar';
import StatusBadge from '../components/shared/StatusBadge';
import StatsCard from '../components/shared/StatsCard';
import { getEmployeeById, getEmployeeFullName } from '../data/employees';
import { getAttendanceByEmployee } from '../data/attendance';
import { leaveBalances } from '../data/leaves';
import { documents } from '../data/documents';
import { payrollRecords, salaryStructures } from '../data/payroll';

const tabs = [
  { id: 'personal', label: 'Personal Details' },
  { id: 'job', label: 'Job Information' },
  { id: 'attendance', label: 'Attendance Summary' },
  { id: 'leaves', label: 'Leave Summary' },
  { id: 'payroll', label: 'Payroll' },
  { id: 'documents', label: 'Documents' },
  { id: 'activity', label: 'Activity Timeline' },
];

export default function EmployeeProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('personal');
  const employee = getEmployeeById(id || '');

  if (!employee) {
    return (
      <div className="max-w-[1600px] mx-auto text-center py-20">
        <p className="text-slate-500">Employee not found.</p>
        <button onClick={() => navigate('/employees')} className="mt-4 text-blue-600 hover:underline">← Back to Directory</button>
      </div>
    );
  }

  const fullName = getEmployeeFullName(employee);
  const attendance = getAttendanceByEmployee(employee.id);
  const present = attendance.filter(a => a.status === 'Present').length;
  const absent = attendance.filter(a => a.status === 'Absent').length;
  const late = attendance.filter(a => a.status === 'Late').length;
  const empDocs = documents.filter(d => d.employeeId === employee.id);
  const leaveBalance = leaveBalances.find(l => l.employeeId === employee.id);
  const empPayroll = payrollRecords.filter(p => p.employeeId === employee.id);
  const salaryStructure = salaryStructures.find(s => s.employeeId === employee.id);

  const activities = [
    { date: '2026-07-18', icon: <Clock size={14} />, text: 'Checked in at 09:02 AM', color: 'bg-blue-100 text-blue-600' },
    { date: '2026-07-17', icon: <Award size={14} />, text: 'Completed quarterly performance review', color: 'bg-emerald-100 text-emerald-600' },
    { date: '2026-07-15', icon: <FileText size={14} />, text: 'Salary slip for June 2026 generated', color: 'bg-purple-100 text-purple-600' },
    { date: '2026-07-10', icon: <Calendar size={14} />, text: 'Applied for Casual Leave (1 day)', color: 'bg-amber-100 text-amber-600' },
    { date: '2026-07-05', icon: <Edit size={14} />, text: 'Profile information updated by HR', color: 'bg-slate-100 text-slate-600' },
    { date: '2026-06-30', icon: <Briefcase size={14} />, text: 'Completed project milestone: Q2 deliverables', color: 'bg-indigo-100 text-indigo-600' },
  ];

  return (
    <div className="max-w-[1600px] mx-auto">
      <PageHeader
        title=""
        breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Employee Directory', href: '/employees' }, { label: fullName }]}
        actions={
          <button onClick={() => navigate('/employees')} className="flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600">
            <ArrowLeft size={16} /> Back to Directory
          </button>
        }
      />

      {/* Profile Header Card */}
      <div className="bg-white rounded-xl border shadow-sm p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-2xl font-bold shadow-lg">
            {employee.initials}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold">{fullName}</h1>
              <StatusBadge status={employee.status} />
            </div>
            <p className="text-slate-500">{employee.designation} • {employee.department}</p>
            <div className="flex flex-wrap gap-5 mt-4 text-sm text-slate-600">
              <span className="flex items-center gap-1.5"><Mail size={14} className="text-slate-400" />{employee.email}</span>
              <span className="flex items-center gap-1.5"><Phone size={14} className="text-slate-400" />{employee.phone}</span>
              <span className="flex items-center gap-1.5"><MapPin size={14} className="text-slate-400" />{employee.address}</span>
              <span className="flex items-center gap-1.5"><Calendar size={14} className="text-slate-400" />Joined {new Date(employee.joiningDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500 font-mono">{employee.id}</p>
            <p className="text-lg font-bold mt-1">₹{employee.salary.toLocaleString()}<span className="text-xs text-slate-400 font-normal">/mo</span></p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <TabBar tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
        <div className="p-6">
          {activeTab === 'personal' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoRow label="Full Name" value={fullName} />
              <InfoRow label="Email" value={employee.email} />
              <InfoRow label="Phone" value={employee.phone} />
              <InfoRow label="Date of Birth" value={new Date(employee.dateOfBirth).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })} />
              <InfoRow label="Gender" value={employee.gender} />
              <InfoRow label="Blood Group" value={employee.bloodGroup} />
              <InfoRow label="Address" value={employee.address} />
              <InfoRow label="Emergency Contact" value={employee.emergencyContact} />
            </div>
          )}

          {activeTab === 'job' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoRow label="Employee ID" value={employee.id} />
              <InfoRow label="Department" value={employee.department} />
              <InfoRow label="Designation" value={employee.designation} />
              <InfoRow label="Employment Type" value={employee.employmentType} />
              <InfoRow label="Joining Date" value={new Date(employee.joiningDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })} />
              <InfoRow label="Reporting To" value={employee.reportingTo} />
              <InfoRow label="Monthly Salary" value={`₹${employee.salary.toLocaleString()}`} />
              <InfoRow label="Status" value={employee.status} />
            </div>
          )}

          {activeTab === 'attendance' && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <StatsCard title="Present" value={present} icon={<Clock size={20} />} color="green" />
                <StatsCard title="Absent" value={absent} icon={<Clock size={20} />} color="red" />
                <StatsCard title="Late" value={late} icon={<Clock size={20} />} color="amber" />
                <StatsCard title="Attendance %" value={`${attendance.length > 0 ? Math.round((present / attendance.length) * 100) : 0}%`} icon={<Award size={20} />} color="blue" />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="border-b bg-slate-50 text-xs uppercase text-slate-500">
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Check In</th>
                      <th className="px-4 py-3">Check Out</th>
                      <th className="px-4 py-3">Work Hours</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendance.slice(0, 15).map(a => (
                      <tr key={a.id} className="border-b">
                        <td className="px-4 py-3">{new Date(a.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                        <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                        <td className="px-4 py-3">{a.checkIn}</td>
                        <td className="px-4 py-3">{a.checkOut}</td>
                        <td className="px-4 py-3">{a.workHours}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'leaves' && (
            <div>
              {leaveBalance ? (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <LeaveCard title="Casual Leave" used={leaveBalance.casual.used} total={leaveBalance.casual.total} color="blue" />
                  <LeaveCard title="Sick Leave" used={leaveBalance.sick.used} total={leaveBalance.sick.total} color="red" />
                  <LeaveCard title="Earned Leave" used={leaveBalance.earned.used} total={leaveBalance.earned.total} color="green" />
                  <LeaveCard title="Unpaid Leave" used={leaveBalance.unpaid.used} total={leaveBalance.unpaid.total} color="amber" />
                </div>
              ) : (
                <p className="text-slate-500 text-sm text-center py-8">Leave balance data not available for this employee.</p>
              )}
            </div>
          )}

          {activeTab === 'payroll' && (
            <div className="space-y-6">
              {salaryStructure && (
                <div className="bg-slate-50 rounded-xl p-5 border">
                  <h3 className="font-bold text-slate-800 mb-4">Current Salary Structure</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <InfoRow label="Basic Salary" value={`₹${salaryStructure.basicSalary.toLocaleString()}`} />
                    <InfoRow label="HRA" value={`₹${salaryStructure.hra.toLocaleString()}`} />
                    <InfoRow label="DA" value={`₹${salaryStructure.da.toLocaleString()}`} />
                    <InfoRow label="Total CTC" value={`₹${salaryStructure.totalCTC.toLocaleString()}`} />
                  </div>
                </div>
              )}
              
              <div>
                <h3 className="font-bold text-slate-800 mb-4">Recent Payslips</h3>
                {empPayroll.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead>
                        <tr className="border-b bg-slate-50 text-xs uppercase text-slate-500">
                          <th className="px-4 py-3">Month</th>
                          <th className="px-4 py-3">Gross</th>
                          <th className="px-4 py-3">Deductions</th>
                          <th className="px-4 py-3">Net Pay</th>
                          <th className="px-4 py-3">Status</th>
                          <th className="px-4 py-3">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {empPayroll.map(p => (
                          <tr key={p.id} className="border-b">
                            <td className="px-4 py-3 font-medium">{p.month} {p.year}</td>
                            <td className="px-4 py-3 text-emerald-600">₹{p.grossSalary.toLocaleString()}</td>
                            <td className="px-4 py-3 text-red-500">₹{p.totalDeductions.toLocaleString()}</td>
                            <td className="px-4 py-3 font-bold">₹{p.netSalary.toLocaleString()}</td>
                            <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                            <td className="px-4 py-3"><button className="text-blue-600 hover:underline">Download</button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-slate-500 text-sm py-4">No recent payroll records found.</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div>
              {empDocs.length > 0 ? (
                <div className="space-y-3">
                  {empDocs.map(doc => (
                    <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-50 text-red-600 rounded-lg flex items-center justify-center">
                          <FileText size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{doc.name}</p>
                          <p className="text-xs text-slate-400">{doc.category} • {doc.fileSize} • Uploaded {new Date(doc.uploadDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                        </div>
                      </div>
                      <button className="text-blue-600 text-sm hover:underline">Download</button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-sm text-center py-8">No documents found for this employee.</p>
              )}
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="relative pl-8">
              <div className="absolute left-3 top-0 bottom-0 w-px bg-slate-200" />
              {activities.map((act, i) => (
                <div key={i} className="relative mb-6 last:mb-0">
                  <div className={`absolute -left-5 w-6 h-6 rounded-full flex items-center justify-center ${act.color}`}>
                    {act.icon}
                  </div>
                  <div className="ml-4">
                    <p className="text-sm">{act.text}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{new Date(act.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-slate-500 uppercase font-medium">{label}</span>
      <span className="text-sm text-slate-900">{value}</span>
    </div>
  );
}

function LeaveCard({ title, used, total, color }: { title: string; used: number; total: number; color: string }) {
  const pct = total > 0 ? (used / total) * 100 : 0;
  const colors: Record<string, string> = { blue: '#3b82f6', red: '#ef4444', green: '#10b981', amber: '#f59e0b' };
  return (
    <div className="bg-white border rounded-xl p-5">
      <h3 className="text-sm font-medium text-slate-700">{title}</h3>
      <div className="flex items-baseline gap-2 mt-2">
        <span className="text-2xl font-bold">{total - used}</span>
        <span className="text-xs text-slate-400">remaining of {total}</span>
      </div>
      <div className="mt-3 h-2 bg-slate-100 rounded-full">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: colors[color] }} />
      </div>
      <p className="text-xs text-slate-500 mt-2">{used} used</p>
    </div>
  );
}
