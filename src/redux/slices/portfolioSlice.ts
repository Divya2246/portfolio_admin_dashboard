import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getPortfolio, setPortfolioDoc, deletePortfolioDoc } from '../../firebase/services/portfolio.service';
import type { PortfolioSectionVisibility } from '../../portfolio-display/sectionVisibility';

export interface PortfolioSkillItem {
  name: string;
  percentage?: number;
}

/** Category label + list of skill names (e.g. Frontend: React, Next.js) */
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

/** Freelance project: client type, problem, solution, results, optional NDA */
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

/** Featured / side project: problem, solution, architecture, links */
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
  /** Hero: one strong positioning line */
  positioningLine?: string;
  /** Hero primary button label, e.g. "Book a free call". */
  heroCtaText?: string;
  /** Hero primary button URL. Use a calendar link or #contact. */
  heroCtaLink?: string;
  /** Hero stat, e.g. "40+". */
  projectsCompletedCount?: string;
  /** Hero stat, e.g. "25+". */
  clientsServedCount?: string;
  /** About: short professional intro */
  professionalSummary?: string;
  /** About: total years of experience */
  yearsOfExperience?: string;
  /** About: e.g. "Working full-time in an organization and collaborating with freelance clients." */
  fullTimeFreelanceMention?: string;
  /** About: specialization (React, reusable architecture, etc.) */
  specialization?: string;
  /** About: type of clients (startup, small business, SaaS, etc.) */
  clientTypes?: string;
  skills?: PortfolioSkillItem[];
  /** Structured skills by category (Frontend, State Management, etc.) */
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
  /** My work process steps */
  processSteps?: string[];
  testimonials?: PortfolioTestimonialItem[];
  mediaItems?: PortfolioMediaItem[];
  showWIPBanner?: boolean;
  /**
   * Public site visibility. A section is hidden only when its value is false.
   * Missing keys stay visible.
   */
  sectionVisibility?: PortfolioSectionVisibility;
  /** Contact CTA e.g. "Available for freelance projects and collaboration." */
  contactCta?: string;
  /** Calendly or other booking page. */
  calendarBookingUrl?: string;
}

export const fetchPortfolio = createAsyncThunk<
  PortfolioData | null,
  string,
  { rejectValue: string }
>('portfolio/fetch', async (userId, { rejectWithValue }) => {
  try {
    return await getPortfolio(userId);
  } catch (e) {
    return rejectWithValue(e instanceof Error ? e.message : 'Failed to load portfolio');
  }
});

export const savePortfolio = createAsyncThunk<
  PortfolioData,
  { userId: string; data: PortfolioData },
  { rejectValue: string }
>('portfolio/save', async ({ userId, data }, { rejectWithValue }) => {
  try {
    await setPortfolioDoc(userId, data);
    return data;
  } catch (e) {
    return rejectWithValue(e instanceof Error ? e.message : 'Failed to save portfolio');
  }
});

export const clearPortfolioAsync = createAsyncThunk<
  void,
  string,
  { rejectValue: string }
>('portfolio/clear', async (userId, { rejectWithValue }) => {
  try {
    await deletePortfolioDoc(userId);
  } catch (e) {
    return rejectWithValue(e instanceof Error ? e.message : 'Failed to clear portfolio');
  }
});

interface PortfolioState {
  data: PortfolioData | null;
  loading: boolean;
  error: string | null;
}

const initialState: PortfolioState = {
  data: null,
  loading: false,
  error: null,
};

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    setPortfolio: (state, action: { payload: PortfolioData | null }) => {
      state.data = action.payload;
      state.error = null;
    },
    clearPortfolio: (state) => {
      state.data = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPortfolio.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPortfolio.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(fetchPortfolio.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to load';
      })
      .addCase(savePortfolio.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(savePortfolio.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(savePortfolio.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to save';
      })
      .addCase(clearPortfolioAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearPortfolioAsync.fulfilled, (state) => {
        state.loading = false;
        state.data = null;
        state.error = null;
      })
      .addCase(clearPortfolioAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to clear';
      });
  },
});

export const { setPortfolio, clearPortfolio, clearError } = portfolioSlice.actions;
export default portfolioSlice.reducer;
