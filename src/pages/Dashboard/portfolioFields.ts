import type { DynamicFormFieldConfig } from '../../common/components';
import { defaultSectionVisibility } from '../../portfolio-display/sectionVisibility';
import type {
  PortfolioData,
  PortfolioEducationItem,
  PortfolioExperienceItem,
  PortfolioFreelanceProjectItem,
  PortfolioFeaturedProjectItem,
  PortfolioTestimonialItem,
  PortfolioSkillCategory,
  PortfolioServiceItem,
  PortfolioFaqItem,
} from '../../redux/slices/portfolioSlice';

export const portfolioFormFields: DynamicFormFieldConfig[] = [
  // ——— HERO SECTION ———
  { name: '_section_hero', label: 'Hero Section', type: 'section' },
  { name: 'fullName', label: 'Your full name', type: 'text', placeholder: 'e.g. Ankit Patil', validation: { required: true } },
  { name: 'title', label: 'Title', type: 'text', placeholder: 'e.g. React Frontend Developer | Freelance Web Engineer' },
  { name: 'positioningLine', label: 'One strong positioning line', type: 'text', fullWidth: true, placeholder: 'e.g. Building scalable React applications for organizations and indie clients.' },
  { name: 'heroCtaText', label: 'Primary button label', type: 'text', placeholder: 'e.g. Book a free call' },
  { name: 'heroCtaLink', label: 'Primary button link', type: 'text', placeholder: 'https://calendly.com/... or #contact' },
  { name: 'projectsCompletedCount', label: 'Projects shipped', type: 'text', placeholder: 'e.g. 40+' },
  { name: 'clientsServedCount', label: 'Clients served', type: 'text', placeholder: 'e.g. 25+' },
  { name: 'avatarUrls', label: 'Developer profile pictures', type: 'imageArray', fullWidth: true, placeholder: 'Or paste an image URL' },
  { name: 'resumePdfUrl', label: 'Resume download URL', type: 'text', placeholder: 'https://...' },
  { name: 'linkedin', label: 'LinkedIn URL', type: 'text', placeholder: 'https://linkedin.com/in/...' },
  { name: 'github', label: 'GitHub URL', type: 'text', placeholder: 'https://github.com/...' },
  { name: 'portfolioUrl', label: 'Portfolio URL', type: 'text', placeholder: 'https://...' },

  // ——— ABOUT SECTION ———
  { name: '_section_about', label: 'About Section', type: 'section' },
  { name: 'professionalSummary', label: 'Short professional introduction', type: 'textarea', fullWidth: true, rows: 6, placeholder: 'Who you are, what you do, who you work with.' },
  { name: 'yearsOfExperience', label: 'Total years of experience', type: 'text', placeholder: 'e.g. 3.6+ years' },
  { name: 'fullTimeFreelanceMention', label: 'Full-time + freelance mention', type: 'textarea', fullWidth: true, rows: 2, placeholder: 'e.g. Working full-time in an organization and collaborating with freelance clients.' },
  { name: 'specialization', label: 'Your specialization', type: 'textarea', fullWidth: true, rows: 2, placeholder: 'e.g. React, reusable architecture, scalable UI systems' },
  { name: 'clientTypes', label: 'Type of clients you work with', type: 'text', fullWidth: true, placeholder: 'e.g. Startup, small business, SaaS, etc.' },

  // ——— SKILLS SECTION ———
  { name: '_section_skills', label: 'Skills Section (Structured)', type: 'section' },
  { name: 'skillCategories', label: 'Skills by category (e.g. Frontend, State Management, UI/Styling)', type: 'skillCategoryArray', fullWidth: true },
  { name: 'skills', label: 'Skills (flat list, optional if using categories above)', type: 'skillArray', fullWidth: true },

  // ——— ORGANIZATION EXPERIENCE ———
  { name: '_section_experience', label: 'Organization Experience', type: 'section' },
  { name: 'experience', label: 'Company role, then the projects you delivered there', type: 'experienceArray', fullWidth: true },

  // ——— FREELANCE PROJECTS ———
  { name: '_section_freelance', label: 'Freelance Projects', type: 'section' },
  { name: 'freelanceProjects', label: 'Freelance projects (client, screenshot, result, problem, solution, NDA)', type: 'freelanceProjectArray', fullWidth: true },

  // ——— FEATURED PROJECTS (Personal / Side) ———
  { name: '_section_featured', label: 'Featured Projects (Personal / Side)', type: 'section' },
  { name: 'featuredProjects', label: 'Featured projects (problem, solution, architecture, links)', type: 'featuredProjectArray', fullWidth: true },

  // ——— OTHER PROJECTS ———
  { name: '_section_projects', label: 'Other Projects', type: 'section' },
  { name: 'projects', label: 'Projects', type: 'projectArray', fullWidth: true },

  // ——— SERVICES ———
  { name: '_section_services', label: 'Services I Offer', type: 'section' },
  { name: 'servicesDetailed', label: 'Services (title, what you deliver, problem, who it is for)', type: 'serviceItemArray', fullWidth: true },
  { name: 'services', label: 'Simple service list — shown only when the cards above are empty', type: 'stringArray', fullWidth: true, placeholder: 'e.g. Custom React Web Applications' },

  // ——— PROCESS ———
  { name: '_section_process', label: 'My Work Process', type: 'section' },
  { name: 'processSteps', label: 'Process steps (one per line)', type: 'stringArray', fullWidth: true, placeholder: 'e.g. Requirement discussion, Wireframing, Development' },

  // ——— ACHIEVEMENTS ———
  { name: '_section_achievements', label: 'Achievements & Contributions', type: 'section' },
  { name: 'achievements', label: 'Achievements', type: 'stringArray', fullWidth: true, placeholder: 'One achievement per item' },

  // ——— TESTIMONIALS ———
  { name: '_section_testimonials', label: 'Testimonials', type: 'section' },
  { name: 'testimonials', label: 'Client testimonials (name, feedback, project type)', type: 'testimonialArray', fullWidth: true },

  // ——— EDUCATION ———
  { name: '_section_education', label: 'Education', type: 'section' },
  { name: 'education', label: 'Education', type: 'educationArray', fullWidth: true },

  // ——— FAQ ———
  { name: '_section_faq', label: 'FAQ', type: 'section' },
  { name: 'faqItems', label: 'Questions visitors ask before hiring', type: 'faqArray', fullWidth: true },

  // ——— CONTACT ———
  { name: '_section_contact', label: 'Contact Section', type: 'section' },
  { name: 'email', label: 'Email', type: 'email', placeholder: 'your@email.com', validation: { required: true } },
  { name: 'phone', label: 'Phone', type: 'text', placeholder: 'e.g. +91-9922328647' },
  { name: 'location', label: 'Location', type: 'text', placeholder: 'e.g. Pune, Maharashtra, India' },
  { name: 'whatsapp', label: 'WhatsApp (optional)', type: 'text', placeholder: 'e.g. +91-9922328647' },
  { name: 'contactCta', label: 'Contact CTA line', type: 'text', fullWidth: true, placeholder: 'e.g. Available for freelance projects and collaboration.' },
  { name: 'calendarBookingUrl', label: 'Calendar booking link', type: 'text', fullWidth: true, placeholder: 'https://calendly.com/...' },

  // ——— MEDIA & DISPLAY ———
  { name: '_section_media', label: 'Media & Files', type: 'section' },
  { name: 'mediaItems', label: 'Files (image, PDF, video)', type: 'mediaArray', fullWidth: true },

  { name: '_section_display', label: 'Display options', type: 'section' },
  { name: 'showWIPBanner', label: 'Show WIP banner on portfolio', type: 'checkbox' },
];

export const portfolioDefaultValues: PortfolioData = {
  fullName: '',
  title: '',
  email: '',
  phone: '',
  whatsapp: '',
  location: '',
  avatarUrl: '',
  avatarUrls: [],
  resumePdfUrl: '',
  linkedin: '',
  github: '',
  portfolioUrl: '',
  positioningLine: '',
  heroCtaText: '',
  heroCtaLink: '',
  projectsCompletedCount: '',
  clientsServedCount: '',
  professionalSummary: '',
  yearsOfExperience: '',
  fullTimeFreelanceMention: '',
  specialization: '',
  clientTypes: '',
  skills: [],
  skillCategories: [] as PortfolioSkillCategory[],
  experience: [] as PortfolioExperienceItem[],
  projects: [],
  freelanceProjects: [] as PortfolioFreelanceProjectItem[],
  featuredProjects: [] as PortfolioFeaturedProjectItem[],
  achievements: [],
  services: [],
  servicesDetailed: [] as PortfolioServiceItem[],
  faqItems: [] as PortfolioFaqItem[],
  processSteps: [],
  testimonials: [] as PortfolioTestimonialItem[],
  education: [] as PortfolioEducationItem[],
  contactCta: '',
  calendarBookingUrl: '',
  mediaItems: [],
  showWIPBanner: false,
  sectionVisibility: defaultSectionVisibility(),
};
