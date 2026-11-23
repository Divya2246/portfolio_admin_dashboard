import { useFormContext } from 'react-hook-form';
import type { DynamicFormFieldConfig } from '../types';

interface TextAreaFieldProps {
  field: DynamicFormFieldConfig;
}

export function TextAreaField({ field }: TextAreaFieldProps) {
  const { register, formState: { errors } } = useFormContext();
  const error = errors[field.name];

  return (
    <div className={field.className}>
      <label htmlFor={field.name} className="form-label">
        {field.label}
      </label>
      <textarea
        id={field.name}
        placeholder={field.placeholder}
        disabled={field.disabled}
        className={`form-control ${error ? 'is-invalid' : ''}`}
        rows={field.rows ?? 3}
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
