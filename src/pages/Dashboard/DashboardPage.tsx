import { useCallback, useRef, useState } from 'react';
import { useAuth } from '../../hooks';
import { useAppDispatch, useAppSelector } from '../../redux';
import { savePortfolio, type PortfolioData, type PortfolioMediaItem, type PortfolioSkillItem } from '../../redux/slices/portfolioSlice';
import { DashboardHeader } from './DashboardHeader';
import { DynamicForm } from '../../common/components';
import { portfolioFormFields, portfolioDefaultValues } from './portfolioFields';
import { downloadPortfolioExcel, downloadPortfolioJson, preparePortfolioForSave, readPortfolioFile, toPortfolioData } from './portfolioTransfer';
import { defaultSectionVisibility, EXTRA_SITE_TOGGLES, FORM_SECTION_SITE_KEY } from '../../portfolio-display/sectionVisibility';

const PORTFOLIO_FORM_ID = 'portfolio-edit-form';

function normalizeAvatarUrls(data: PortfolioData): string[] {
  const list = Array.isArray(data.avatarUrls)
    ? data.avatarUrls.map((url) => String(url).trim()).filter(Boolean)
    : [];
  if (list.length > 0) return list;
  const single = data.avatarUrl?.trim();
  return single ? [single] : [];
}

function MediaItemDisplay({ item }: { item: PortfolioMediaItem }) {
  const { title, url, fileType } = item;
  if (!url) return null;
  const type = fileType ?? (url.match(/\.(pdf)$/i) ? 'pdf' : url.match(/\.(webm|mp4|ogg|mov)$/i) ? 'video' : 'image');
  return (
    <div className="rounded-2xl border border-line bg-elevated p-3">
      <p className="mb-2 font-semibold text-ink">{title || 'Untitled'}</p>
      {type === 'image' && <img src={url} alt={title} className="max-h-52 w-full rounded-xl border border-line object-cover" />}
      {type === 'pdf' && <a href={url} target="_blank" rel="noopener noreferrer" className="text-link">Open PDF</a>}
      {type === 'video' && <video src={url} controls className="max-h-60 w-full rounded-xl border border-line" />}
    </div>
  );
}

export function DashboardPage() {
  const dispatch = useAppDispatch();
  const portfolio = useAppSelector((s) => s.portfolio.data);
  const loading = useAppSelector((s) => s.portfolio.loading);
  const error = useAppSelector((s) => s.portfolio.error);
  const { user } = useAuth();
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [transferError, setTransferError] = useState<string | null>(null);
  const [formVersion, setFormVersion] = useState(0);
  const getValuesRef = useRef<(() => PortfolioData) | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const displayEmailOrPhone = user?.email ?? user?.phoneNumber ?? '—';
  const base = portfolio ?? portfolioDefaultValues;
  const achievementsRaw = base.achievements as string[] | string | undefined;
  const achievementsNormalized: string[] = Array.isArray(achievementsRaw)
    ? achievementsRaw
    : typeof achievementsRaw === 'string'
      ? achievementsRaw.split('\n').map((s) => s.trim()).filter(Boolean)
      : [];

  const skillsRaw = base.skills;
  const skillsNormalized: PortfolioSkillItem[] = Array.isArray(skillsRaw)
    ? (skillsRaw.length > 0 && typeof skillsRaw[0] === 'object' && skillsRaw[0] !== null && 'name' in skillsRaw[0])
      ? (skillsRaw as PortfolioSkillItem[])
      : (skillsRaw as unknown as string[]).map((name) => ({ name: String(name), percentage: undefined }))
    : [];

  const defaultValues: PortfolioData = {
    ...base,
    skills: skillsNormalized,
    skillCategories: Array.isArray(base.skillCategories) ? base.skillCategories : [],
    experience: base.experience ?? [],
    projects: base.projects ?? [],
    freelanceProjects: base.freelanceProjects ?? [],
    featuredProjects: base.featuredProjects ?? [],
    achievements: achievementsNormalized,
    heroCtaText: base.heroCtaText ?? '',
    heroCtaLink: base.heroCtaLink ?? '',
    projectsCompletedCount: base.projectsCompletedCount ?? '',
    clientsServedCount: base.clientsServedCount ?? '',
    calendarBookingUrl: base.calendarBookingUrl ?? '',
    services: Array.isArray(base.services) ? base.services : [],
    servicesDetailed: Array.isArray(base.servicesDetailed) ? base.servicesDetailed : [],
    faqItems: Array.isArray(base.faqItems) ? base.faqItems : [],
    processSteps: Array.isArray(base.processSteps) ? base.processSteps : [],
    testimonials: base.testimonials ?? [],
    education: base.education ?? [],
    mediaItems: base.mediaItems ?? [],
    avatarUrls: normalizeAvatarUrls(base),
    sectionVisibility: {
      ...defaultSectionVisibility(),
      ...(base.sectionVisibility ?? {}),
    },
  };

  const handleFormReady = useCallback((getValues: () => PortfolioData & Record<string, unknown>) => {
    getValuesRef.current = () => preparePortfolioForSave(toPortfolioData(getValues()));
  }, []);

  const currentPortfolio = () => getValuesRef.current?.() ?? preparePortfolioForSave(toPortfolioData(defaultValues));

  const handleSubmit = async (data: PortfolioData & Record<string, unknown>) => {
    if (!user?.uid) return;
    setSaveMessage(null);
    setTransferError(null);
    const sectionVisibility = getValuesRef.current?.().sectionVisibility ?? defaultSectionVisibility();
    const result = await dispatch(savePortfolio({
      userId: user.uid,
      data: preparePortfolioForSave({ ...data, sectionVisibility }),
    }));
    if (savePortfolio.fulfilled.match(result)) setSaveMessage('Saved to Firebase.');
    else setSaveMessage(null);
  };

  const handleImportFile = async (file: File) => {
    if (!user?.uid) return;
    setSaveMessage(null);
    setTransferError(null);
    try {
      const data = await readPortfolioFile(file);
      const replace = window.confirm('Replace the saved portfolio with this file? This overwrites the current data in Firebase.');
      if (!replace) return;
      const result = await dispatch(savePortfolio({ userId: user.uid, data }));
      if (savePortfolio.fulfilled.match(result)) {
        setSaveMessage('Imported and saved to Firebase.');
        setFormVersion((version) => version + 1);
      }
    } catch (importError) {
      setTransferError(importError instanceof Error ? importError.message : 'Could not import that file.');
    }
  };

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <DashboardHeader saveFormId={PORTFOLIO_FORM_ID} saving={loading} />
      <main className="shell pb-10 pt-24">
        <section className="stage mb-4">
          <div className="relative flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-1 text-sm text-muted">{displayEmailOrPhone}</p>
              <h1 className="mb-1 text-2xl font-semibold text-ink sm:text-3xl">Portfolio</h1>
              <p className="mb-0 max-w-2xl text-sm text-ink-secondary">
                Show only the sections you want to fill. The Site checkbox is saved and tells the public site to show or hide that section. Export JSON or Excel, edit the file, then import it to replace everything.
                In SkillCategories, separate skills with |. Pictures stay as URLs.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => downloadPortfolioJson(currentPortfolio())} disabled={loading} className="btn btn-secondary">
                Export JSON
              </button>
              <button type="button" onClick={() => downloadPortfolioExcel(currentPortfolio())} disabled={loading} className="btn btn-secondary">
                Export Excel
              </button>
              <button type="button" onClick={() => fileInputRef.current?.click()} disabled={loading} className="btn btn-primary">
                Import
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,.xlsx,.xls,application/json"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  event.target.value = '';
                  if (file) void handleImportFile(file);
                }}
              />
            </div>
          </div>
        </section>
        {transferError && <p className="mb-3 text-sm text-danger">{transferError}</p>}
        {error && <p className="mb-3 text-sm text-danger">{error}</p>}
        {saveMessage && <p className="mb-3 text-sm text-success">{saveMessage}</p>}
        <DynamicForm<PortfolioData & Record<string, unknown>>
          key={`${portfolio ? 'saved' : 'default'}-${formVersion}`}
          fields={portfolioFormFields}
          defaultValues={defaultValues as Partial<PortfolioData & Record<string, unknown>>}
          onSubmit={handleSubmit}
          sectioned
          siteVisibility={{
            name: 'sectionVisibility',
            sections: FORM_SECTION_SITE_KEY,
            extras: EXTRA_SITE_TOGGLES,
          }}
          submitLabel="Save"
          isSubmitting={loading}
          formId={PORTFOLIO_FORM_ID}
          onReady={handleFormReady}
        />
        {defaultValues.mediaItems && defaultValues.mediaItems.length > 0 && (
          <div className="panel mt-4 p-4 sm:p-5">
            <h2 className="mb-3 text-lg font-medium text-ink">Uploaded media</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {defaultValues.mediaItems.filter((item) => item.url).map((item, index) => (
                <MediaItemDisplay key={index} item={item} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
