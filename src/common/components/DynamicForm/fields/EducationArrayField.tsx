import { useFormContext, useFieldArray } from 'react-hook-form';
import type { DynamicFormFieldConfig } from '../types';

interface EducationArrayFieldProps {
  field: DynamicFormFieldConfig;
}

export function EducationArrayField({ field }: EducationArrayFieldProps) {
  const { control, register, formState: { errors } } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: field.name as never,
  });
  const error = errors[field.name];

  const emptyEducation = { degree: '', institution: '', location: '', period: '', grade: '' };

  return (
    <div className={field.className}>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <label className="form-label mb-0">{field.label}</label>
        <button
          type="button"
          className="btn btn-sm btn-outline-primary"
          onClick={() => append(emptyEducation)}
        >
          Add education
        </button>
      </div>
      <div className="d-flex flex-column gap-3">
        {fields.map((item, index) => (
          <div key={item.id} className="border rounded p-3 bg-light">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="small fw-semibold text-muted">Education {index + 1}</span>
              <button
                type="button"
                className="btn btn-sm btn-outline-danger"
                onClick={() => remove(index)}
              >
                Remove
              </button>
            </div>
            <div className="row g-2">
              <div className="col-12">
                <input
                  className="form-control form-control-sm"
                  placeholder="Degree"
                  {...register(`${field.name}.${index}.degree` as const)}
                />
              </div>
              <div className="col-12">
                <input
                  className="form-control form-control-sm"
                  placeholder="Institution"
                  {...register(`${field.name}.${index}.institution` as const)}
                />
              </div>
              <div className="col-12">
                <input
                  className="form-control form-control-sm"
                  placeholder="Location"
                  {...register(`${field.name}.${index}.location` as const)}
                />
              </div>
              <div className="col-12">
                <input
                  className="form-control form-control-sm"
                  placeholder="Period (e.g. May 2020 – October 2022)"
                  {...register(`${field.name}.${index}.period` as const)}
                />
              </div>
              <div className="col-12">
                <input
                  className="form-control form-control-sm"
                  placeholder="Grade (e.g. CGPA: 8.84/10.0)"
                  {...register(`${field.name}.${index}.grade` as const)}
                />
              </div>
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
