import { useFormContext } from 'react-hook-form';
import type { DynamicFormFieldConfig } from '../types';

interface CheckboxFieldProps {
  field: DynamicFormFieldConfig;
}

export function CheckboxField({ field }: CheckboxFieldProps) {
  const { register, formState: { errors } } = useFormContext();
  const error = errors[field.name];

  return (
    <div className={field.className}>
      <div className="form-check">
        <input
          id={field.name}
          type="checkbox"
          disabled={field.disabled}
          className={`form-check-input ${error ? 'is-invalid' : ''}`}
          {...register(field.name)}
        />
        <label className="form-check-label" htmlFor={field.name}>
          {field.label}
        </label>
      </div>
      {error && (
        <div className="invalid-feedback d-block">
          {error.message as string}
        </div>
      )}
    </div>
  );
}
