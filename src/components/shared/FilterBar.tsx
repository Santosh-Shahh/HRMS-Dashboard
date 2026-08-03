import { Search } from 'lucide-react';

interface FilterOption {
  value: string;
  label: string;
}

interface FilterDef {
  name: string;
  label: string;
  options: FilterOption[];
  value: string;
}

interface FilterBarProps {
  search?: {
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
  };
  filters?: FilterDef[];
  onFilterChange?: (name: string, value: string) => void;
  actions?: React.ReactNode;
}

export default function FilterBar({ search, filters = [], onFilterChange, actions }: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 mb-5">
      {search && (
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            className="w-full pl-9 pr-4 py-2 bg-white border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            placeholder={search.placeholder || 'Search...'}
            value={search.value}
            onChange={e => search.onChange(e.target.value)}
          />
        </div>
      )}
      {filters.map(f => (
        <select
          key={f.name}
          className="px-3 py-2 bg-white border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          value={f.value}
          onChange={e => onFilterChange?.(f.name, e.target.value)}
        >
          <option value="">{f.label}</option>
          {f.options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      ))}
      {actions && <div className="flex items-center gap-2 ml-auto">{actions}</div>}
    </div>
  );
}
