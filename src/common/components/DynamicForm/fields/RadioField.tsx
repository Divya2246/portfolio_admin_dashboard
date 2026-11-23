import { useFormContext } from 'react-hook-form';
import type { DynamicFormFieldConfig } from '../types';

interface RadioFieldProps {
  field: DynamicFormFieldConfig;
}

export function RadioField({ field }: RadioFieldProps) {
  const { register, formState: { errors } } = useFormContext();
  const error = errors[field.name];
  const options = field.options ?? [];

  return (
    <div className={field.className}>
      <label className="form-label d-block">{field.label}</label>
      <div className="d-flex flex-wrap gap-3">
        {options.map((opt) => (
          <div key={opt.value} className="form-check">
            <input
              id={`${field.name}-${opt.value}`}
              type="radio"
              value={opt.value}
              disabled={field.disabled}
              className={`form-check-input ${error ? 'is-invalid' : ''}`}
              {...register(field.name)}
            />
            <label className="form-check-label" htmlFor={`${field.name}-${opt.value}`}>
              {opt.label}
            </label>
          </div>
        ))}
      </div>
      {error && (
        <div className="invalid-feedback d-block">
          {error.message as string}
        </div>
      )}
    </div>
  );
}
