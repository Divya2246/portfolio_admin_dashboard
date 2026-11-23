import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import type { DynamicFormFieldConfig } from '../types';
import { uploadPortfolioFile } from '../../../../firebase/services/storage.service';

interface ImageUploadFieldProps {
  field: DynamicFormFieldConfig;
}

export function ImageUploadField({ field }: ImageUploadFieldProps) {
  const { register, setValue, watch, formState: { errors } } = useFormContext();
  const url = (watch(field.name) as string | undefined) ?? '';
  const error = errors[field.name];
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setUploadError('Choose an image file (JPG, PNG, or WebP).');
      e.target.value = '';
      return;
    }
    setUploading(true);
    setUploadError(null);
    try {
      const uploaded = await uploadPortfolioFile(file, 'portfolio');
      setValue(field.name, uploaded, { shouldDirty: true, shouldValidate: true });
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed. Try again.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div className={field.className}>
      <label htmlFor={`${field.name}-file`} className="form-label">
        {field.label}
      </label>
      <div className="d-flex flex-column flex-sm-row align-items-start gap-3">
        {url ? (
          <img
            src={url}
            alt="Developer profile"
            className="rounded-3 border bg-white"
            style={{ width: 88, height: 88, objectFit: 'cover' }}
          />
        ) : (
          <div
            className="rounded-3 border bg-light d-flex align-items-center justify-content-center text-muted small"
            style={{ width: 88, height: 88 }}
          >
            No photo
          </div>
        )}
        <div className="flex-grow-1 w-100">
          <input
            id={`${field.name}-file`}
            type="file"
            accept="image/*"
            className="form-control form-control-sm"
            disabled={field.disabled || uploading}
            onChange={handleFileChange}
          />
          {uploading && <p className="small text-muted mb-1 mt-1">Uploading…</p>}
          <input
            id={field.name}
            type="url"
            disabled={field.disabled || uploading}
            placeholder={field.placeholder ?? 'Or paste an image URL'}
            className={`form-control form-control-sm mt-2 ${error ? 'is-invalid' : ''}`}
            {...register(field.name)}
          />
          <p className="form-text mb-0">Shown in the hero. A square photo looks best.</p>
          {url && (
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary mt-2"
              onClick={() => setValue(field.name, '', { shouldDirty: true, shouldValidate: true })}
            >
              Remove photo
            </button>
          )}
        </div>
      </div>
      {uploadError && <div className="invalid-feedback d-block">{uploadError}</div>}
      {error && (
        <div className="invalid-feedback d-block">{error.message as string}</div>
      )}
    </div>
  );
}
