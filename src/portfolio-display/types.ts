/**
 * Portfolio display types. Kept in sync with redux/slices/portfolioSlice.
 * Copy this file with PortfolioDisplay when reusing on the portfolio website.
 */

import type { PortfolioSectionVisibility } from './sectionVisibility';

export type { PortfolioSectionKey, PortfolioSectionVisibility } from './sectionVisibility';

export interface PortfolioSkillItem {
  name: string;
  percentage?: number;
}

export interface PortfolioSkillCategory {
  category: string;
  skills: string[];
}

export interface PortfolioProjectItem {
  name: string;
  tech?: string;
  url?: string;
  highlights?: string;
  /** Cover image shown on the project card. */
  screenshotUrl?: string;
  /** Short outcome, e.g. "40% faster checkout". */
  resultHighlight?: string;
  /** Live demo is down. Portfolio shows a “Currently not working” badge. */
  isNotWorking?: boolean;
}

export interface PortfolioEducationItem {
  degree: string;
  institution?: string;
  location?: string;
  period?: string;
  grade?: string;
}

/** A product or project delivered while working at an organization. */
export interface PortfolioExperienceProject {
  name: string;
  summary?: string;
  contribution?: string;
  techStack?: string;
  impact?: string;
  url?: string;
}

export interface PortfolioExperienceItem {
  role: string;
  company?: string;
  location?: string;
  period?: string;
  points?: string;
  techStack?: string;
  systemsBuilt?: string;
  performanceImprovements?: string;
  reusableComponents?: string;
  impact?: string;
  projects?: PortfolioExperienceProject[];
}

export interface PortfolioFreelanceProjectItem {
  clientName?: string;
  clientType?: string;
  problem?: string;
  solution?: string;
  techStack?: string;
  timeline?: string;
  keyFeatures?: string;
  results?: string;
  /** Short outcome shown as a highlight, e.g. "12 hrs/week saved". */
  resultHighlight?: string;
  screenshotUrl?: string;
  liveLink?: string;
  isNda?: boolean;
  /** Live demo is down. Portfolio shows a “Currently not working” badge. */
  isNotWorking?: boolean;
}

export interface PortfolioFeaturedProjectItem {
  name?: string;
  problem?: string;
  solution?: string;
  architectureThinking?: string;
  keyFeatures?: string;
  /** Short outcome shown as a highlight. */
  resultHighlight?: string;
  screenshotUrl?: string;
  githubLink?: string;
  liveLink?: string;
  /** Live demo is down. Portfolio shows a “Currently not working” badge. */
  isNotWorking?: boolean;
}

export interface PortfolioServiceItem {
  title: string;
  description?: string;
  problemItSolves?: string;
  whoItIsFor?: string;
}

export interface PortfolioFaqItem {
  question?: string;
  answer?: string;
}

export interface PortfolioTestimonialItem {
  clientName?: string;
  feedback?: string;
  projectType?: string;
}

export type PortfolioMediaFileType = 'image' | 'pdf' | 'video';

export interface PortfolioMediaItem {
  title: string;
  url: string;
  fileType?: PortfolioMediaFileType;
  fileName?: string;
}

export interface PortfolioData {
  fullName: string;
  title?: string;
  email: string;
  phone?: string;
  whatsapp?: string;
  location?: string;
  /** Main profile photo. Kept in sync with the first entry in avatarUrls. */
  avatarUrl?: string;
  /** Extra developer photos. The first entry is the main profile picture. */
  avatarUrls?: string[];
  resumePdfUrl?: string;
  linkedin?: string;
  github?: string;
  portfolioUrl?: string;
  positioningLine?: string;
  /** Hero primary button label, e.g. "Book a free call". */
  heroCtaText?: string;
  /** Hero primary button URL. Use a calendar link or #contact. */
  heroCtaLink?: string;
  /** Hero stat, e.g. "40+". */
  projectsCompletedCount?: string;
  /** Hero stat, e.g. "25+". */
  clientsServedCount?: string;
  professionalSummary?: string;
  yearsOfExperience?: string;
  fullTimeFreelanceMention?: string;
  specialization?: string;
  clientTypes?: string;
  skills?: PortfolioSkillItem[];
  skillCategories?: PortfolioSkillCategory[];
  experience?: PortfolioExperienceItem[];
  projects?: PortfolioProjectItem[];
  freelanceProjects?: PortfolioFreelanceProjectItem[];
  featuredProjects?: PortfolioFeaturedProjectItem[];
  achievements?: string[];
  education?: PortfolioEducationItem[];
  /** Services I offer (freelance). Used when servicesDetailed is empty. */
  services?: string[];
  /** Richer service cards: problem, audience, and a short description. */
  servicesDetailed?: PortfolioServiceItem[];
  /** Question and answer pairs shown before contact. */
  faqItems?: PortfolioFaqItem[];
  processSteps?: string[];
  testimonials?: PortfolioTestimonialItem[];
  mediaItems?: PortfolioMediaItem[];
  showWIPBanner?: boolean;
  /** Public site visibility. A section is hidden only when its value is false. */
  sectionVisibility?: PortfolioSectionVisibility;
  contactCta?: string;
  /** Calendly or other booking page. */
  calendarBookingUrl?: string;
}
