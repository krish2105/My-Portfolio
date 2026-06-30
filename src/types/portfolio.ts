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
  aboutStatements: string[];
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
