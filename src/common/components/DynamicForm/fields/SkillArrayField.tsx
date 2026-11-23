import { useFormContext, useFieldArray } from 'react-hook-form';
import type { DynamicFormFieldConfig } from '../types';

interface SkillArrayFieldProps {
  field: DynamicFormFieldConfig;
}

export function SkillArrayField({ field }: SkillArrayFieldProps) {
  const { control, register, formState: { errors } } = useFormContext();
  const { fields, append, remove } = useFieldArray({ control, name: field.name as never });
  const error = errors[field.name];

  const emptySkill = { name: '', percentage: undefined as number | undefined };

  return (
    <div className={field.className}>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <label className="form-label mb-0">{field.label}</label>
        <button
          type="button"
          className="btn btn-sm btn-outline-primary"
          onClick={() => append(emptySkill)}
        >
          Add skill
        </button>
      </div>
      <div className="row g-2">
        {fields.map((item, index) => (
          <div key={item.id} className="col-12 col-md-4">
            <div className="d-flex gap-2 align-items-center">
              <input
                className="form-control form-control-sm"
                placeholder="Skill name (e.g. React, TypeScript)"
                {...register(`${field.name}.${index}.name` as const)}
              />
              <button
                type="button"
                className="btn btn-sm btn-outline-danger flex-shrink-0"
                onClick={() => remove(index)}
                aria-label="Remove"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      {error && typeof error === 'object' && 'message' in error && typeof (error as { message?: unknown }).message === 'string' && (
        <div className="invalid-feedback d-block">{(error as { message: string }).message}</div>
      )}
    </div>
  );
}
