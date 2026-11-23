import { useForm, FormProvider, type DefaultValues, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo, useState } from 'react';
import { generateSchema } from './generateSchema';
import { FieldRenderer } from './FieldRenderer';
import type { DynamicFormFieldConfig, DynamicFormProps } from './types';

const WIDE_TYPES = new Set([
  'section',
  'stringArray',
  'skillArray',
  'skillCategoryArray',
  'projectArray',
  'educationArray',
  'experienceArray',
  'mediaArray',
  'freelanceProjectArray',
  'featuredProjectArray',
  'testimonialArray',
  'serviceItemArray',
  'faqArray',
  'imageArray',
  'textarea',
]);

const SECTION_VISIBILITY_KEY = 'portfolio-section-visibility';

interface FormSection {
  id: string;
  label: string;
  fields: DynamicFormFieldConfig[];
}

function isWide(field: DynamicFormFieldConfig) {
  return Boolean(field.fullWidth) || WIDE_TYPES.has(field.type);
}

function groupSections(fields: DynamicFormFieldConfig[]): FormSection[] {
  const groups: FormSection[] = [];
  let current: FormSection | null = null;

  fields.forEach((field) => {
    if (field.type === 'section') {
      current = { id: field.name, label: field.label, fields: [] };
      groups.push(current);
      return;
    }
    if (!current) {
      current = { id: 'general', label: 'General', fields: [] };
      groups.push(current);
    }
    current.fields.push(field);
  });

  return groups.filter((group) => group.fields.length > 0);
}

function readVisibility(ids: string[]): Record<string, boolean> {
  let stored: Record<string, boolean> = {};
  try {
    const raw = localStorage.getItem(SECTION_VISIBILITY_KEY);
    if (raw) stored = JSON.parse(raw) as Record<string, boolean>;
  } catch {
    stored = {};
  }
  return Object.fromEntries(ids.map((id, index) => [id, typeof stored[id] === 'boolean' ? stored[id] : index === 0]));
}

export function DynamicForm<T extends Record<string, unknown>>({
  fields,
  defaultValues,
  onSubmit,
  twoColumnLayout = false,
  sectioned = false,
  siteVisibility,
  submitLabel = 'Submit',
  isSubmitting = false,
  formId,
  onReady,
}: DynamicFormProps<T>) {
  const visibleFields = useMemo(
    () => fields.filter((field) => !field.hidden),
    [fields]
  );

  const schema = useMemo(() => generateSchema(fields), [fields]);

  const methods = useForm<T>({
    defaultValues: defaultValues as DefaultValues<T>,
    resolver: zodResolver(schema) as Resolver<T>,
    shouldUnregister: false,
  });

  const { watch, handleSubmit, getValues, setValue } = methods;
  const watched = watch();

  useEffect(() => {
    onReady?.(() => getValues());
  }, [onReady, getValues]);

  const shouldShowField = (field: DynamicFormFieldConfig): boolean => {
    if (!field.showWhen) return true;
    const { field: watchField, value } = field.showWhen;
    return watched[watchField] === value;
  };

  const fieldsToRender = visibleFields.filter(shouldShowField);
  const sections = useMemo(() => groupSections(fieldsToRender), [fieldsToRender]);
  const sectionKey = sections.map((section) => section.id).join('|');
  const [shown, setShown] = useState<Record<string, boolean>>(() => readVisibility(sectionKey.split('|').filter(Boolean)));

  useEffect(() => {
    const ids = sectionKey.split('|').filter(Boolean);
    setShown((current) => {
      const next = { ...current };
      let changed = false;
      ids.forEach((id, index) => {
        if (typeof next[id] !== 'boolean') {
          next[id] = index === 0;
          changed = true;
        }
      });
      return changed ? next : current;
    });
  }, [sectionKey]);

  useEffect(() => {
    try {
      localStorage.setItem(SECTION_VISIBILITY_KEY, JSON.stringify(shown));
    } catch {
      /* ignore private-mode storage failures */
    }
  }, [shown]);

  const setAll = (visible: boolean) => {
    setShown(Object.fromEntries(sections.map((section) => [section.id, visible])));
  };

  const focusSection = (id: string) => {
    setShown((current) => ({ ...current, [id]: true }));
    window.requestAnimationFrame(() => {
      document.getElementById(`edit-section-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const toggleSection = (id: string) => {
    setShown((current) => ({ ...current, [id]: !current[id] }));
  };

  const openSections = sections.filter((section) => shown[section.id]);
  const siteFlags = siteVisibility
    ? (watched[siteVisibility.name] as Record<string, boolean> | undefined)
    : undefined;

  const setSiteFlag = (key: string, visible: boolean) => {
    if (!siteVisibility) return;
    const current = (getValues(siteVisibility.name as never) as Record<string, boolean> | undefined) ?? {};
    setValue(siteVisibility.name as never, { ...current, [key]: visible } as never, { shouldDirty: true });
  };

  const siteCheckbox = (key: string, label: string) => (
    <label key={key} className="flex shrink-0 items-center gap-1.5 text-xs text-ink-secondary">
      <input
        type="checkbox"
        className="section-check"
        checked={siteFlags?.[key] !== false}
        onChange={(event) => setSiteFlag(key, event.target.checked)}
      />
      {label}
    </label>
  );

  const renderField = (field: DynamicFormFieldConfig) => (
    <div key={field.name} className={isWide(field) ? 'md:col-span-2' : ''}>
      <FieldRenderer field={field} />
    </div>
  );

  return (
    <FormProvider {...methods}>
      <form id={formId} onSubmit={handleSubmit(onSubmit)} noValidate className={sectioned ? 'dashboard-form' : undefined}>
        {sectioned ? (
          <div className="grid items-start gap-4 lg:grid-cols-[17rem_minmax(0,1fr)]">
            <aside className="panel sticky top-[5.5rem] z-10 p-3">
              <div className="mb-3 flex items-center justify-between gap-2">
                <p className="mb-0 text-sm font-medium text-ink">Sections</p>
                <div className="flex gap-2 text-xs">
                  <button type="button" className="text-accent" onClick={() => setAll(true)}>Show all</button>
                  <button type="button" className="text-muted" onClick={() => setAll(false)}>Hide all</button>
                </div>
              </div>
              <div className="nav-scroll -mx-1 flex gap-2 overflow-x-auto px-1 pb-1 lg:mx-0 lg:max-h-[calc(100vh-10rem)] lg:flex-col lg:overflow-y-auto lg:px-0 lg:pb-0">
                {sections.map((section) => {
                  const open = Boolean(shown[section.id]);
                  return (
                    <div
                      key={section.id}
                      className={`flex min-w-[12.5rem] items-center gap-2 rounded-2xl border px-2.5 py-2 lg:min-w-0 ${
                        open ? 'border-accent/70 bg-accent/10' : 'border-line bg-canvas/40'
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="section-check"
                        checked={open}
                        onChange={() => toggleSection(section.id)}
                        aria-label={`${open ? 'Hide' : 'Show'} ${section.label}`}
                      />
                      <button
                        type="button"
                        onClick={() => focusSection(section.id)}
                        className="min-w-0 flex-1 truncate text-left text-sm text-ink"
                      >
                        {section.label}
                      </button>
                      {siteVisibility?.sections[section.id]
                        ? siteCheckbox(siteVisibility.sections[section.id], 'Site')
                        : null}
                    </div>
                  );
                })}
              </div>
            </aside>

            <div className="space-y-4">
              {openSections.length === 0 ? (
                <div className="panel px-5 py-10 text-center">
                  <p className="mb-1 text-base font-medium text-ink">All sections are hidden</p>
                  <p className="mb-0 text-sm text-muted">Turn a section on to edit it. Hidden sections stay saved.</p>
                </div>
              ) : (
                openSections.map((section) => (
                  <section id={`edit-section-${section.id}`} key={section.id} className="panel scroll-mt-28 p-4 sm:p-5">
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <div>
                        <h3 className="mb-1 text-lg font-semibold text-ink">{section.label}</h3>
                        <p className="mb-0 text-sm text-muted">{section.fields.length} fields</p>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-2">
                        {siteVisibility?.sections[section.id]
                          ? siteCheckbox(siteVisibility.sections[section.id], 'Show on site')
                          : null}
                        {siteVisibility?.extras?.[section.id]?.map((extra) => siteCheckbox(extra.key, extra.label))}
                      </div>
                    </div>
                    <div className="signal-line mb-4" />
                    <div className="grid gap-4 md:grid-cols-2">
                      {section.fields.map(renderField)}
                    </div>
                  </section>
                ))
              )}
              <div>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving…' : submitLabel}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className={twoColumnLayout ? 'row g-3' : ''}>
              {fieldsToRender.map((field) => (
                <div
                  key={field.name}
                  className={
                    twoColumnLayout
                      ? isWide(field)
                        ? 'col-12'
                        : 'col-md-6'
                      : 'mb-3'
                  }
                >
                  <FieldRenderer field={field} />
                </div>
              ))}
            </div>
            <div className="mt-3">
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? 'Saving…' : submitLabel}
              </button>
            </div>
          </>
        )}
      </form>
    </FormProvider>
  );
}
