import { useRef, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import type { DynamicFormFieldConfig } from '../types';
import { uploadPortfolioFile } from '../../../../firebase/services/storage.service';

interface ImageArrayFieldProps {
  field: DynamicFormFieldConfig;
}

export function ImageArrayField({ field }: ImageArrayFieldProps) {
  const { control, register, setValue, watch, formState: { errors } } = useFormContext();
  const { fields, append, remove, move } = useFieldArray({ control, name: field.name as never });
  const urls = (watch(field.name) as string[] | undefined) ?? [];
  const error = errors[field.name];
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [rowUploading, setRowUploading] = useState<number | null>(null);
  const addInputRef = useRef<HTMLInputElement | null>(null);

  const errorMessage = error && typeof error === 'object' && 'message' in error && typeof (error as { message?: unknown }).message === 'string'
    ? (error as { message: string }).message
    : null;

  const uploadOne = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      throw new Error('Choose an image file (JPG, PNG, or WebP).');
    }
    return uploadPortfolioFile(file, 'portfolio');
  };

  const handleAddFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = '';
    if (files.length === 0) return;
    setUploading(true);
    setUploadError(null);
    try {
      for (let i = 0; i < files.length; i += 1) {
        setUploadProgress(`Uploading ${i + 1} of ${files.length}…`);
        const url = await uploadOne(files[i]);
        append(url as never);
      }
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed. Try again.');
    } finally {
      setUploading(false);
      setUploadProgress(null);
    }
  };

  const handleReplaceFile = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setRowUploading(index);
    setUploadError(null);
    try {
      const url = await uploadOne(file);
      setValue(`${field.name}.${index}`, url, { shouldDirty: true, shouldValidate: true });
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed. Try again.');
    } finally {
      setRowUploading(null);
    }
  };

  return (
    <div className={field.className}>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-2">
        <label className="form-label mb-0">{field.label}</label>
        <div className="d-flex flex-wrap gap-2">
          <button
            type="button"
            className="btn btn-sm btn-outline-primary"
            disabled={field.disabled || uploading}
            onClick={() => addInputRef.current?.click()}
          >
            Upload photos
          </button>
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            disabled={field.disabled || uploading}
            onClick={() => append('' as never)}
          >
            Add URL
          </button>
        </div>
      </div>
      <input
        ref={addInputRef}
        type="file"
        accept="image/*"
        multiple
        className="d-none"
        disabled={field.disabled || uploading}
        onChange={handleAddFiles}
      />
      <p className="form-text mt-0">
        The first photo is the main profile picture. Visitors can switch through the rest. Square photos look best.
      </p>
      {uploadProgress && <p className="small text-muted mb-2">{uploadProgress}</p>}
      {fields.length === 0 && (
        <div className="border rounded bg-light text-muted small p-3 mb-2">No photos yet.</div>
      )}
      <div className="d-flex flex-column gap-3">
        {fields.map((item, index) => {
          const url = urls[index] ?? '';
          const busy = uploading || rowUploading === index;
          return (
            <div key={item.id} className="border rounded p-3 bg-light">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="small fw-semibold text-muted">
                  Photo {index + 1}
                  {index === 0 ? ' · Main' : ''}
                </span>
                <div className="d-flex gap-1">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    disabled={index === 0 || busy}
                    onClick={() => move(index, index - 1)}
                    aria-label={`Move photo ${index + 1} up`}
                  >
                    Up
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    disabled={index === fields.length - 1 || busy}
                    onClick={() => move(index, index + 1)}
                    aria-label={`Move photo ${index + 1} down`}
                  >
                    Down
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    disabled={busy}
                    onClick={() => remove(index)}
                    aria-label={`Remove photo ${index + 1}`}
                  >
                    Remove
                  </button>
                </div>
              </div>
              <div className="d-flex flex-column flex-sm-row align-items-start gap-3">
                {url ? (
                  <img
                    src={url}
                    alt={index === 0 ? 'Main profile' : `Profile ${index + 1}`}
                    className="rounded-3 border bg-white"
                    style={{ width: 88, height: 88, objectFit: 'cover' }}
                  />
                ) : (
                  <div
                    className="rounded-3 border bg-white d-flex align-items-center justify-content-center text-muted small"
                    style={{ width: 88, height: 88 }}
                  >
                    No photo
                  </div>
                )}
                <div className="flex-grow-1 w-100">
                  <input
                    type="file"
                    accept="image/*"
                    className="form-control form-control-sm"
                    disabled={field.disabled || busy}
                    aria-label={`Replace photo ${index + 1}`}
                    onChange={(e) => handleReplaceFile(index, e)}
                  />
                  {rowUploading === index && <p className="small text-muted mb-1 mt-1">Uploading…</p>}
                  <input
                    type="url"
                    disabled={field.disabled || busy}
                    placeholder={field.placeholder ?? 'Or paste an image URL'}
                    className="form-control form-control-sm mt-2"
                    {...register(`${field.name}.${index}` as const)}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {uploadError && <div className="invalid-feedback d-block">{uploadError}</div>}
      {errorMessage && <div className="invalid-feedback d-block">{errorMessage}</div>}
    </div>
  );
}
