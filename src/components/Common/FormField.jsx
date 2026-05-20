import React from 'react';

export default function FormField({ label, name, type = 'text', value, onChange, required, options }) {
  const baseClasses = "mt-1 block w-full rounded-md border-gray-600 bg-gray-800 text-white shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm px-4 py-2 border";

  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-300">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      {type === 'select' ? (
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className={baseClasses}
        >
          <option value="">Select an option...</option>
          {options?.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className={baseClasses}
        />
      )}
    </div>
  );
}
