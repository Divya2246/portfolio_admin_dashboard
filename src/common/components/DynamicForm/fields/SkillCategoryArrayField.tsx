import { useFormContext, useFieldArray } from 'react-hook-form';
import type { DynamicFormFieldConfig } from '../types';

interface SkillCategoryArrayFieldProps {
  field: DynamicFormFieldConfig;
}

function SkillsInCategory({
  baseName,
  categoryIndex,
}: {
  baseName: string;
  categoryIndex: number;
}) {
  const { control, register } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: `${baseName}.${categoryIndex}.skills` as never,
  });

  return (
    <div className="d-flex flex-column gap-2 mt-2">
      {fields.map((item, skillIndex) => (
        <div key={item.id} className="d-flex gap-2 align-items-center">
          <input
            className="form-control form-control-sm"
            placeholder="Skill name"
            {...register(`${baseName}.${categoryIndex}.skills.${skillIndex}` as const)}
          />
          <button
            type="button"
            className="btn btn-sm btn-outline-danger"
            onClick={() => remove(skillIndex)}
            aria-label="Remove skill"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        className="btn btn-sm btn-outline-secondary align-self-start"
        onClick={() => append('')}
      >
        + Add skill
      </button>
    </div>
  );
}

const emptyCategory = { category: '', skills: [] as string[] };

export function SkillCategoryArrayField({ field }: SkillCategoryArrayFieldProps) {
  const { control, register, formState: { errors } } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: field.name as never,
  });
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
          onClick={() => append(emptyCategory)}
        >
          Add category
        </button>
      </div>
      <p className="text-muted small mb-2">Group skills by category (e.g. Frontend, State Management, UI/Styling).</p>
      <div className="d-flex flex-column gap-4">
        {fields.map((item, index) => (
          <div key={item.id} className="border rounded p-3 bg-light">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <input
                className="form-control form-control-sm w-auto"
                placeholder="Category name (e.g. Frontend)"
                style={{ minWidth: 180 }}
                {...register(`${field.name}.${index}.category` as const)}
              />
              <button
                type="button"
                className="btn btn-sm btn-outline-danger"
                onClick={() => remove(index)}
                aria-label="Remove category"
              >
                Remove category
              </button>
            </div>
            <SkillsInCategory baseName={field.name} categoryIndex={index} />
          </div>
        ))}
      </div>
      {errorMessage && (
        <div className="invalid-feedback d-block">{errorMessage}</div>
      )}
    </div>
  );
}
