import { useFormContext } from 'react-hook-form';
import type { DynamicFormFieldConfig } from '../types';

interface FileFieldProps {
  field: DynamicFormFieldConfig;
}

export function FileField({ field }: FileFieldProps) {
  const { register, formState: { errors } } = useFormContext();
  const error = errors[field.name];

  return (
    <div className={field.className}>
      <label htmlFor={field.name} className="form-label">
        {field.label}
      </label>
      <input
        id={field.name}
        type="file"
        disabled={field.disabled}
        className={`form-control ${error ? 'is-invalid' : ''}`}
        {...register(field.name)}
      />
      {error && (
        <div className="invalid-feedback d-block">
          {error.message as string}
        </div>
      )}
    </div>
  );
}
