import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { uploadPortfolioFile } from '../../../../firebase/services/storage.service';

interface ScreenshotFieldProps {
  /** react-hook-form path, e.g. freelanceProjects.0.screenshotUrl */
  name: string;
}

export function ScreenshotField({ name }: ScreenshotFieldProps) {
  const { register, setValue, watch } = useFormContext();
  const url = (watch(name) as string | undefined) ?? '';
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
      setValue(name, uploaded, { shouldDirty: true, shouldValidate: true });
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed. Try again.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div className="col-12">
      <span className="form-label small mb-1 d-block">Project screenshot</span>
      {url && (
        <img
          src={url}
          alt="Project screenshot"
          className="rounded border mb-2 bg-white"
          style={{ width: '100%', maxHeight: 160, objectFit: 'cover' }}
        />
      )}
      <input
        type="file"
        accept="image/*"
        className="form-control form-control-sm"
        disabled={uploading}
        onChange={handleFileChange}
      />
      {uploading && <p className="small text-muted mb-0 mt-1">Uploading…</p>}
      <input
        className="form-control form-control-sm mt-2"
        placeholder="Or paste a screenshot URL"
        {...register(name)}
      />
      <p className="form-text mb-0">A wide screenshot of the live product. Shown at the top of the card.</p>
      {uploadError && <div className="invalid-feedback d-block">{uploadError}</div>}
    </div>
  );
}
