import * as XLSX from 'xlsx';
import { normalizeSectionVisibility, PORTFOLIO_SECTION_KEYS } from '../../portfolio-display/sectionVisibility';
import type {
  PortfolioData,
  PortfolioEducationItem,
  PortfolioExperienceItem,
  PortfolioExperienceProject,
  PortfolioFaqItem,
  PortfolioFeaturedProjectItem,
  PortfolioFreelanceProjectItem,
  PortfolioMediaFileType,
  PortfolioMediaItem,
  PortfolioProjectItem,
  PortfolioServiceItem,
  PortfolioSkillCategory,
  PortfolioSkillItem,
  PortfolioTestimonialItem,
} from '../../redux/slices/portfolioSlice';

const PROFILE_FIELDS = [
  'fullName',
  'title',
  'email',
  'phone',
  'whatsapp',
  'location',
  'avatarUrl',
  'resumePdfUrl',
  'linkedin',
  'github',
  'portfolioUrl',
  'positioningLine',
  'heroCtaText',
  'heroCtaLink',
  'projectsCompletedCount',
  'clientsServedCount',
  'professionalSummary',
  'yearsOfExperience',
  'fullTimeFreelanceMention',
  'specialization',
  'clientTypes',
  'contactCta',
  'calendarBookingUrl',
  'showWIPBanner',
] as const;

const EXPERIENCE_COLUMNS = [
  'role',
  'company',
  'location',
  'period',
  'points',
  'techStack',
  'systemsBuilt',
  'performanceImprovements',
  'reusableComponents',
  'impact',
] as const;

const EXPERIENCE_PROJECT_COLUMNS = ['company', 'role', 'name', 'summary', 'contribution', 'techStack', 'impact', 'url'] as const;

const PROJECT_COLUMNS = ['name', 'tech', 'url', 'highlights', 'screenshotUrl', 'resultHighlight', 'isNotWorking'] as const;
const FREELANCE_COLUMNS = [
  'clientName',
  'clientType',
  'problem',
  'solution',
  'techStack',
  'timeline',
  'keyFeatures',
  'results',
  'resultHighlight',
  'screenshotUrl',
  'liveLink',
  'isNda',
  'isNotWorking',
] as const;
const FEATURED_COLUMNS = [
  'name',
  'problem',
  'solution',
  'architectureThinking',
  'keyFeatures',
  'resultHighlight',
  'screenshotUrl',
  'githubLink',
  'liveLink',
  'isNotWorking',
] as const;
const EDUCATION_COLUMNS = ['degree', 'institution', 'location', 'period', 'grade'] as const;
const SERVICE_COLUMNS = ['title', 'description', 'problemItSolves', 'whoItIsFor'] as const;
const FAQ_COLUMNS = ['question', 'answer'] as const;
const TESTIMONIAL_COLUMNS = ['clientName', 'feedback', 'projectType'] as const;
const MEDIA_COLUMNS = ['title', 'url', 'fileType', 'fileName'] as const;

function asString(value: unknown): string {
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return '';
}

function asBool(value: unknown): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value === 1;
  const text = asString(value).toLowerCase();
  return text === 'true' || text === 'yes' || text === '1';
}

function asPercentage(value: unknown): number | undefined {
  if (value == null || value === '') return undefined;
  const number = typeof value === 'number' ? value : Number(asString(value));
  return Number.isFinite(number) ? number : undefined;
}

function splitList(value: unknown): string[] {
  if (Array.isArray(value)) return value.map((item) => asString(item)).filter(Boolean);
  const raw = asString(value);
  if (!raw) return [];
  const parts = raw.includes('|') || raw.includes('\n') ? raw.split(/\||\n/) : raw.split(',');
  return parts.map((part) => part.trim()).filter(Boolean);
}

function joinList(values: string[] | undefined): string {
  return (values ?? []).map((value) => value.trim()).filter(Boolean).join(' | ');
}

function hasContent(values: unknown[]): boolean {
  return values.some((value) => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'number') return Number.isFinite(value);
    return asString(value) !== '';
  });
}

function asItems<T>(
  value: unknown,
  label: string,
  map: (row: Record<string, unknown>, index: number) => T | null
): T[] {
  if (value == null || value === '') return [];
  if (!Array.isArray(value)) throw new Error(`${label} should be a list.`);
  const items: T[] = [];
  value.forEach((item, index) => {
    if (item == null || item === '') return;
    if (typeof item !== 'object' || Array.isArray(item)) {
      throw new Error(`${label} item ${index + 1} should be an object.`);
    }
    const mapped = map(item as Record<string, unknown>, index);
    if (mapped) items.push(mapped);
  });
  return items;
}

function asStringList(value: unknown, label: string): string[] {
  if (value == null || value === '') return [];
  if (typeof value === 'string') return splitList(value);
  if (!Array.isArray(value)) throw new Error(`${label} should be a list.`);
  return value.map((item, index) => {
    if (typeof item === 'string' || typeof item === 'number') return asString(item);
    if (item && typeof item === 'object' && 'text' in item) return asString((item as { text: unknown }).text);
    throw new Error(`${label} item ${index + 1} should be text.`);
  }).filter(Boolean);
}

function asSkills(value: unknown): PortfolioSkillItem[] {
  if (value == null || value === '') return [];
  if (!Array.isArray(value)) throw new Error('skills should be a list.');
  const skills: PortfolioSkillItem[] = [];
  value.forEach((item, index) => {
    if (typeof item === 'string') {
      const name = item.trim();
      if (name) skills.push({ name });
      return;
    }
    if (!item || typeof item !== 'object' || Array.isArray(item)) {
      throw new Error(`skills item ${index + 1} should include a name.`);
    }
    const row = item as Record<string, unknown>;
    const name = asString(row.name);
    if (!name) return;
    const percentage = asPercentage(row.percentage);
    skills.push(percentage === undefined ? { name } : { name, percentage });
  });
  return skills;
}

function asFileType(value: unknown, index: number): PortfolioMediaFileType | undefined {
  const type = asString(value).toLowerCase();
  if (!type) return undefined;
  if (type === 'image' || type === 'pdf' || type === 'video') return type;
  throw new Error(`mediaItems item ${index + 1} fileType must be image, pdf, or video.`);
}

function unwrapPortfolio(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('The JSON file must contain a portfolio object.');
  }
  const record = value as Record<string, unknown>;
  if ('fullName' in record || 'email' in record || 'experience' in record || 'projects' in record) return record;
  const wrapped = record.data ?? record.portfolio;
  if (wrapped && typeof wrapped === 'object' && !Array.isArray(wrapped)) return wrapped as Record<string, unknown>;
  throw new Error('This JSON does not look like portfolio data. Export JSON from the dashboard and edit that file.');
}

/** Turn form values or a parsed file into the portfolio shape saved in Firebase. */
export function toPortfolioData(input: unknown): PortfolioData {
  const source = unwrapPortfolio(input);
  const avatarUrls = splitList(source.avatarUrls);
  const avatarUrl = asString(source.avatarUrl);
  const data: PortfolioData = {
    fullName: asString(source.fullName),
    title: asString(source.title),
    email: asString(source.email),
    phone: asString(source.phone),
    whatsapp: asString(source.whatsapp),
    location: asString(source.location),
    avatarUrl: avatarUrls[0] || avatarUrl,
    avatarUrls: avatarUrls.length > 0 ? avatarUrls : avatarUrl ? [avatarUrl] : [],
    resumePdfUrl: asString(source.resumePdfUrl),
    linkedin: asString(source.linkedin),
    github: asString(source.github),
    portfolioUrl: asString(source.portfolioUrl),
    positioningLine: asString(source.positioningLine),
    heroCtaText: asString(source.heroCtaText),
    heroCtaLink: asString(source.heroCtaLink),
    projectsCompletedCount: asString(source.projectsCompletedCount),
    clientsServedCount: asString(source.clientsServedCount),
    professionalSummary: asString(source.professionalSummary),
    yearsOfExperience: asString(source.yearsOfExperience),
    fullTimeFreelanceMention: asString(source.fullTimeFreelanceMention),
    specialization: asString(source.specialization),
    clientTypes: asString(source.clientTypes),
    skills: asSkills(source.skills),
    skillCategories: asItems<PortfolioSkillCategory>(source.skillCategories, 'skillCategories', (row) => {
      const category = asString(row.category);
      const skills = splitList(row.skills);
      if (!category && skills.length === 0) return null;
      return { category, skills };
    }),
    experience: asItems<PortfolioExperienceItem>(source.experience, 'experience', (row) => {
      const item: PortfolioExperienceItem = {
        role: asString(row.role),
        company: asString(row.company),
        location: asString(row.location),
        period: asString(row.period),
        points: asString(row.points),
        techStack: asString(row.techStack),
        systemsBuilt: asString(row.systemsBuilt),
        performanceImprovements: asString(row.performanceImprovements),
        reusableComponents: asString(row.reusableComponents),
        impact: asString(row.impact),
      };
      const projects = asItems<PortfolioExperienceProject>(row.projects, 'experience projects', (project) => {
        const entry: PortfolioExperienceProject = {
          name: asString(project.name),
          summary: asString(project.summary),
          contribution: asString(project.contribution),
          techStack: asString(project.techStack),
          impact: asString(project.impact),
          url: asString(project.url),
        };
        return hasContent(Object.values(entry)) ? entry : null;
      });
      if (projects.length > 0) item.projects = projects;
      const roleContent = hasContent(Object.values(item).filter((value) => !Array.isArray(value)));
      return roleContent || projects.length > 0 ? item : null;
    }),
    projects: asItems<PortfolioProjectItem>(source.projects, 'projects', (row) => {
      const item: PortfolioProjectItem = {
        name: asString(row.name),
        tech: asString(row.tech),
        url: asString(row.url),
        highlights: asString(row.highlights),
        screenshotUrl: asString(row.screenshotUrl),
        resultHighlight: asString(row.resultHighlight),
        isNotWorking: asBool(row.isNotWorking),
      };
      return hasContent([item.name, item.tech, item.url, item.highlights, item.screenshotUrl, item.resultHighlight, item.isNotWorking])
        ? item
        : null;
    }),
    freelanceProjects: asItems<PortfolioFreelanceProjectItem>(source.freelanceProjects, 'freelanceProjects', (row) => {
      const item: PortfolioFreelanceProjectItem = {
        clientName: asString(row.clientName),
        clientType: asString(row.clientType),
        problem: asString(row.problem),
        solution: asString(row.solution),
        techStack: asString(row.techStack),
        timeline: asString(row.timeline),
        keyFeatures: asString(row.keyFeatures),
        results: asString(row.results),
        resultHighlight: asString(row.resultHighlight),
        screenshotUrl: asString(row.screenshotUrl),
        liveLink: asString(row.liveLink),
        isNda: asBool(row.isNda),
        isNotWorking: asBool(row.isNotWorking),
      };
      return hasContent(Object.values(item)) ? item : null;
    }),
    featuredProjects: asItems<PortfolioFeaturedProjectItem>(source.featuredProjects, 'featuredProjects', (row) => {
      const item: PortfolioFeaturedProjectItem = {
        name: asString(row.name),
        problem: asString(row.problem),
        solution: asString(row.solution),
        architectureThinking: asString(row.architectureThinking),
        keyFeatures: asString(row.keyFeatures),
        resultHighlight: asString(row.resultHighlight),
        screenshotUrl: asString(row.screenshotUrl),
        githubLink: asString(row.githubLink),
        liveLink: asString(row.liveLink),
        isNotWorking: asBool(row.isNotWorking),
      };
      return hasContent(Object.values(item)) ? item : null;
    }),
    achievements: asStringList(source.achievements, 'achievements'),
    education: asItems<PortfolioEducationItem>(source.education, 'education', (row) => {
      const item: PortfolioEducationItem = {
        degree: asString(row.degree),
        institution: asString(row.institution),
        location: asString(row.location),
        period: asString(row.period),
        grade: asString(row.grade),
      };
      return hasContent(Object.values(item)) ? item : null;
    }),
    services: asStringList(source.services, 'services'),
    servicesDetailed: asItems<PortfolioServiceItem>(source.servicesDetailed, 'servicesDetailed', (row) => {
      const item: PortfolioServiceItem = {
        title: asString(row.title),
        description: asString(row.description),
        problemItSolves: asString(row.problemItSolves),
        whoItIsFor: asString(row.whoItIsFor),
      };
      return hasContent(Object.values(item)) ? item : null;
    }),
    faqItems: asItems<PortfolioFaqItem>(source.faqItems, 'faqItems', (row) => {
      const item: PortfolioFaqItem = {
        question: asString(row.question),
        answer: asString(row.answer),
      };
      return hasContent([item.question, item.answer]) ? item : null;
    }),
    processSteps: asStringList(source.processSteps, 'processSteps'),
    testimonials: asItems<PortfolioTestimonialItem>(source.testimonials, 'testimonials', (row) => {
      const item: PortfolioTestimonialItem = {
        clientName: asString(row.clientName),
        feedback: asString(row.feedback),
        projectType: asString(row.projectType),
      };
      return hasContent([item.clientName, item.feedback, item.projectType]) ? item : null;
    }),
    mediaItems: asItems<PortfolioMediaItem>(source.mediaItems, 'mediaItems', (row, index) => {
      const item: PortfolioMediaItem = {
        title: asString(row.title),
        url: asString(row.url),
        fileType: asFileType(row.fileType, index),
        fileName: asString(row.fileName),
      };
      return item.url ? item : null;
    }),
    showWIPBanner: asBool(source.showWIPBanner),
    sectionVisibility: normalizeSectionVisibility(source.sectionVisibility),
    contactCta: asString(source.contactCta),
    calendarBookingUrl: asString(source.calendarBookingUrl),
  };
  return data;
}

export function preparePortfolioForSave(data: PortfolioData): PortfolioData {
  const avatarUrls = (data.avatarUrls ?? []).map((url) => url.trim()).filter(Boolean);
  return {
    ...data,
    avatarUrls,
    avatarUrl: avatarUrls[0] ?? '',
    mediaItems: (data.mediaItems ?? []).filter((item) => item.url.trim()),
  };
}

function assertIdentity(data: PortfolioData): PortfolioData {
  if (!data.fullName && !data.email) {
    throw new Error('Add a full name or email in the file before importing.');
  }
  return data;
}

export function parsePortfolioJson(text: string): PortfolioData {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error('That file is not valid JSON.');
  }
  return assertIdentity(preparePortfolioForSave(toPortfolioData(parsed)));
}

function writeTable(workbook: XLSX.WorkBook, name: string, columns: readonly string[], rows: Record<string, string | number | boolean>[]) {
  const sheet = XLSX.utils.json_to_sheet(rows, { header: [...columns] });
  sheet['!cols'] = columns.map((column) => ({ wch: Math.min(48, Math.max(column.length + 2, 16)) }));
  XLSX.utils.book_append_sheet(workbook, sheet, name);
}

function boolCell(value: boolean | undefined): boolean {
  return value === true;
}

export function portfolioToWorkbook(data: PortfolioData): XLSX.WorkBook {
  const workbook = XLSX.utils.book_new();
  const profile = PROFILE_FIELDS.map((field) => ({
    field,
    value: field === 'showWIPBanner' ? boolCell(data.showWIPBanner) : asString(data[field]),
  }));
  writeTable(workbook, 'Profile', ['field', 'value'], profile);
  writeTable(
    workbook,
    'AvatarUrls',
    ['url'],
    (data.avatarUrls ?? []).map((url) => ({ url }))
  );
  writeTable(
    workbook,
    'Skills',
    ['name', 'percentage'],
    (data.skills ?? []).map((skill) => ({ name: skill.name, percentage: skill.percentage ?? '' }))
  );
  writeTable(
    workbook,
    'SkillCategories',
    ['category', 'skills'],
    (data.skillCategories ?? []).map((category) => ({ category: category.category, skills: joinList(category.skills) }))
  );
  writeTable(workbook, 'Experience', EXPERIENCE_COLUMNS, (data.experience ?? []).map((item) => rowFrom(item, EXPERIENCE_COLUMNS)));
  writeTable(
    workbook,
    'ExperienceProjects',
    EXPERIENCE_PROJECT_COLUMNS,
    (data.experience ?? []).flatMap((item) =>
      (item.projects ?? []).map((project) => ({
        company: item.company ?? '',
        role: item.role ?? '',
        name: project.name,
        summary: project.summary ?? '',
        contribution: project.contribution ?? '',
        techStack: project.techStack ?? '',
        impact: project.impact ?? '',
        url: project.url ?? '',
      }))
    )
  );
  writeTable(workbook, 'FreelanceProjects', FREELANCE_COLUMNS, (data.freelanceProjects ?? []).map((item) => rowFrom(item, FREELANCE_COLUMNS)));
  writeTable(workbook, 'FeaturedProjects', FEATURED_COLUMNS, (data.featuredProjects ?? []).map((item) => rowFrom(item, FEATURED_COLUMNS)));
  writeTable(workbook, 'Projects', PROJECT_COLUMNS, (data.projects ?? []).map((item) => rowFrom(item, PROJECT_COLUMNS)));
  writeTable(workbook, 'ServicesDetailed', SERVICE_COLUMNS, (data.servicesDetailed ?? []).map((item) => rowFrom(item, SERVICE_COLUMNS)));
  writeTable(workbook, 'Services', ['text'], (data.services ?? []).map((text) => ({ text })));
  writeTable(workbook, 'ProcessSteps', ['text'], (data.processSteps ?? []).map((text) => ({ text })));
  writeTable(workbook, 'Achievements', ['text'], (data.achievements ?? []).map((text) => ({ text })));
  writeTable(workbook, 'Testimonials', TESTIMONIAL_COLUMNS, (data.testimonials ?? []).map((item) => rowFrom(item, TESTIMONIAL_COLUMNS)));
  writeTable(workbook, 'Education', EDUCATION_COLUMNS, (data.education ?? []).map((item) => rowFrom(item, EDUCATION_COLUMNS)));
  writeTable(workbook, 'Faq', FAQ_COLUMNS, (data.faqItems ?? []).map((item) => rowFrom(item, FAQ_COLUMNS)));
  writeTable(workbook, 'Media', MEDIA_COLUMNS, (data.mediaItems ?? []).map((item) => rowFrom(item, MEDIA_COLUMNS)));
  const visibility = normalizeSectionVisibility(data.sectionVisibility);
  writeTable(
    workbook,
    'SectionVisibility',
    ['section', 'visible'],
    PORTFOLIO_SECTION_KEYS.map((section) => ({ section, visible: visibility[section] }))
  );
  const instructions = XLSX.utils.aoa_to_sheet([
    ['Edit this workbook, then use Import on the dashboard. Import replaces the whole portfolio.'],
    ['Do not rename the sheet tabs. A missing content sheet clears that section. SectionVisibility is the exception.'],
    ['In SkillCategories, separate skills in one cell with |'],
    ['Organization projects go on ExperienceProjects. Match company and role to a row on the Experience sheet.'],
    ['Yes/no cells (showWIPBanner, isNda, isNotWorking, and the SectionVisibility sheet) use true or false.'],
    ['SectionVisibility controls the public site. false hides that section. A missing sheet leaves every section visible.'],
    ['Pictures and files are URLs. The file does not contain the image itself.'],
  ]);
  instructions['!cols'] = [{ wch: 110 }];
  XLSX.utils.book_append_sheet(workbook, instructions, 'Read me');
  return workbook;
}

function rowFrom<T extends string>(item: object, columns: readonly T[]): Record<T, string | number | boolean> {
  const source = item as Record<string, unknown>;
  const row = {} as Record<T, string | number | boolean>;
  columns.forEach((column) => {
    const value = source[column];
    if (typeof value === 'boolean') row[column] = value;
    else if (typeof value === 'number') row[column] = value;
    else row[column] = asString(value);
  });
  return row;
}

function findSheet(workbook: XLSX.WorkBook, name: string): XLSX.WorkSheet | undefined {
  const found = workbook.SheetNames.find((sheetName) => sheetName.trim().toLowerCase() === name.toLowerCase());
  return found ? workbook.Sheets[found] : undefined;
}

function attachExperienceProjects(experienceRows: Record<string, unknown>[], projectRows: Record<string, unknown>[]) {
  const grouped = new Map<string, Record<string, unknown>[]>();
  projectRows.forEach((row) => {
    const key = `${asString(row.company).toLowerCase()}|${asString(row.role).toLowerCase()}`;
    const list = grouped.get(key) ?? [];
    list.push(row);
    grouped.set(key, list);
  });
  return experienceRows.map((row) => {
    const key = `${asString(row.company).toLowerCase()}|${asString(row.role).toLowerCase()}`;
    const projects = grouped.get(key);
    return projects ? { ...row, projects } : row;
  });
}

function readRows(workbook: XLSX.WorkBook, name: string): Record<string, unknown>[] {
  const sheet = findSheet(workbook, name);
  if (!sheet) return [];
  return XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '' });
}

export function workbookToPortfolio(workbook: XLSX.WorkBook): PortfolioData {
  if (!findSheet(workbook, 'Profile')) {
    throw new Error('The Excel file needs a Profile sheet. Export Excel from the dashboard and edit that file.');
  }
  const profile: Record<string, unknown> = {};
  readRows(workbook, 'Profile').forEach((row) => {
    const field = asString(row.field);
    if (field) profile[field] = row.value;
  });
  const avatarUrls = readRows(workbook, 'AvatarUrls').map((row) => asString(row.url)).filter(Boolean);
  const data = toPortfolioData({
    ...profile,
    avatarUrls: avatarUrls.length > 0 ? avatarUrls : profile.avatarUrl,
    skills: readRows(workbook, 'Skills'),
    skillCategories: readRows(workbook, 'SkillCategories'),
    experience: attachExperienceProjects(readRows(workbook, 'Experience'), readRows(workbook, 'ExperienceProjects')),
    freelanceProjects: readRows(workbook, 'FreelanceProjects'),
    featuredProjects: readRows(workbook, 'FeaturedProjects'),
    projects: readRows(workbook, 'Projects'),
    servicesDetailed: readRows(workbook, 'ServicesDetailed'),
    services: readRows(workbook, 'Services').map((row) => asString(row.text)),
    processSteps: readRows(workbook, 'ProcessSteps').map((row) => asString(row.text)),
    achievements: readRows(workbook, 'Achievements').map((row) => asString(row.text)),
    testimonials: readRows(workbook, 'Testimonials'),
    education: readRows(workbook, 'Education'),
    faqItems: readRows(workbook, 'Faq'),
    mediaItems: readRows(workbook, 'Media'),
    sectionVisibility: findSheet(workbook, 'SectionVisibility')
      ? Object.fromEntries(
          readRows(workbook, 'SectionVisibility')
            .map((row) => [asString(row.section), row.visible] as const)
            .filter(([section]) => section)
        )
      : undefined,
  });
  return assertIdentity(preparePortfolioForSave(data));
}

function datedName(extension: string): string {
  const now = new Date();
  const pad = (value: number) => String(value).padStart(2, '0');
  return `portfolio-${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}.${extension}`;
}

function downloadBlob(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function downloadPortfolioJson(data: unknown) {
  const portfolio = preparePortfolioForSave(toPortfolioData(data));
  downloadBlob(datedName('json'), new Blob([`${JSON.stringify(portfolio, null, 2)}\n`], { type: 'application/json' }));
}

export function downloadPortfolioExcel(data: unknown) {
  const portfolio = preparePortfolioForSave(toPortfolioData(data));
  XLSX.writeFile(portfolioToWorkbook(portfolio), datedName('xlsx'));
}

export async function readPortfolioFile(file: File): Promise<PortfolioData> {
  const name = file.name.toLowerCase();
  if (name.endsWith('.json') || file.type.includes('json')) {
    return parsePortfolioJson(await file.text());
  }
  if (name.endsWith('.xlsx') || name.endsWith('.xls') || name.endsWith('.xlsm')) {
    return workbookToPortfolio(XLSX.read(await file.arrayBuffer(), { type: 'array' }));
  }
  throw new Error('Import a .json or .xlsx file.');
}
