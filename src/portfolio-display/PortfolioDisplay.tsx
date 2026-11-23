import { useCallback, useState } from 'react';
import { Construction } from 'lucide-react';
import { isSectionVisible, type PortfolioSectionKey } from './sectionVisibility';
import type {
  PortfolioData,
  PortfolioSkillItem,
  PortfolioSkillCategory,
  PortfolioExperienceItem,
  PortfolioProjectItem,
  PortfolioEducationItem,
  PortfolioMediaItem,
  PortfolioFreelanceProjectItem,
  PortfolioFeaturedProjectItem,
  PortfolioTestimonialItem,
} from './types';

function externalLinkProps(href: string): { target?: string; rel?: string } {
  if (/^https?:\/\//i.test(href)) return { target: '_blank', rel: 'noopener noreferrer' };
  return {};
}

function ProjectShot({ src, alt }: { src?: string; alt: string }) {
  if (!src) return null;
  return (
    <img
      src={src}
      alt={alt}
      className="w-full rounded-lg border border-slate-200 object-cover max-h-56 mb-3 bg-slate-50"
    />
  );
}

function ResultPill({ text }: { text?: string }) {
  if (!text) return null;
  return (
    <p className="mt-2 inline-flex items-center rounded-full bg-emerald-50 text-emerald-900 text-sm font-semibold px-3 py-1 border border-emerald-200">
      {text}
    </p>
  );
}

function collectProfilePhotos(data: PortfolioData): string[] {
  const fromList = (data.avatarUrls ?? []).map((url) => url.trim()).filter(Boolean);
  if (fromList.length > 0) return fromList;
  const single = data.avatarUrl?.trim();
  return single ? [single] : [];
}

function ProfilePhotos({ urls, name }: { urls: string[]; name: string }) {
  const [active, setActive] = useState(0);
  const safeIndex = active < urls.length ? active : 0;
  const current = urls[safeIndex];
  if (!current) return null;

  return (
    <div className="shrink-0">
      <img
        src={current}
        alt={name}
        className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-2xl object-cover border-2 border-white shadow-lg ring-2 ring-slate-200/50"
      />
      {urls.length > 1 && (
        <div className="mt-2 flex flex-wrap gap-1.5 max-w-[8.5rem]" role="group" aria-label="Profile photos">
          {urls.map((url, index) => (
            <button
              key={`${url}-${index}`}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Show profile photo ${index + 1}`}
              aria-pressed={index === safeIndex}
              className={`p-0 border-0 bg-transparent rounded-lg leading-none ${index === safeIndex ? 'ring-2 ring-indigo-500' : 'opacity-70 hover:opacity-100'}`}
            >
              <img src={url} alt="" className="w-8 h-8 rounded-lg object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function NotWorkingBadge() {
  return (
    <span className="inline-flex items-center rounded-full bg-amber-100 text-amber-900 text-xs font-semibold px-2 py-0.5 border border-amber-200">
      Currently not working
    </span>
  );
}

function SkillChip({ name, percentage }: PortfolioSkillItem) {
  const pct = percentage != null ? Math.min(100, Math.max(0, percentage)) : null;
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 text-slate-800 text-sm border border-indigo-100 font-medium">
      <span>{name}</span>
      {pct != null && <span className="text-indigo-600 text-xs">{pct}%</span>}
    </span>
  );
}

function MediaBlock({ item }: { item: PortfolioMediaItem }) {
  const { title, url, fileType } = item;
  if (!url) return null;
  const type =
    fileType ??
    (url.match(/\.(pdf)$/i) ? 'pdf' : url.match(/\.(webm|mp4|ogg|mov)$/i) ? 'video' : 'image');
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
      <p className="font-semibold text-slate-800 mb-2">{title || 'Untitled'}</p>
      {type === 'image' && (
        <img
          src={url}
          alt={title}
          className="w-full rounded-md border border-slate-200 object-cover max-h-52"
        />
      )}
      {type === 'pdf' && (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-indigo-600 hover:underline font-medium"
        >
          Open PDF →
        </a>
      )}
      {type === 'video' && (
        <video
          src={url}
          controls
          className="w-full rounded-md border border-slate-200 max-h-60"
        />
      )}
    </div>
  );
}

export interface PortfolioDisplayProps {
  data: PortfolioData;
  /** Optional class for the root container */
  className?: string;
  /** When provided, a contact form is shown and submissions are sent via this callback (e.g. to Firebase) */
  onSubmitContact?: (payload: { name: string; email: string; message: string }) => Promise<void>;
}

export function PortfolioDisplay({ data, className = '', onSubmitContact }: PortfolioDisplayProps) {
  const [copied, setCopied] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);
  const [contactError, setContactError] = useState<string | null>(null);
  const copyEmail = useCallback(() => {
    if (!data.email) return;
    navigator.clipboard.writeText(data.email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [data.email]);

  const handleContactSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!onSubmitContact || contactSubmitting) return;
      const { name, email, message } = contactForm;
      if (!name.trim() || !email.trim() || !message.trim()) {
        setContactError('Please fill in all fields.');
        return;
      }
      setContactError(null);
      setContactSubmitting(true);
      try {
        await onSubmitContact({ name: name.trim(), email: email.trim(), message: message.trim() });
        setContactSuccess(true);
        setContactForm({ name: '', email: '', message: '' });
      } catch (err) {
        setContactError(err instanceof Error ? err.message : 'Failed to send message.');
      } finally {
        setContactSubmitting(false);
      }
    },
    [onSubmitContact, contactForm, contactSubmitting]
  );

  const {
    fullName,
    title,
    email,
    phone,
    whatsapp,
    location,
    resumePdfUrl,
    linkedin,
    github,
    portfolioUrl,
    positioningLine,
    heroCtaText,
    heroCtaLink,
    projectsCompletedCount,
    clientsServedCount,
    professionalSummary,
    yearsOfExperience,
    fullTimeFreelanceMention,
    specialization,
    clientTypes,
    showWIPBanner,
    skills,
    skillCategories,
    experience,
    projects,
    freelanceProjects,
    featuredProjects,
    achievements,
    services,
    servicesDetailed,
    processSteps,
    testimonials,
    education,
    faqItems,
    contactCta,
    calendarBookingUrl,
    mediaItems,
  } = data;

  const hasContact = email || phone || location;
  const hasSocial = linkedin || github || portfolioUrl;
  const skillsList = skills ?? [];
  const skillCategoriesList = skillCategories ?? [];
  const experienceList = experience ?? [];
  const projectsList = projects ?? [];
  const freelanceList = freelanceProjects ?? [];
  const featuredList = featuredProjects ?? [];
  const educationList = education ?? [];
  const achievementsList = achievements ?? [];
  const servicesList = services ?? [];
  const detailedServices = (servicesDetailed ?? []).filter((item) => item.title?.trim());
  const faqList = (faqItems ?? []).filter((item) => item.question?.trim() || item.answer?.trim());
  const processList = processSteps ?? [];
  const testimonialsList = testimonials ?? [];
  const mediaList = mediaItems?.filter((m) => m.url) ?? [];
  const profilePhotos = collectProfilePhotos(data);

  const hasBanners = showWIPBanner;
  const trustStats = [
    yearsOfExperience ? { value: yearsOfExperience, label: 'Experience' } : null,
    projectsCompletedCount ? { value: projectsCompletedCount, label: 'Projects shipped' } : null,
    clientsServedCount ? { value: clientsServedCount, label: 'Clients' } : null,
  ].filter((item): item is { value: string; label: string } => item != null);
  const showSection = (key: PortfolioSectionKey) => isSectionVisible(data.sectionVisibility, key);
  const heroCtaHref = heroCtaLink?.trim() ?? '';
  const heroCtaLabel = heroCtaText?.trim() || (heroCtaHref ? 'Book a call' : '');

  return (
    <div className={`min-h-screen bg-gradient-to-b from-slate-50 to-slate-100/80 text-slate-800 ${className}`}>
      {hasBanners && (
        <div className="flex flex-col sm:flex-row justify-center items-stretch gap-3 px-4 py-3 bg-amber-50/90 border-b border-amber-200">
          {showWIPBanner && (
            <div className="flex items-center justify-center gap-2.5 rounded-xl bg-amber-500 text-white py-3 px-4 shadow-md min-w-0 flex-1 sm:flex-initial">
              <Construction className="shrink-0 w-5 h-5" aria-hidden />
              <span className="text-sm font-medium">
                🔧 Work in progress — this portfolio is still being updated.
              </span>
            </div>
          )}
        </div>
      )}
      <article className="w-full max-w-[1600px] mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-5 md:py-6">
        {/* Hero - compact */}
        {showSection('hero') && (
        <header className="mb-4 md:mb-6">
          <div className="flex flex-wrap items-start gap-4 md:gap-6">
            {profilePhotos.length > 0 && (
              <ProfilePhotos urls={profilePhotos} name={fullName} />
            )}
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                {fullName}
              </h1>
              {title && (
                <p className="mt-1 sm:mt-2 text-base sm:text-lg text-slate-600 font-medium">{title}</p>
              )}
              {positioningLine && (
                <p className="mt-1 sm:mt-2 text-slate-700 text-sm sm:text-base leading-relaxed">{positioningLine}</p>
              )}
              {trustStats.length > 0 && (
                <dl className="mt-3 sm:mt-4 flex flex-wrap gap-2">
                  {trustStats.map((stat) => (
                    <div key={stat.label} className="rounded-xl bg-white border border-slate-200 px-3 py-2 min-w-[7.5rem]">
                      <dt className="text-[11px] uppercase tracking-wide text-slate-500">{stat.label}</dt>
                      <dd className="text-sm sm:text-base font-semibold text-slate-900 mb-0">{stat.value}</dd>
                    </div>
                  ))}
                </dl>
              )}
              <div className="mt-3 sm:mt-4 flex flex-wrap gap-2 sm:gap-3">
                {heroCtaLabel && heroCtaHref && (
                  <a
                    href={heroCtaHref}
                    {...externalLinkProps(heroCtaHref)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-indigo-600 text-white font-medium text-xs sm:text-sm hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg min-h-[44px] sm:min-h-0"
                  >
                    {heroCtaLabel}
                  </a>
                )}
                <a
                  href="#summary"
                  className={
                    heroCtaLabel && heroCtaHref
                      ? 'inline-flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl border-2 border-indigo-600 text-indigo-600 font-medium text-xs sm:text-sm hover:bg-indigo-50 transition-all min-h-[44px] sm:min-h-0'
                      : 'inline-flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-indigo-600 text-white font-medium text-xs sm:text-sm hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg min-h-[44px] sm:min-h-0'
                  }
                >
                  👀 View My Work
                </a>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl border-2 border-indigo-600 text-indigo-600 font-medium text-xs sm:text-sm hover:bg-indigo-50 transition-all min-h-[44px] sm:min-h-0"
                >
                  💼 Hire Me
                </a>
                {resumePdfUrl && (
                  <a
                    href={resumePdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-slate-200 text-slate-800 font-medium text-xs sm:text-sm hover:bg-slate-300 transition-all min-h-[44px] sm:min-h-0"
                  >
                    📄 Download Resume
                  </a>
                )}
              </div>
              <div className="mt-2 sm:mt-3 flex flex-wrap gap-3 sm:gap-4">
                {github && (
                  <a href={github} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline font-medium text-xs sm:text-sm inline-flex items-center gap-1 min-h-[44px] sm:min-h-0">
                    🔗 GitHub
                  </a>
                )}
                {linkedin && (
                  <a href={linkedin} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline font-medium text-xs sm:text-sm inline-flex items-center gap-1 min-h-[44px] sm:min-h-0">
                    💼 LinkedIn
                  </a>
                )}
              </div>
            </div>
          </div>

          {hasContact && (
            <div className="mt-3 sm:mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm text-slate-600 bg-white/60 rounded-xl px-3 sm:px-4 py-2.5 border border-slate-200/80">
              {email && (
                <span className="flex items-center gap-1 flex-wrap">
                  📧 <span className="break-all">{email}</span>
                  <button
                    type="button"
                    onClick={copyEmail}
                    className="text-indigo-600 hover:underline font-medium min-h-[44px] sm:min-h-0 inline-flex items-center py-1"
                    title="Copy email"
                  >
                    {copied ? '✓ Copied!' : 'Copy'}
                  </button>
                </span>
              )}
              {phone && <span className="flex items-center gap-1">📞 {phone}</span>}
              {location && <span className="flex items-center gap-1">📍 {location}</span>}
            </div>
          )}

          {hasSocial && profilePhotos.length === 0 && (
            <div className="mt-2 flex flex-wrap gap-4">
              {linkedin && (
                <a href={linkedin} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline font-medium">
                  LinkedIn
                </a>
              )}
              {github && (
                <a href={github} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline font-medium">
                  GitHub
                </a>
              )}
              {portfolioUrl && (
                <a href={portfolioUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline font-medium">
                  Portfolio
                </a>
              )}
            </div>
          )}
        </header>
        )}

        {/* About */}
        {showSection('about') && (professionalSummary || yearsOfExperience || fullTimeFreelanceMention || specialization || clientTypes) && (
          <section id="summary" className="mb-4 md:mb-6 scroll-mt-6">
            <h2 className="text-xl font-semibold text-slate-900 border-b-2 border-indigo-200 pb-2 mb-4 flex items-center gap-2">
              👋 About
            </h2>
            <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
            {professionalSummary && (
              <p className="text-slate-700 whitespace-pre-wrap leading-relaxed mb-4">
                {professionalSummary}
              </p>
            )}
            {yearsOfExperience && (
              <p className="text-slate-700 text-sm mb-2">
                <span className="font-medium text-slate-800">⏱️ Experience:</span> {yearsOfExperience}
              </p>
            )}
            {fullTimeFreelanceMention && (
              <p className="text-slate-700 text-sm mb-2 whitespace-pre-wrap">{fullTimeFreelanceMention}</p>
            )}
            {specialization && (
              <p className="text-slate-700 text-sm mb-2">
                <span className="font-medium text-slate-800">🎯 Specialization:</span> {specialization}
              </p>
            )}
            {clientTypes && (
              <p className="text-slate-700 text-sm">
                <span className="font-medium text-slate-800">👥 Clients:</span> {clientTypes}
              </p>
            )}
            </div>
          </section>
        )}

        {/* Skills */}
        {showSection('skills') && (skillCategoriesList.length > 0 || skillsList.length > 0) && (
          <section id="skills" className="mb-4 md:mb-6 scroll-mt-6">
            <h2 className="text-xl font-semibold text-slate-900 border-b-2 border-indigo-200 pb-2 mb-4 flex items-center gap-2">
              🛠️ Technical Skills
            </h2>
            <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
            {skillCategoriesList.length > 0 ? (
              <div className="space-y-4">
                {skillCategoriesList.map((cat: PortfolioSkillCategory, i) => (
                  <div key={i}>
                    <h3 className="text-sm font-semibold text-slate-700 mb-2">{cat.category || 'Skills'}</h3>
                    <div className="flex flex-wrap gap-2">
                      {(cat.skills ?? []).filter(Boolean).map((skillName, j) => (
                        <SkillChip key={j} name={skillName} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {skillsList.map((s, i) => (
                  <SkillChip
                    key={i}
                    name={typeof s === 'string' ? s : s.name}
                    percentage={typeof s === 'string' ? undefined : s.percentage}
                  />
                ))}
              </div>
            )}
            </div>
          </section>
        )}

        {/* Experience */}
        {showSection('experience') && experienceList.length > 0 && (
          <section id="experience" className="mb-4 md:mb-6 scroll-mt-6">
            <h2 className="text-xl font-semibold text-slate-900 border-b-2 border-indigo-200 pb-2 mb-4 flex items-center gap-2">
              💼 Experience
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
              {experienceList.map((exp: PortfolioExperienceItem, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-indigo-400"
                >
                  <p className="font-semibold text-slate-900">{exp.role}</p>
                  <p className="text-sm text-slate-600 mt-0.5">
                    {[exp.company, exp.location, exp.period].filter(Boolean).join(' · ')}
                  </p>
                  {exp.techStack && (
                    <p className="text-sm text-slate-600 mt-1">
                      <span className="font-medium">Tech:</span> {exp.techStack}
                    </p>
                  )}
                  {exp.points && (
                    <ul className="mt-2 text-slate-700 text-sm list-disc list-inside space-y-1">
                      {exp.points.split('\n').filter(Boolean).map((p, j) => (
                        <li key={j}>{p}</li>
                      ))}
                    </ul>
                  )}
                  {exp.systemsBuilt && (
                    <p className="mt-2 text-slate-700 text-sm">
                      <span className="font-medium">Systems built:</span> {exp.systemsBuilt}
                    </p>
                  )}
                  {exp.performanceImprovements && (
                    <p className="mt-1 text-slate-700 text-sm">
                      <span className="font-medium">Performance:</span> {exp.performanceImprovements}
                    </p>
                  )}
                  {exp.reusableComponents && (
                    <p className="mt-1 text-slate-700 text-sm">
                      <span className="font-medium">Reusable components:</span> {exp.reusableComponents}
                    </p>
                  )}
                  {exp.impact && (
                    <p className="mt-1 text-slate-700 text-sm">
                      <span className="font-medium">Impact:</span> {exp.impact}
                    </p>
                  )}
                  {(exp.projects ?? []).some((project) => project.name?.trim()) && (
                    <div className="mt-3 space-y-2">
                      <p className="text-sm font-medium text-slate-800 mb-1">Projects</p>
                      {(exp.projects ?? []).filter((project) => project.name?.trim()).map((project, projectIndex) => (
                        <div key={projectIndex} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                          <p className="text-sm font-semibold text-slate-900 mb-0">
                            {project.url ? (
                              <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-indigo-700 hover:underline">{project.name}</a>
                            ) : project.name}
                          </p>
                          {project.summary && <p className="text-sm text-slate-700 mt-1 mb-0 whitespace-pre-line">{project.summary}</p>}
                          {project.contribution && <p className="text-sm text-slate-700 mt-1 mb-0"><span className="font-medium">Your work:</span> {project.contribution}</p>}
                          {project.techStack && <p className="text-sm text-slate-600 mt-1 mb-0"><span className="font-medium">Tech:</span> {project.techStack}</p>}
                          {project.impact && <p className="text-sm text-slate-700 mt-1 mb-0"><span className="font-medium">Impact:</span> {project.impact}</p>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Freelance Projects */}
        {showSection('freelance') && freelanceList.length > 0 && (
          <section id="freelance" className="mb-4 md:mb-6 scroll-mt-6">
            <h2 className="text-xl font-semibold text-slate-900 border-b-2 border-indigo-200 pb-2 mb-4 flex items-center gap-2">
              🚀 Freelance Projects
            </h2>
            <div className="space-y-5">
              {freelanceList.map((item: PortfolioFreelanceProjectItem, i) => (
                <div key={i} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
                  {item.isNda ? (
                    <div>
                      {item.isNotWorking && (
                        <div className="mb-1">
                          <NotWorkingBadge />
                        </div>
                      )}
                      <p className="text-slate-600 italic">Private client project – details available upon request.</p>
                      {item.isNotWorking && (
                        <p className="mt-2 text-xs text-amber-800">The live demo is currently unavailable.</p>
                      )}
                    </div>
                  ) : (
                    <>
                      <ProjectShot src={item.screenshotUrl} alt={item.clientName || item.clientType || 'Freelance project'} />
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        {item.clientName && (
                          <p className="font-semibold text-slate-900 mb-0">{item.clientName}</p>
                        )}
                        {item.clientType && (
                          <p className="text-sm font-medium text-indigo-700 mb-0">{item.clientType}</p>
                        )}
                        {item.isNotWorking && <NotWorkingBadge />}
                      </div>
                      <ResultPill text={item.resultHighlight} />
                      {item.problem && (
                        <p className="text-slate-700 text-sm mt-1"><span className="font-medium">Problem:</span> {item.problem}</p>
                      )}
                      {item.solution && (
                        <p className="text-slate-700 text-sm mt-1"><span className="font-medium">Solution:</span> {item.solution}</p>
                      )}
                      {item.techStack && (
                        <p className="text-slate-600 text-sm mt-1">{item.techStack}</p>
                      )}
                      {item.timeline && (
                        <p className="text-slate-500 text-xs mt-1">{item.timeline}</p>
                      )}
                      {item.keyFeatures && (
                        <ul className="mt-2 text-slate-700 text-sm list-disc list-inside space-y-0.5">
                          {item.keyFeatures.split('\n').filter(Boolean).map((f, j) => (
                            <li key={j}>{f}</li>
                          ))}
                        </ul>
                      )}
                      {item.results && (
                        <p className="mt-2 text-slate-700 text-sm"><span className="font-medium">Results:</span> {item.results}</p>
                      )}
                      {item.isNotWorking && (
                        <p className="mt-2 text-xs text-amber-800">The live demo is currently unavailable.</p>
                      )}
                      {item.liveLink && (
                        <a href={item.liveLink} target="_blank" rel="noopener noreferrer" className="inline-block mt-2 text-sm text-indigo-600 hover:underline font-medium">
                          {item.isNotWorking ? 'Open live site (may be down) →' : 'View live →'}
                        </a>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Featured Projects */}
        {showSection('featured') && featuredList.length > 0 && (
          <section id="featured" className="mb-4 md:mb-6 scroll-mt-6">
            <h2 className="text-xl font-semibold text-slate-900 border-b-2 border-indigo-200 pb-2 mb-4 flex items-center gap-2">
              ⭐ Featured Projects
            </h2>
            <div className="space-y-5">
              {featuredList.map((item: PortfolioFeaturedProjectItem, i) => (
                <div key={i} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
                  <ProjectShot src={item.screenshotUrl} alt={item.name || 'Featured project'} />
                  {(item.name || item.isNotWorking) && (
                    <div className="flex flex-wrap items-center gap-2">
                      {item.name && <p className="font-semibold text-slate-900 mb-0">{item.name}</p>}
                      {item.isNotWorking && <NotWorkingBadge />}
                    </div>
                  )}
                  {item.isNotWorking && (
                    <p className="mt-1 text-xs text-amber-800">The live demo is currently unavailable.</p>
                  )}
                  <ResultPill text={item.resultHighlight} />
                  {item.problem && (
                    <p className="text-slate-700 text-sm mt-1"><span className="font-medium">Problem:</span> {item.problem}</p>
                  )}
                  {item.solution && (
                    <p className="text-slate-700 text-sm mt-1"><span className="font-medium">Solution:</span> {item.solution}</p>
                  )}
                  {item.architectureThinking && (
                    <p className="text-slate-700 text-sm mt-1"><span className="font-medium">Architecture:</span> {item.architectureThinking}</p>
                  )}
                  {item.keyFeatures && (
                    <ul className="mt-2 text-slate-700 text-sm list-disc list-inside space-y-0.5">
                      {item.keyFeatures.split('\n').filter(Boolean).map((f, j) => (
                        <li key={j}>{f}</li>
                      ))}
                    </ul>
                  )}
                  <div className="mt-2 flex flex-wrap gap-3">
                    {item.githubLink && (
                      <a href={item.githubLink} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-600 hover:underline font-medium">
                        GitHub →
                      </a>
                    )}
                    {item.liveLink && (
                      <a href={item.liveLink} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-600 hover:underline font-medium">
                        {item.isNotWorking ? 'Live (may be down) →' : 'Live →'}
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Other Projects */}
        {showSection('projects') && projectsList.length > 0 && (
          <section id="projects" className="mb-4 md:mb-6 scroll-mt-6">
            <h2 className="text-xl font-semibold text-slate-900 border-b-2 border-indigo-200 pb-2 mb-4 flex items-center gap-2">
              📁 Projects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              {projectsList.map((proj: PortfolioProjectItem, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow"
                >
                  <ProjectShot src={proj.screenshotUrl} alt={proj.name || 'Project'} />
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-slate-900 mb-0">{proj.name}</p>
                    {proj.isNotWorking && <NotWorkingBadge />}
                    {proj.url && (
                      <a
                        href={proj.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-indigo-600 hover:underline font-medium"
                      >
                        {proj.isNotWorking ? 'View project (may be down) →' : 'View project →'}
                      </a>
                    )}
                  </div>
                  {proj.isNotWorking && (
                    <p className="mt-1 text-xs text-amber-800">The live demo is currently unavailable.</p>
                  )}
                  <ResultPill text={proj.resultHighlight} />
                  {proj.tech && (
                    <p className="text-sm text-slate-600 mt-1">{proj.tech}</p>
                  )}
                  {proj.highlights && (
                    <ul className="mt-2 text-slate-700 text-sm list-disc list-inside space-y-0.5">
                      {proj.highlights
                        .split('\n')
                        .filter(Boolean)
                        .map((h, j) => (
                          <li key={j}>{h}</li>
                        ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Achievements */}
        {showSection('achievements') && achievementsList.length > 0 && (
          <section id="achievements" className="mb-4 md:mb-6 scroll-mt-6">
            <h2 className="text-xl font-semibold text-slate-900 border-b-2 border-indigo-200 pb-2 mb-4 flex items-center gap-2">
              🏆 Achievements
            </h2>
            <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
            <ul className="text-slate-700 text-sm list-disc list-inside space-y-2">
              {achievementsList.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
            </div>
          </section>
        )}

        {/* Services */}
        {showSection('services') && (detailedServices.length > 0 || servicesList.length > 0) && (
          <section id="services" className="mb-4 md:mb-6 scroll-mt-6">
            <h2 className="text-xl font-semibold text-slate-900 border-b-2 border-indigo-200 pb-2 mb-4 flex items-center gap-2">
              📋 Services I Offer
            </h2>
            {detailedServices.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {detailedServices.map((service, i) => (
                  <div key={i} className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
                    <h3 className="font-semibold text-slate-900">{service.title}</h3>
                    {service.description && (
                      <p className="mt-2 text-sm text-slate-700 whitespace-pre-line">{service.description}</p>
                    )}
                    {service.problemItSolves && (
                      <p className="mt-2 text-sm text-slate-700"><span className="font-medium">Problem:</span> {service.problemItSolves}</p>
                    )}
                    {service.whoItIsFor && (
                      <p className="mt-1 text-sm text-indigo-700"><span className="font-medium">For:</span> {service.whoItIsFor}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
                <ul className="text-slate-700 text-sm list-disc list-inside space-y-2">
                  {servicesList.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        )}

        {/* Process */}
        {showSection('process') && processList.length > 0 && (
          <section id="process" className="mb-4 md:mb-6 scroll-mt-6">
            <h2 className="text-xl font-semibold text-slate-900 border-b-2 border-indigo-200 pb-2 mb-4 flex items-center gap-2">
              📐 My Work Process
            </h2>
            <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
            <ol className="list-decimal list-inside text-slate-700 text-sm space-y-2">
              {processList.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
            </div>
          </section>
        )}

        {/* Testimonials */}
        {showSection('testimonials') && testimonialsList.length > 0 && (
          <section id="testimonials" className="mb-4 md:mb-6 scroll-mt-6">
            <h2 className="text-xl font-semibold text-slate-900 border-b-2 border-indigo-200 pb-2 mb-4 flex items-center gap-2">
              💬 Testimonials
            </h2>
            <div className="space-y-4">
              {testimonialsList.map((t: PortfolioTestimonialItem, i) => (
                <blockquote key={i} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm italic text-slate-700 border-l-4 border-l-amber-400">
                  {t.feedback && <p className="mb-1">"{t.feedback}"</p>}
                  {t.clientName && (
                    <footer className="text-sm text-slate-600 not-italic">
                      — {t.clientName}
                      {t.projectType && <span> · {t.projectType}</span>}
                    </footer>
                  )}
                </blockquote>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {showSection('education') && educationList.length > 0 && (
          <section id="education" className="mb-4 md:mb-6 scroll-mt-6">
            <h2 className="text-xl font-semibold text-slate-900 border-b-2 border-indigo-200 pb-2 mb-4 flex items-center gap-2">
              🎓 Education
            </h2>
            <div className="space-y-4">
              {educationList.map((ed: PortfolioEducationItem, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
                >
                  <p className="font-semibold text-slate-900">{ed.degree}</p>
                  <p className="text-sm text-slate-600 mt-0.5">
                    {[ed.institution, ed.location, ed.period, ed.grade]
                      .filter(Boolean)
                      .join(' · ')}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Resume */}
        {showSection('resume') && (resumePdfUrl || fullTimeFreelanceMention) && (
          <section id="resume" className="mb-4 md:mb-6 scroll-mt-6">
            <h2 className="text-xl font-semibold text-slate-900 border-b-2 border-indigo-200 pb-2 mb-4 flex items-center gap-2">
              📄 Resume
            </h2>
            <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
            {fullTimeFreelanceMention && (
              <p className="text-slate-700 mb-4">{fullTimeFreelanceMention}</p>
            )}
            {resumePdfUrl && (
              <a
                href={resumePdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-medium text-sm hover:bg-indigo-700 transition-all shadow-md"
              >
                📥 Download Resume
              </a>
            )}
            </div>
          </section>
        )}

        {/* FAQ */}
        {showSection('faq') && faqList.length > 0 && (
          <section id="faq" className="mb-4 md:mb-6 scroll-mt-6">
            <h2 className="text-xl font-semibold text-slate-900 border-b-2 border-indigo-200 pb-2 mb-4 flex items-center gap-2">
              FAQ
            </h2>
            <div className="space-y-3">
              {faqList.map((item, i) => (
                <details key={i} className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm group">
                  <summary className="font-semibold text-slate-900 cursor-pointer">
                    {item.question || 'Question'}
                  </summary>
                  {item.answer && (
                    <p className="mt-2 text-sm text-slate-700 whitespace-pre-line">{item.answer}</p>
                  )}
                </details>
              ))}
            </div>
          </section>
        )}

        {/* Contact */}
        {showSection('contact') && (contactCta || calendarBookingUrl || email || phone || whatsapp || location || linkedin || github || onSubmitContact) && (
          <section id="contact" className="mb-4 md:mb-6 scroll-mt-6">
            <h2 className="text-xl font-semibold text-slate-900 border-b-2 border-indigo-200 pb-2 mb-4 flex items-center gap-2">
              📧 Contact
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
              <div>
            {contactCta && (
              <p className="text-slate-700 mb-4 font-medium">{contactCta}</p>
            )}
            {calendarBookingUrl && (
              <a
                href={calendarBookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mb-4 px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-medium text-sm hover:bg-indigo-700 transition-all shadow-md"
              >
                Book a call
              </a>
            )}
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-700 mb-4">
              {email && (
                <span className="flex items-center gap-2">
                  📧 {email}
                  <button type="button" onClick={copyEmail} className="text-indigo-600 hover:underline font-medium" title="Copy email">
                    {copied ? '✓ Copied!' : 'Copy'}
                  </button>
                </span>
              )}
              {phone && <a href={`tel:${phone.replace(/\s/g, '')}`} className="text-indigo-600 hover:underline flex items-center gap-1">📞 {phone}</a>}
              {whatsapp && (
                <a href={`https://wa.me/${whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline flex items-center gap-1">
                  💬 WhatsApp
                </a>
              )}
              {location && <span className="flex items-center gap-1">📍 {location}</span>}
            </div>
            <div className="mt-3 flex flex-wrap gap-4 mb-4">
              {linkedin && (
                <a href={linkedin} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline font-medium inline-flex items-center gap-1">
                  💼 LinkedIn
                </a>
              )}
              {github && (
                <a href={github} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline font-medium inline-flex items-center gap-1">
                  🔗 GitHub
                </a>
              )}
            </div>
              </div>

            {onSubmitContact && (
              <div>
              <form onSubmit={handleContactSubmit} className="mt-4 lg:mt-0 p-4 sm:p-5 rounded-xl border-2 border-slate-200 bg-slate-50/50 w-full max-w-md lg:max-w-none">
                <h3 className="text-base font-semibold text-slate-800 mb-4 flex items-center gap-2">✉️ Send a message</h3>
                <div className="mb-3">
                  <label htmlFor="contact-name" className="form-label text-sm font-medium text-slate-700">Name</label>
                  <input
                    id="contact-name"
                    type="text"
                    className="form-control form-control-sm rounded-lg border-slate-300"
                    value={contactForm.name}
                    onChange={(e) => setContactForm((p) => ({ ...p, name: e.target.value }))}
                    placeholder="Your name"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="contact-email" className="form-label text-sm font-medium text-slate-700">Email</label>
                  <input
                    id="contact-email"
                    type="email"
                    className="form-control form-control-sm rounded-lg border-slate-300"
                    value={contactForm.email}
                    onChange={(e) => setContactForm((p) => ({ ...p, email: e.target.value }))}
                    placeholder="your@email.com"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="contact-message" className="form-label text-sm font-medium text-slate-700">Message</label>
                  <textarea
                    id="contact-message"
                    className="form-control form-control-sm rounded-lg border-slate-300"
                    rows={4}
                    value={contactForm.message}
                    onChange={(e) => setContactForm((p) => ({ ...p, message: e.target.value }))}
                    placeholder="Your message..."
                    required
                  />
                </div>
                {contactError && <p className="text-red-600 text-sm mb-2">❌ {contactError}</p>}
                {contactSuccess && <p className="text-green-600 text-sm mb-2">✅ Message sent. Thank you!</p>}
                <button type="submit" className="btn btn-primary btn-sm rounded-lg px-4 py-2 font-medium" disabled={contactSubmitting}>
                  {contactSubmitting ? '⏳ Sending…' : '📤 Send message'}
                </button>
              </form>
              </div>
            )}
            </div>
          </section>
        )}

        {/* Media */}
        {showSection('media') && mediaList.length > 0 && (
          <section id="media" className="mb-4 md:mb-6 scroll-mt-6">
            <h2 className="text-xl font-semibold text-slate-900 border-b-2 border-indigo-200 pb-2 mb-4 flex items-center gap-2">
              📎 Media
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {mediaList.map((item, i) => (
                <MediaBlock key={i} item={item} />
              ))}
            </div>
          </section>
        )}
      </article>
    </div>
  );
}
