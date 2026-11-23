import { useFormContext, useFieldArray } from 'react-hook-form';
import type { DynamicFormFieldConfig } from '../types';

interface FaqArrayFieldProps {
  field: DynamicFormFieldConfig;
}

const emptyItem = { question: '', answer: '' };

export function FaqArrayField({ field }: FaqArrayFieldProps) {
  const { control, register, formState: { errors } } = useFormContext();
  const { fields, append, remove } = useFieldArray({ control, name: field.name as never });
  const error = errors[field.name];

  return (
    <div className={field.className}>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <label className="form-label mb-0">{field.label}</label>
        <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => append(emptyItem)}>
          Add question
        </button>
      </div>
      <p className="text-muted small mb-2">
        Answer the questions visitors ask before they hire you: cost, timeline, revisions, support.
      </p>
      <div className="d-flex flex-column gap-3">
        {fields.map((item, index) => (
          <div key={item.id} className="border rounded p-3 bg-light">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="small fw-semibold text-muted">Question {index + 1}</span>
              <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => remove(index)}>Remove</button>
            </div>
            <div className="row g-2">
              <div className="col-12">
                <input className="form-control form-control-sm" placeholder="Question, e.g. How long does a website take?" {...register(`${field.name}.${index}.question` as const)} />
              </div>
              <div className="col-12">
                <textarea className="form-control form-control-sm" placeholder="Answer" rows={3} {...register(`${field.name}.${index}.answer` as const)} />
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
