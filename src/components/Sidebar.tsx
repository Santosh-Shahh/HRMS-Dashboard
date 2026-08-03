import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, CalendarCheck, CalendarMinus, Wallet, UsersRound, Network, FileBarChart, FolderKanban, Settings } from 'lucide-react';

export default function Sidebar() {
  return (
    <aside className="w-[260px] bg-slate-900 text-slate-300 flex flex-col h-full flex-shrink-0 shadow-xl">
      <div className="h-[72px] flex items-center px-6 border-b border-slate-800">
        <NavLink to="/" className="flex items-center gap-2 text-white font-bold text-xl">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
            <Network size={20} />
          </div>
          zentrix
        </NavLink>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
        <p className="px-3 text-xs font-semibold text-slate-500 uppercase">Main Menu</p>
        <NavItem to="/" icon={<LayoutDashboard size={18} />} label="Dashboard" end />
        <NavItem to="/employees" icon={<Users size={18} />} label="Employees" />

        <p className="px-3 pt-4 text-xs font-semibold text-slate-500 uppercase">Time & Operations</p>
        <NavItem to="/attendance" icon={<CalendarCheck size={18} />} label="Attendance" />
        <NavItem to="/leaves" icon={<CalendarMinus size={18} />} label="Leave Requests" badge="8" />

        <p className="px-3 pt-4 text-xs font-semibold text-slate-500 uppercase">Finance & Growth</p>
        <NavItem to="/payroll" icon={<Wallet size={18} />} label="Payroll" />
        <NavItem to="/recruitment" icon={<UsersRound size={18} />} label="Recruitment" />

        <p className="px-3 pt-4 text-xs font-semibold text-slate-500 uppercase">System & Vault</p>
        <NavItem to="/reports" icon={<FileBarChart size={18} />} label="Reports & Analytics" />
        <NavItem to="/documents" icon={<FolderKanban size={18} />} label="Document Vault" />
        <NavItem to="/settings" icon={<Settings size={18} />} label="Settings" />
      </nav>

      <div className="p-4 border-t border-slate-800 flex items-center gap-3">
        <div className="w-9 h-9 rounded bg-slate-700 text-white flex items-center justify-center font-bold">
          A
        </div>
        <div className="flex-1">
          <b className="text-sm text-white block">Admin User</b>
          <p className="text-xs text-slate-400 m-0">Workspace Owner</p>
        </div>
        <NavLink to="/settings" className="text-slate-400 hover:text-white">
          <Settings size={18} />
        </NavLink>
      </div>
    </aside>
  );
}

function NavItem({ to, icon, label, badge, end }: { to: string; icon: React.ReactNode; label: string; badge?: string; end?: boolean }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
          isActive
            ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20 font-medium'
            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
        }`
      }
    >
      {icon}
      <span>{label}</span>
      {badge && (
        <span className="ml-auto bg-amber-500 text-white px-2 py-0.5 rounded-full text-[10px] font-bold">
          {badge}
        </span>
      )}
    </NavLink>
  );
}