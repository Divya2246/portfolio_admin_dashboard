import { useFormContext, useFieldArray } from 'react-hook-form';
import type { DynamicFormFieldConfig } from '../types';
import { ScreenshotField } from './ScreenshotField';

interface FreelanceProjectArrayFieldProps {
  field: DynamicFormFieldConfig;
}

const emptyItem = {
  clientName: '',
  clientType: '',
  problem: '',
  solution: '',
  techStack: '',
  timeline: '',
  keyFeatures: '',
  results: '',
  resultHighlight: '',
  screenshotUrl: '',
  liveLink: '',
  isNda: false,
  isNotWorking: false,
};

export function FreelanceProjectArrayField({ field }: FreelanceProjectArrayFieldProps) {
  const { control, register, formState: { errors } } = useFormContext();
  const { fields, append, remove } = useFieldArray({ control, name: field.name as never });
  const error = errors[field.name];

  return (
    <div className={field.className}>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <label className="form-label mb-0">{field.label}</label>
        <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => append(emptyItem)}>
          Add freelance project
        </button>
      </div>
      <div className="d-flex flex-column gap-3">
        {fields.map((item, index) => (
          <div key={item.id} className="border rounded p-3 bg-light">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="small fw-semibold text-muted">Freelance project {index + 1}</span>
              <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => remove(index)}>Remove</button>
            </div>
            <div className="row g-2">
              <ScreenshotField name={`${field.name}.${index}.screenshotUrl`} />
              <div className="col-12 col-md-6">
                <input className="form-control form-control-sm" placeholder="Client name, e.g. Northwind Cafe" {...register(`${field.name}.${index}.clientName` as const)} />
              </div>
              <div className="col-12 col-md-6">
                <input className="form-control form-control-sm" placeholder="Client type (Startup / Local Business / SaaS Founder)" {...register(`${field.name}.${index}.clientType` as const)} />
              </div>
              <div className="col-12">
                <input className="form-control form-control-sm" placeholder="Result highlight, e.g. 12 hrs/week saved" {...register(`${field.name}.${index}.resultHighlight` as const)} />
              </div>
              <div className="col-12 col-md-6">
                <label className="form-check small">
                  <input type="checkbox" className="form-check-input" {...register(`${field.name}.${index}.isNda` as const)} />
                  <span className="form-check-label">NDA – show "Private client project"</span>
                </label>
              </div>
              <div className="col-12">
                <textarea className="form-control form-control-sm" placeholder="Problem they had" rows={2} {...register(`${field.name}.${index}.problem` as const)} />
              </div>
              <div className="col-12">
                <textarea className="form-control form-control-sm" placeholder="Solution you built" rows={2} {...register(`${field.name}.${index}.solution` as const)} />
              </div>
              <div className="col-12">
                <input className="form-control form-control-sm" placeholder="Tech stack used" {...register(`${field.name}.${index}.techStack` as const)} />
              </div>
              <div className="col-12 col-md-6">
                <input className="form-control form-control-sm" placeholder="Timeline" {...register(`${field.name}.${index}.timeline` as const)} />
              </div>
              <div className="col-12 col-md-6">
                <input className="form-control form-control-sm" placeholder="Live link (if allowed)" {...register(`${field.name}.${index}.liveLink` as const)} />
              </div>
              <div className="col-12">
                <textarea className="form-control form-control-sm" placeholder="Key features (one per line)" rows={2} {...register(`${field.name}.${index}.keyFeatures` as const)} />
              </div>
              <div className="col-12">
                <textarea className="form-control form-control-sm" placeholder="Results (conversion improvement / automation / time saved)" rows={2} {...register(`${field.name}.${index}.results` as const)} />
              </div>
              <div className="col-12">
                <label className="form-check small mb-0">
                  <input type="checkbox" className="form-check-input" {...register(`${field.name}.${index}.isNotWorking` as const)} />
                  <span className="form-check-label">Not working — live demo is down. Visitors see a “Currently not working” badge. The project stays visible.</span>
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
