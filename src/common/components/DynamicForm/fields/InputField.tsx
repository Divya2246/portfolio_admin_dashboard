import { useFormContext } from 'react-hook-form';
import type { DynamicFormFieldConfig } from '../types';

interface InputFieldProps {
  field: DynamicFormFieldConfig;
}

const inputTypes: Record<string, string> = {
  text: 'text',
  email: 'email',
  password: 'password',
  number: 'number',
  date: 'date',
};

export function InputField({ field }: InputFieldProps) {
  const { register, formState: { errors } } = useFormContext();
  const type = inputTypes[field.type] ?? 'text';
  const error = errors[field.name];

  return (
    <div className={field.className}>
      <label htmlFor={field.name} className="form-label">
        {field.label}
      </label>
      <input
        id={field.name}
        type={type}
        placeholder={field.placeholder}
        disabled={field.disabled}
        className={`form-control ${error ? 'is-invalid' : ''}`}
        {...register(field.name, field.type === 'number' ? { setValueAs: (v) => (v === '' || v === undefined) ? undefined : Number(v) } : undefined)}
      />
      {error && (
        <div className="invalid-feedback d-block">
          {error.message as string}
        </div>
      )}
    </div>
  );
}
