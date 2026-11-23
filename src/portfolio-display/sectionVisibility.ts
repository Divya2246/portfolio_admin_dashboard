export const PORTFOLIO_SECTION_KEYS = [
  'hero',
  'about',
  'skills',
  'experience',
  'freelance',
  'featured',
  'projects',
  'services',
  'process',
  'achievements',
  'testimonials',
  'education',
  'resume',
  'faq',
  'contact',
  'media',
] as const;

export type PortfolioSectionKey = (typeof PORTFOLIO_SECTION_KEYS)[number];

/** Missing or true means the public site shows the section. Only false hides it. */
export type PortfolioSectionVisibility = Partial<Record<PortfolioSectionKey, boolean>>;

export const FORM_SECTION_SITE_KEY: Record<string, PortfolioSectionKey> = {
  _section_hero: 'hero',
  _section_about: 'about',
  _section_skills: 'skills',
  _section_experience: 'experience',
  _section_freelance: 'freelance',
  _section_featured: 'featured',
  _section_projects: 'projects',
  _section_services: 'services',
  _section_process: 'process',
  _section_achievements: 'achievements',
  _section_testimonials: 'testimonials',
  _section_education: 'education',
  _section_faq: 'faq',
  _section_contact: 'contact',
  _section_media: 'media',
};

export const EXTRA_SITE_TOGGLES: Record<string, { key: PortfolioSectionKey; label: string }[]> = {
  _section_hero: [{ key: 'resume', label: 'Show resume on site' }],
};

export function defaultSectionVisibility(): Record<PortfolioSectionKey, boolean> {
  return Object.fromEntries(PORTFOLIO_SECTION_KEYS.map((key) => [key, true])) as Record<PortfolioSectionKey, boolean>;
}

export function normalizeSectionVisibility(value: unknown): Record<PortfolioSectionKey, boolean> {
  const visibility = defaultSectionVisibility();
  if (!value || typeof value !== 'object' || Array.isArray(value)) return visibility;
  const source = value as Record<string, unknown>;
  PORTFOLIO_SECTION_KEYS.forEach((key) => {
    if (!(key in source)) return;
    const flag = source[key];
    if (typeof flag === 'boolean') visibility[key] = flag;
    else if (typeof flag === 'number') visibility[key] = flag === 1;
    else if (typeof flag === 'string') {
      const text = flag.trim().toLowerCase();
      if (text) visibility[key] = text === 'true' || text === 'yes' || text === '1';
    }
  });
  return visibility;
}

export function isSectionVisible(visibility: PortfolioSectionVisibility | undefined, key: PortfolioSectionKey): boolean {
  return visibility?.[key] !== false;
}
