import { useFormContext, useFieldArray } from 'react-hook-form';
import type { DynamicFormFieldConfig } from '../types';

interface ExperienceArrayFieldProps {
  field: DynamicFormFieldConfig;
}

const emptyProject = {
  name: '',
  summary: '',
  contribution: '',
  techStack: '',
  impact: '',
  url: '',
};

function ExperienceProjects({ name }: { name: string }) {
  const { control, register } = useFormContext();
  const { fields, append, remove } = useFieldArray({ control, name: name as never });

  return (
    <div className="mt-3 border-top pt-3">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <span className="small fw-semibold text-muted">Projects at this organization</span>
        <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => append(emptyProject)}>
          Add project
        </button>
      </div>
      {fields.length === 0 && (
        <p className="small text-muted mb-0">Add each product or project you worked on in this role.</p>
      )}
      <div className="d-flex flex-column gap-2">
        {fields.map((item, index) => (
          <div key={item.id} className="border rounded p-2 bg-white">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="small text-muted">Project {index + 1}</span>
              <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => remove(index)}>
                Remove
              </button>
            </div>
            <div className="row g-2">
              <div className="col-12">
                <input className="form-control form-control-sm" placeholder="Project name" {...register(`${name}.${index}.name` as const)} />
              </div>
              <div className="col-12">
                <textarea className="form-control form-control-sm" rows={2} placeholder="What the project was" {...register(`${name}.${index}.summary` as const)} />
              </div>
              <div className="col-12">
                <textarea className="form-control form-control-sm" rows={2} placeholder="What you did on it" {...register(`${name}.${index}.contribution` as const)} />
              </div>
              <div className="col-12 col-md-6">
                <input className="form-control form-control-sm" placeholder="Tech used" {...register(`${name}.${index}.techStack` as const)} />
              </div>
              <div className="col-12 col-md-6">
                <input className="form-control form-control-sm" placeholder="Link, if it can be shared" {...register(`${name}.${index}.url` as const)} />
              </div>
              <div className="col-12">
                <input className="form-control form-control-sm" placeholder="Impact, e.g. cut load time by 40%" {...register(`${name}.${index}.impact` as const)} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ExperienceArrayField({ field }: ExperienceArrayFieldProps) {
  const { control, register, formState: { errors } } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: field.name as never,
  });
  const error = errors[field.name];

  const emptyExperience = {
    role: '',
    company: '',
    location: '',
    period: '',
    points: '',
    techStack: '',
    systemsBuilt: '',
    performanceImprovements: '',
    reusableComponents: '',
    impact: '',
    projects: [],
  };

  return (
    <div className={field.className}>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <label className="form-label mb-0">{field.label}</label>
        <button
          type="button"
          className="btn btn-sm btn-outline-primary"
          onClick={() => append(emptyExperience)}
        >
          Add experience
        </button>
      </div>
      <div className="d-flex flex-column gap-3">
        {fields.map((item, index) => (
          <div key={item.id} className="border rounded p-3 bg-light">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="small fw-semibold text-muted">Experience {index + 1}</span>
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
                  placeholder="Role / Job title"
                  {...register(`${field.name}.${index}.role` as const)}
                />
              </div>
              <div className="col-12">
                <input
                  className="form-control form-control-sm"
                  placeholder="Company"
                  {...register(`${field.name}.${index}.company` as const)}
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
                  placeholder="Period (e.g. Mar 2022 – Present)"
                  {...register(`${field.name}.${index}.period` as const)}
                />
              </div>
              <div className="col-12">
                <textarea
                  className="form-control form-control-sm"
                  placeholder="Key points / responsibilities (one per line)"
                  rows={5}
                  {...register(`${field.name}.${index}.points` as const)}
                />
              </div>
              <div className="col-12">
                <input
                  className="form-control form-control-sm"
                  placeholder="Tech stack"
                  {...register(`${field.name}.${index}.techStack` as const)}
                />
              </div>
              <div className="col-12">
                <textarea
                  className="form-control form-control-sm"
                  placeholder="Systems you built"
                  rows={2}
                  {...register(`${field.name}.${index}.systemsBuilt` as const)}
                />
              </div>
              <div className="col-12">
                <textarea
                  className="form-control form-control-sm"
                  placeholder="Performance improvements"
                  rows={2}
                  {...register(`${field.name}.${index}.performanceImprovements` as const)}
                />
              </div>
              <div className="col-12">
                <textarea
                  className="form-control form-control-sm"
                  placeholder="Reusable components created"
                  rows={2}
                  {...register(`${field.name}.${index}.reusableComponents` as const)}
                />
              </div>
              <div className="col-12">
                <textarea
                  className="form-control form-control-sm"
                  placeholder="Impact (users served / time saved / optimization)"
                  rows={2}
                  {...register(`${field.name}.${index}.impact` as const)}
                />
              </div>
            </div>
            <ExperienceProjects name={`${field.name}.${index}.projects`} />
          </div>
        ))}
      </div>
      {error && typeof error === 'object' && 'message' in error && typeof (error as { message?: unknown }).message === 'string' && (
        <div className="invalid-feedback d-block">{(error as { message: string }).message}</div>
      )}
    </div>
  );
}
