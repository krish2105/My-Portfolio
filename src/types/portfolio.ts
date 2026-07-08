export type ProjectStatus =
  | "Internship Project"
  | "Academic Team Project"
  | "AI Prototype"
  | "In Development"
  | "Academic Lab Project";

export interface ProjectMetric {
  label: string;
  value: string;
}

export interface ArchitectureStep {
  label: string;
  detail?: string;
}

export interface Project {
  id: string;
  number: string;
  title: string;
  shortTitle: string;
  category: string;
  status: ProjectStatus;
  description: string;
  features?: string[];
  technologies: string[];
  /** High-level domains for the projects filter (e.g. "AI/ML", "Deep Learning", "GenAI", "Data"). */
  tags?: string[];
  images: string[];
  repositoryUrl?: string;
  liveUrl?: string;
  caseStudyUrl?: string;
  note?: string;
  currentFeatures?: string[];
  plannedFeatures?: string[];
  /* Case-study fields (shown in the expandable detail view) */
  problem?: string;
  approach?: string[];
  role?: string;
  impact?: string[];
  metrics?: ProjectMetric[];
  /** Engineering judgment: key technical choices and the reasoning behind them. */
  decisions?: { choice: string; why: string }[];
  /** One-line "why this matters" — shown above the description on the card and modal. */
  valueProp?: string;
  /** Who this project is most relevant to (recruiter/engineer/founder framing). */
  audience?: string;
  /** Ordered system flow, rendered as an architecture map. Flagship projects only. */
  architecture?: ArchitectureStep[];
  /** Honest, stated scope limits — what this has NOT been validated against. */
  limitations?: string[];
  /** What would come next if this project continued. */
  nextSteps?: string[];
  /** Flagship projects get the full dashboard-style case-study treatment. */
  flagship?: boolean;
}

export interface CapabilityGroup {
  id: string;
  title: string;
  description: string;
  skills: { name: string; level: "Core" | "Working Knowledge" | "Academic Experience" | "Exploring" | "Concepts" | string }[];
}

export interface JourneyItem {
  id: string;
  title: string;
  institution: string;
  date: string;
  description?: string;
}

export interface RecognitionItem {
  id: string;
  title: string;
  year: string;
  context: string;
}

export interface Profile {
  name: string;
  titles: string[];
  location: string;
  secondaryLocation: string;
  availability: string;
  /** Short badge-length version of `availability` (e.g. "Open to roles"),
   * for tight UI slots like the profile card status pill. */
  availabilityShort: string;
  /** Static, honest response-time expectation shown near the contact CTA. */
  responseTime: string;
  aboutStatements: string[];
  /** The core one-line positioning statement — reused in the hero, About,
   * SEO helpers and the Copilot's hiring summary so it never drifts. */
  tagline: string;
}

export interface SocialLinks {
  email: string;
  linkedin: string;
  github: string;
  instagram: string;
  kaggle: string;
  twitter: string;
  /** Direct-download URL for the resume (Google Drive uc?export=download link). */
  resume: string;
  website: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
}

export interface NowItem {
  id: string;
  label: string;
  value: string;
}

export type TestimonialType = "linkedin" | "faculty" | "internship";
export type ContentStatus = "verified" | "pending" | "published" | "planned";

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  /** Link to the original source (LinkedIn recommendation, email, etc.) — optional. */
  sourceUrl?: string;
  type: TestimonialType;
  status: ContentStatus;
  /** Whether the author has explicitly given permission to publish — required before adding a real quote. */
  permission?: boolean;
}

export interface WritingItem {
  id: string;
  title: string;
  blurb: string;
  date: string;
  url: string;
  status: ContentStatus;
}

/** Describes an empty "slot" honestly — no fake content, just what's pending and how to request it. */
export interface TrustPlaceholder {
  id: string;
  category: TestimonialType | "writing";
  label: string;
  emptyStateCopy: string;
  ctaLabel: string;
  ctaHref: string;
}
