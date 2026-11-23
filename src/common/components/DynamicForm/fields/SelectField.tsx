import { useFormContext } from 'react-hook-form';
import type { DynamicFormFieldConfig } from '../types';

interface SelectFieldProps {
  field: DynamicFormFieldConfig;
}

export function SelectField({ field }: SelectFieldProps) {
  const { register, formState: { errors } } = useFormContext();
  const error = errors[field.name];
  const options = field.options ?? [];

  return (
    <div className={field.className}>
      <label htmlFor={field.name} className="form-label">
        {field.label}
      </label>
      <select
        id={field.name}
        disabled={field.disabled}
        className={`form-select ${error ? 'is-invalid' : ''}`}
        {...register(field.name)}
      >
        <option value="">Select...</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <div className="invalid-feedback d-block">
          {error.message as string}
        </div>
      )}
    </div>
  );
}
