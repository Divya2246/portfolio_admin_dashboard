import { useFormContext, useFieldArray } from 'react-hook-form';
import type { DynamicFormFieldConfig } from '../types';

interface StringArrayFieldProps {
  field: DynamicFormFieldConfig;
}

export function StringArrayField({ field }: StringArrayFieldProps) {
  const { control, register, formState: { errors } } = useFormContext();
  const { fields, append, remove } = useFieldArray({ control, name: field.name as never });
  const error = errors[field.name];
  const errorMessage = error && typeof error === 'object' && 'message' in error && typeof (error as { message?: unknown }).message === 'string'
    ? (error as { message: string }).message
    : null;

  return (
    <div className={field.className}>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <label className="form-label mb-0">{field.label}</label>
        <button
          type="button"
          className="btn btn-sm btn-outline-primary"
          onClick={() => append('')}
        >
          Add new
        </button>
      </div>
      <div className="d-flex flex-column gap-2">
        {fields.map((item, index) => (
          <div key={item.id} className="d-flex gap-2 align-items-start">
            <input
              className="form-control form-control-sm"
              placeholder={field.placeholder ?? 'Item'}
              {...register(`${field.name}.${index}` as const)}
            />
            <button
              type="button"
              className="btn btn-sm btn-outline-danger"
              onClick={() => remove(index)}
              aria-label="Remove"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      {errorMessage && (
        <div className="invalid-feedback d-block">{errorMessage}</div>
      )}
    </div>
  );
}
