import type { Profile } from "../types/portfolio";

const formatStart = (iso: string): string | null => {
  const m = iso.match(/^(\d{4})-(\d{2})(?:-(\d{2}))?$/);
  if (!m) return null;
  const [, y, mo, d] = m;
  const date = new Date(Date.UTC(Number(y), Number(mo) - 1, d ? Number(d) : 1));
  if (Number.isNaN(date.getTime()) || date.getUTCMonth() !== Number(mo) - 1) return null;
  return date.toLocaleDateString("en-GB", { ...(d ? { day: "numeric" } : {}), month: "short", year: "numeric", timeZone: "UTC" });
};

/**
 * The facts a recruiter screens on before reading anything else: where, work authorisation, and availability. A start
 * date appears only if `profile.availableFrom` holds a real ISO date — it is never guessed or free text.
 */
export const heroFacts = (p: Pick<Profile, "location" | "workAuthorization" | "availabilityShort" | "availableFrom">): string[] => {
  const start = p.availableFrom ? formatStart(p.availableFrom) : null;
  return [p.location, p.workAuthorization, start ? `Available from ${start}` : p.availabilityShort];
};
