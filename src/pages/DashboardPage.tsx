import { useState } from 'react';
import KPICards from '../components/KPICards';
import { HoursTrackingChart, DepartmentChart, PayrollExpenseChart } from '../components/Charts';
import LeaveRequests from '../components/LeaveRequests';
import LiveSessions from '../components/LiveSessions';
import RecruitmentPipeline from '../components/RecruitmentPipeline';
import UpcomingEvents from '../components/UpcomingEvents';
import ActionItems from '../components/ActionItems';
import { initialLeaves } from '../data/dashboardData';
import { useToast } from '../contexts/ToastContext';
import { Users, FileText, UserPlus, CheckCircle2 } from 'lucide-react';

export default function DashboardPage() {
  const [leaves, setLeaves] = useState(initialLeaves);
  const { addToast } = useToast();
  const [tasks, setTasks] = useState<Record<string, boolean>>({ task1: false, task2: false, task3: false });

  const handleLeave = (id: number, action: 'approve' | 'reject') => {
    setLeaves(v => v.map(l => (l.id === id ? { ...l, status: action === 'approve' ? 'approved' : 'rejected' } : l)));
    addToast(
      action === 'approve' ? 'Leave request approved successfully.' : 'Leave request rejected.',
      action === 'approve' ? 'success' : 'error'
    );
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
            </span>
            <p className="text-xs font-medium text-slate-600 uppercase tracking-wider">Live System <span className="text-slate-400 mx-2">•</span> {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Good Morning, Admin</h1>
          <p className="text-sm text-slate-500 mt-1">Here is what's happening across your organization today.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors shadow-sm text-sm">
            Export EOD Report
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm text-sm flex items-center gap-2">
            <UserPlus size={16} />
            Add Employee
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Users, label: 'Manage Team', color: 'text-blue-600', bg: 'bg-blue-50' },
          { icon: FileText, label: 'Review Payroll', color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { icon: CheckCircle2, label: 'Approve Leaves', color: 'text-amber-600', bg: 'bg-amber-50' },
          { icon: UserPlus, label: 'New Hire', color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map((action, i) => (
          <button key={i} className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all group text-left">
            <div className={`p-2.5 rounded-lg ${action.bg} ${action.color} group-hover:scale-110 transition-transform`}>
              <action.icon size={20} />
            </div>
            <span className="font-medium text-slate-700 text-sm">{action.label}</span>
          </button>
        ))}
      </div>

      <KPICards />
      
      <div className="grid lg:grid-cols-3 gap-5">
        <section className="lg:col-span-2 bg-white p-6 rounded-xl border shadow-sm">
          <h2 className="font-bold text-slate-800 mb-4">Working Hours Analysis</h2>
          <div className="h-[300px]"><HoursTrackingChart /></div>
        </section>
        <section className="bg-white p-6 rounded-xl border shadow-sm">
          <h2 className="font-bold text-slate-800 mb-4">Workforce Distribution</h2>
          <div className="h-[300px]"><DepartmentChart /></div>
        </section>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2"><LeaveRequests leaves={leaves} onAction={handleLeave} /></div>
        <LiveSessions />
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2"><RecruitmentPipeline /></div>
        <UpcomingEvents />
      </div>

      <div className="grid lg:grid-cols-3 gap-5 pb-10">
        <section className="lg:col-span-2 bg-white p-6 rounded-xl border shadow-sm">
          <h2 className="font-bold text-slate-800 mb-4">Payroll Expenses (YTD)</h2>
          <div className="h-[280px]"><PayrollExpenseChart /></div>
        </section>
        <ActionItems tasks={tasks} toggle={id => setTasks(t => ({ ...t, [id]: !t[id] }))} />
      </div>
    </div>
  );
}
