import type { Project } from "../types/portfolio";

/** Reads a page's <title>, whitespace-collapsed; null if absent. */
export const extractTitle = (html: string): string | null => {
  const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const t = m?.[1].replace(/\s+/g, " ").trim();
  return t ? t : null;
};

const squash = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

/** True when the page title contains the project's distinctive first word ("Sakan", "ComplianceAgent"…). */
export const titleMatchesProject = (title: string | null, project: Pick<Project, "shortTitle">): boolean => {
  if (!title) return false;
  const token = squash(project.shortTitle.split(/\s+/)[0]);
  return token.length > 0 && squash(title).includes(token);
};

/** Streamlit Community Cloud apps sleep, and answer a cookie-less client with an auth-redirect loop. */
export const isStreamlitHost = (url: string): boolean => new URL(url).host.endsWith(".streamlit.app");

/** Streamlit serves a generic client-rendered shell, so its <title> says nothing about the app. */
export const canCheckTitle = (url: string): boolean => !isStreamlitHost(url);
