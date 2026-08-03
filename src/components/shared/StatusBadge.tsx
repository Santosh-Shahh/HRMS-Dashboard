type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'default' | 'purple';

interface StatusBadgeProps {
  status: string;
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  error: 'bg-red-50 text-red-700 border-red-200',
  info: 'bg-blue-50 text-blue-700 border-blue-200',
  default: 'bg-slate-50 text-slate-600 border-slate-200',
  purple: 'bg-purple-50 text-purple-700 border-purple-200',
};

const autoVariant: Record<string, BadgeVariant> = {
  'Active': 'success',
  'Present': 'success',
  'Approved': 'success',
  'Paid': 'success',
  'Selected': 'success',
  'Open': 'success',
  'Inactive': 'default',
  'Absent': 'error',
  'Rejected': 'error',
  'Closed': 'default',
  'Pending': 'warning',
  'Processing': 'warning',
  'On Hold': 'warning',
  'Probation': 'info',
  'On Notice': 'error',
  'Late': 'warning',
  'Half Day': 'purple',
  'On Leave': 'info',
  'Draft': 'default',
  'HR Round': 'purple',
  'Interview': 'info',
  'Screening': 'warning',
  'Applied': 'info',
};

export default function StatusBadge({ status, variant }: StatusBadgeProps) {
  const v = variant || autoVariant[status] || 'default';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variantClasses[v]}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${v === 'success' ? 'bg-emerald-500' : v === 'warning' ? 'bg-amber-500' : v === 'error' ? 'bg-red-500' : v === 'info' ? 'bg-blue-500' : v === 'purple' ? 'bg-purple-500' : 'bg-slate-400'}`} />
      {status}
    </span>
  );
}
