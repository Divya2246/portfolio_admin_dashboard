export type FieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'textarea'
  | 'select'
  | 'checkbox'
  | 'radio'
  | 'file'
  | 'date'
  | 'section'
  | 'stringArray'
  | 'skillArray'
  | 'projectArray'
  | 'educationArray'
  | 'experienceArray'
  | 'mediaArray'
  | 'freelanceProjectArray'
  | 'featuredProjectArray'
  | 'testimonialArray'
  | 'skillCategoryArray'
  | 'imageUpload'
  | 'imageArray'
  | 'serviceItemArray'
  | 'faqArray';

export interface FieldOption {
  label: string;
  value: string;
}

export interface FieldValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  min?: number;
  max?: number;
}

export interface ShowWhenCondition {
  field: string;
  value: string | number | boolean;
}

export interface DynamicFormFieldConfig {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: FieldOption[];
  validation?: FieldValidation;
  disabled?: boolean;
  hidden?: boolean;
  className?: string;
  showWhen?: ShowWhenCondition;
  fullWidth?: boolean;
  rows?: number;
}

export interface DynamicFormProps<T extends Record<string, unknown>> {
  fields: DynamicFormFieldConfig[];
  defaultValues?: Partial<T>;
  onSubmit: (data: T) => void | Promise<void>;
  twoColumnLayout?: boolean;
  /** Group fields under section headings and let each section be shown or hidden. */
  sectioned?: boolean;
  /**
   * Saved public-site visibility. `sections` maps an editor section id to a key
   * stored at `${name}.${key}`.
   */
  siteVisibility?: {
    name: string;
    sections: Record<string, string>;
    extras?: Record<string, { key: string; label: string }[]>;
  };
  submitLabel?: string;
  isSubmitting?: boolean;
  /** Lets a submit button outside this form (for example in the header) target it. */
  formId?: string;
  /** Called with a reader for the current form values, including unsaved edits. */
  onReady?: (getValues: () => T) => void;
}
