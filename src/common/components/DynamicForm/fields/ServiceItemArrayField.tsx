import { useFormContext, useFieldArray } from 'react-hook-form';
import type { DynamicFormFieldConfig } from '../types';

interface ServiceItemArrayFieldProps {
  field: DynamicFormFieldConfig;
}

const emptyItem = {
  title: '',
  description: '',
  problemItSolves: '',
  whoItIsFor: '',
};

export function ServiceItemArrayField({ field }: ServiceItemArrayFieldProps) {
  const { control, register, formState: { errors } } = useFormContext();
  const { fields, append, remove } = useFieldArray({ control, name: field.name as never });
  const error = errors[field.name];

  return (
    <div className={field.className}>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <label className="form-label mb-0">{field.label}</label>
        <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => append(emptyItem)}>
          Add service
        </button>
      </div>
      <p className="text-muted small mb-2">
        These cards replace the simple service list on the site when at least one service has a title.
      </p>
      <div className="d-flex flex-column gap-3">
        {fields.map((item, index) => (
          <div key={item.id} className="border rounded p-3 bg-light">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="small fw-semibold text-muted">Service {index + 1}</span>
              <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => remove(index)}>Remove</button>
            </div>
            <div className="row g-2">
              <div className="col-12">
                <input className="form-control form-control-sm" placeholder="Service title, e.g. Website Development" {...register(`${field.name}.${index}.title` as const)} />
              </div>
              <div className="col-12">
                <textarea className="form-control form-control-sm" placeholder="What you deliver (2–3 lines)" rows={2} {...register(`${field.name}.${index}.description` as const)} />
              </div>
              <div className="col-12 col-md-6">
                <input className="form-control form-control-sm" placeholder="Problem it solves" {...register(`${field.name}.${index}.problemItSolves` as const)} />
              </div>
              <div className="col-12 col-md-6">
                <input className="form-control form-control-sm" placeholder="Who it is for, e.g. Startups" {...register(`${field.name}.${index}.whoItIsFor` as const)} />
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
