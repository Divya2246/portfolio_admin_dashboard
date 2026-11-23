import { useState, useRef } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import type { DynamicFormFieldConfig } from '../types';
import { uploadPortfolioFile, getFileTypeFromFile } from '../../../../firebase/services/storage.service';

const ACCEPT = 'image/*,application/pdf,video/*';

interface MediaArrayFieldProps {
  field: DynamicFormFieldConfig;
}

export function MediaArrayField({ field }: MediaArrayFieldProps) {
  const { control, register, setValue, formState: { errors } } = useFormContext();
  const { fields, append, remove } = useFieldArray({ control, name: field.name as never });
  const [uploading, setUploading] = useState<number | null>(null);
  const fileInputRefs = useRef<Record<number, HTMLInputElement | null>>({});
  const error = errors[field.name];

  const emptyItem = { title: '', url: '', fileType: undefined as 'image' | 'pdf' | 'video' | undefined };

  const handleFileChange = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(index);
    try {
      const url = await uploadPortfolioFile(file);
      const fileType = getFileTypeFromFile(file);
      setValue(`${field.name}.${index}.url` as never, url as never);
      setValue(`${field.name}.${index}.fileType` as never, fileType as never);
      setValue(`${field.name}.${index}.fileName` as never, file.name as never);
    } catch (err) {
      console.error('Upload failed', err);
    } finally {
      setUploading(null);
      e.target.value = '';
    }
  };

  return (
    <div className={field.className}>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <label className="form-label mb-0">{field.label}</label>
        <button
          type="button"
          className="btn btn-sm btn-outline-primary"
          onClick={() => append(emptyItem)}
        >
          Add file
        </button>
      </div>
      <div className="d-flex flex-column gap-3">
        {fields.map((item, index) => (
          <div key={item.id} className="border rounded p-3 bg-light">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="small fw-semibold text-muted">Item {index + 1}</span>
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
                  placeholder="Title"
                  {...register(`${field.name}.${index}.title` as const)}
                />
              </div>
              <div className="col-12">
                <input
                  ref={(el) => { fileInputRefs.current[index] = el; }}
                  type="file"
                  accept={ACCEPT}
                  className="form-control form-control-sm"
                  disabled={uploading === index}
                  onChange={(e) => handleFileChange(index, e)}
                />
                {uploading === index && <span className="small text-muted">Uploading…</span>}
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
