import { useFormContext, useFieldArray } from 'react-hook-form';
import type { DynamicFormFieldConfig } from '../types';
import { ScreenshotField } from './ScreenshotField';

interface ProjectArrayFieldProps {
  field: DynamicFormFieldConfig;
}

export function ProjectArrayField({ field }: ProjectArrayFieldProps) {
  const { control, register, formState: { errors } } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: field.name as never,
  });
  const error = errors[field.name];

  const emptyProject = { name: '', tech: '', url: '', highlights: '', screenshotUrl: '', resultHighlight: '', isNotWorking: false };

  return (
    <div className={field.className}>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <label className="form-label mb-0">{field.label}</label>
        <button
          type="button"
          className="btn btn-sm btn-outline-primary"
          onClick={() => append(emptyProject)}
        >
          Add project
        </button>
      </div>
      <div className="d-flex flex-column gap-3">
        {fields.map((item, index) => (
          <div key={item.id} className="border rounded p-3 bg-light">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="small fw-semibold text-muted">Project {index + 1}</span>
              <button
                type="button"
                className="btn btn-sm btn-outline-danger"
                onClick={() => remove(index)}
              >
                Remove
              </button>
            </div>
            <div className="row g-2">
              <ScreenshotField name={`${field.name}.${index}.screenshotUrl`} />
              <div className="col-12">
                <input
                  className="form-control form-control-sm"
                  placeholder="Project name"
                  {...register(`${field.name}.${index}.name` as const)}
                />
              </div>
              <div className="col-12">
                <input
                  className="form-control form-control-sm"
                  placeholder="Outcome, e.g. 40% faster checkout"
                  {...register(`${field.name}.${index}.resultHighlight` as const)}
                />
              </div>
              <div className="col-12">
                <input
                  className="form-control form-control-sm"
                  placeholder="Technologies"
                  {...register(`${field.name}.${index}.tech` as const)}
                />
              </div>
              <div className="col-12">
                <input
                  className="form-control form-control-sm"
                  placeholder="URL"
                  {...register(`${field.name}.${index}.url` as const)}
                />
              </div>
              <div className="col-12">
                <textarea
                  className="form-control form-control-sm"
                  placeholder="Highlights (one per line)"
                  rows={3}
                  {...register(`${field.name}.${index}.highlights` as const)}
                />
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
      {error && typeof error.message === 'string' && (
        <div className="invalid-feedback d-block">{error.message}</div>
      )}
    </div>
  );
}
