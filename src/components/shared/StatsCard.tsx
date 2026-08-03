import type { ReactNode } from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  trend?: { value: string; positive: boolean };
  color?: 'blue' | 'green' | 'amber' | 'red' | 'purple' | 'indigo';
  progress?: number;
}

const colorMap = {
  blue: { bg: 'bg-blue-50', text: 'text-blue-600' },
  green: { bg: 'bg-emerald-50', text: 'text-emerald-600' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-600' },
  red: { bg: 'bg-red-50', text: 'text-red-600' },
  purple: { bg: 'bg-purple-50', text: 'text-purple-600' },
  indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600' },
};

export default function StatsCard({ title, value, subtitle, icon, trend, color = 'blue', progress }: StatsCardProps) {
  const c = colorMap[color];
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border hover:shadow-md transition-shadow">
      <div className="flex justify-between">
        <div>
          <h3 className="text-slate-500 text-sm font-semibold uppercase">{title}</h3>
          <p className="text-2xl font-bold mt-2">{value}</p>
        </div>
        <div className={`w-10 h-10 rounded-lg ${c.bg} ${c.text} flex items-center justify-center`}>
          {icon}
        </div>
      </div>
      {subtitle && <p className="text-xs text-slate-500 mt-3">{subtitle}</p>}
      {trend && (
        <p className={`text-xs mt-3 font-medium ${trend.positive ? 'text-emerald-600' : 'text-red-600'}`}>
          {trend.positive ? '↑' : '↓'} {trend.value}
        </p>
      )}
      {progress !== undefined && (
        <div className="mt-3 h-2 bg-slate-100 rounded">
          <div className={`h-full rounded ${c.bg.replace('50', '500').replace('bg-', 'bg-')}`} style={{ width: `${Math.min(progress, 100)}%`, background: color === 'purple' ? '#a855f7' : color === 'blue' ? '#3b82f6' : color === 'green' ? '#10b981' : color === 'amber' ? '#f59e0b' : color === 'red' ? '#ef4444' : '#6366f1' }} />
        </div>
      )}
    </div>
  );
}
