import type { DynamicFormFieldConfig } from '../types';

interface SectionFieldProps {
  field: DynamicFormFieldConfig;
}

export function SectionField({ field }: SectionFieldProps) {
  return (
    <h3 className="mb-2 mt-4 border-b border-line pb-2 text-lg font-semibold text-ink">
      {field.label}
    </h3>
  );
}
