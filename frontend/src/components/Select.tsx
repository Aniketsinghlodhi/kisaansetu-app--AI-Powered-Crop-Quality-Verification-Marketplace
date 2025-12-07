'use client';

interface SelectProps {
  label?: string;
  options: { label: string; value: string }[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  name?: string;
}

export default function Select({
  label,
  options,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  name,
}: SelectProps) {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-bold text-emerald-900 mb-2">
          {label} {required && <span className="text-red-600">*</span>}
        </label>
      )}
      <select
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all font-medium ${
          error
            ? 'border-red-500 focus:ring-red-400 bg-red-50'
            : 'border-emerald-300 focus:ring-emerald-500 focus:border-emerald-500 bg-white hover:border-emerald-400'
        } ${disabled ? 'bg-gray-100 cursor-not-allowed border-gray-300' : 'text-slate-900'}`}
      >
        <option value="">Select {label}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
