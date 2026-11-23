import { useFormContext, useFieldArray } from 'react-hook-form';
import type { DynamicFormFieldConfig } from '../types';
import { ScreenshotField } from './ScreenshotField';

interface FeaturedProjectArrayFieldProps {
  field: DynamicFormFieldConfig;
}

const emptyItem = {
  name: '',
  problem: '',
  solution: '',
  architectureThinking: '',
  keyFeatures: '',
  githubLink: '',
  liveLink: '',
  screenshotUrl: '',
  resultHighlight: '',
  isNotWorking: false,
};

export function FeaturedProjectArrayField({ field }: FeaturedProjectArrayFieldProps) {
  const { control, register, formState: { errors } } = useFormContext();
  const { fields, append, remove } = useFieldArray({ control, name: field.name as never });
  const error = errors[field.name];

  return (
    <div className={field.className}>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <label className="form-label mb-0">{field.label}</label>
        <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => append(emptyItem)}>
          Add featured project
        </button>
      </div>
      <div className="d-flex flex-column gap-3">
        {fields.map((item, index) => (
          <div key={item.id} className="border rounded p-3 bg-light">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="small fw-semibold text-muted">Featured project {index + 1}</span>
              <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => remove(index)}>Remove</button>
            </div>
            <div className="row g-2">
              <ScreenshotField name={`${field.name}.${index}.screenshotUrl`} />
              <div className="col-12">
                <input className="form-control form-control-sm" placeholder="Project name" {...register(`${field.name}.${index}.name` as const)} />
              </div>
              <div className="col-12">
                <input className="form-control form-control-sm" placeholder="Outcome, e.g. Cut load time by 40%" {...register(`${field.name}.${index}.resultHighlight` as const)} />
              </div>
              <div className="col-12">
                <textarea className="form-control form-control-sm" placeholder="Problem" rows={2} {...register(`${field.name}.${index}.problem` as const)} />
              </div>
              <div className="col-12">
                <textarea className="form-control form-control-sm" placeholder="Solution" rows={2} {...register(`${field.name}.${index}.solution` as const)} />
              </div>
              <div className="col-12">
                <textarea className="form-control form-control-sm" placeholder="Architecture thinking" rows={2} {...register(`${field.name}.${index}.architectureThinking` as const)} />
              </div>
              <div className="col-12">
                <textarea className="form-control form-control-sm" placeholder="Key features (one per line)" rows={2} {...register(`${field.name}.${index}.keyFeatures` as const)} />
              </div>
              <div className="col-12 col-md-6">
                <input className="form-control form-control-sm" placeholder="GitHub link" {...register(`${field.name}.${index}.githubLink` as const)} />
              </div>
              <div className="col-12 col-md-6">
                <input className="form-control form-control-sm" placeholder="Live link" {...register(`${field.name}.${index}.liveLink` as const)} />
              </div>
              <div className="col-12">
                <label className="form-check small mb-0">
                  <input type="checkbox" className="form-check-input" {...register(`${field.name}.${index}.isNotWorking` as const)} />
                  <span className="form-check-label">Not working — live demo is down. Visitors see a “Currently not working” badge.</span>
                </label>
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
