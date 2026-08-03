interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'tel' | 'number' | 'date' | 'select' | 'textarea' | 'password';
  value: string | number;
  onChange: (name: string, value: string) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  disabled?: boolean;
  rows?: number;
}

export default function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  required = false,
  options = [],
  disabled = false,
  rows = 3,
}: FormFieldProps) {
  const baseClass = `w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-400 ${error ? 'border-red-400 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-200'}`;

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-slate-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {type === 'select' ? (
        <select
          name={name}
          value={String(value)}
          onChange={e => onChange(name, e.target.value)}
          className={baseClass}
          disabled={disabled}
        >
          <option value="">{placeholder || 'Select...'}</option>
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea
          name={name}
          value={String(value)}
          onChange={e => onChange(name, e.target.value)}
          className={baseClass}
          placeholder={placeholder}
          rows={rows}
          disabled={disabled}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={String(value)}
          onChange={e => onChange(name, e.target.value)}
          className={baseClass}
          placeholder={placeholder}
          disabled={disabled}
        />
      )}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
