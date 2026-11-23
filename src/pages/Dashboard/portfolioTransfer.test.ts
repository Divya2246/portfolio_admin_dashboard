import * as XLSX from 'xlsx';
import type { PortfolioData } from '../../redux/slices/portfolioSlice';
import { parsePortfolioJson, portfolioToWorkbook, preparePortfolioForSave, toPortfolioData, workbookToPortfolio } from './portfolioTransfer';

const sample: PortfolioData = {
  fullName: 'Ankit Patil',
  title: 'React Frontend Developer',
  email: 'ankit@example.com',
  phone: '+91-9922328647',
  positioningLine: 'Building scalable React applications.',
  professionalSummary: 'Line one.\nLine two.',
  showWIPBanner: false,
  avatarUrl: 'https://cdn.example.com/a.jpg',
  avatarUrls: ['https://cdn.example.com/a.jpg', 'https://cdn.example.com/b.jpg'],
  skills: [{ name: 'React', percentage: 0 }, { name: 'TypeScript', percentage: 80 }],
  skillCategories: [{ category: 'Frontend', skills: ['React', 'Next.js'] }],
  experience: [{
    role: 'Frontend Engineer',
    company: 'Northwind',
    points: 'Shipped the design system.',
    impact: 'Faster UI',
    projects: [{ name: 'Checkout', summary: 'Rebuilt checkout.', contribution: 'Owned the React UI.', techStack: 'React', impact: '40% faster', url: 'https://northwind.example' }],
  }],
  projects: [{ name: 'Portfolio', url: 'https://example.com', isNotWorking: false, screenshotUrl: 'https://cdn.example.com/shot.png' }],
  freelanceProjects: [{ clientName: 'Acme', problem: 'Slow checkout', isNda: true, isNotWorking: false }],
  featuredProjects: [{ name: 'UI Kit', githubLink: 'https://github.com/example/ui', isNotWorking: true }],
  achievements: ['Spoke at a meetup'],
  services: ['Custom React apps'],
  servicesDetailed: [{ title: 'Frontend builds', description: 'Product UI', whoItIsFor: 'Startups' }],
  processSteps: ['Discover', 'Build'],
  testimonials: [{ clientName: 'Priya', feedback: 'Clear and fast.', projectType: 'SaaS' }],
  education: [{ degree: 'B.E.', institution: 'University' }],
  faqItems: [{ question: 'Do you take freelance work?', answer: 'Yes.' }],
  mediaItems: [{ title: 'Resume', url: 'https://cdn.example.com/resume.pdf', fileType: 'pdf', fileName: 'resume.pdf' }],
  contactCta: 'Available for freelance projects.',
};

describe('portfolio transfer', () => {
  const saved = preparePortfolioForSave(toPortfolioData(sample));

  it('round-trips portfolio JSON', () => {
    expect(parsePortfolioJson(JSON.stringify(saved))).toEqual(saved);
  });

  it('round-trips an Excel workbook, including empty sections', () => {
    const workbook = portfolioToWorkbook(saved);
    const encoded = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });
    const readBack = workbookToPortfolio(XLSX.read(encoded, { type: 'array' }));
    expect(readBack).toEqual(saved);
  });

  it('saves a hidden section as false and keeps every section visible when the field is missing', () => {
    const hidden = parsePortfolioJson(JSON.stringify({ ...saved, sectionVisibility: { projects: false } }));
    expect(hidden.sectionVisibility?.projects).toBe(false);
    expect(hidden.sectionVisibility?.hero).toBe(true);
    expect(hidden.sectionVisibility?.contact).toBe(true);

    const legacy = parsePortfolioJson(JSON.stringify({ fullName: 'Ankit Patil', email: 'ankit@example.com' }));
    expect(legacy.sectionVisibility?.projects).toBe(true);

    const workbook = portfolioToWorkbook(hidden);
    const encoded = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });
    expect(workbookToPortfolio(XLSX.read(encoded, { type: 'array' })).sectionVisibility?.projects).toBe(false);
  });

  it('rejects a file that is not portfolio data', () => {
    expect(() => parsePortfolioJson('{"hello":"world"}')).toThrow(/does not look like portfolio data/);
    expect(() => parsePortfolioJson('{')).toThrow(/not valid JSON/);
    expect(() => workbookToPortfolio(XLSX.utils.book_new())).toThrow(/Profile sheet/);
  });
});
