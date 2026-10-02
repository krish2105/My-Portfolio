import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { projects } from "./portfolio";

/**
 * Offline guards for the project links shown on the site. Two real bugs motivated these: ComplianceAgent's
 * "Live demo" opened a different app (Masar AI) because a stale host was left in the data *and* in the CSP,
 * and the Lulu card linked to a repo that had since gone private (a 404 for every recruiter).
 */
const vercel = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../../vercel.json"), "utf8"));
const pageRule = vercel.headers.find((h: { source: string }) => h.source.includes("(?!resume"));
const csp: string = pageRule.headers.find((h: { key: string }) => h.key === "Content-Security-Policy").value;
const connectSrc = (csp.match(/connect-src ([^;]+)/)?.[1] ?? "").split(/\s+/);
const cspDemoHosts = connectSrc.filter((s) => /^https:\/\/[^/]+\.vercel\.app$/.test(s)).map((s) => new URL(s).host);

const vercelLive = projects.filter((p) => p.liveUrl && new URL(p.liveUrl).host.endsWith(".vercel.app"));

describe("project links", () => {
  it("every *.vercel.app live demo is allowed by the CSP connect-src (the live-status ping needs it)", () => {
    for (const p of vercelLive) {
      expect(cspDemoHosts, `${p.id}: ${p.liveUrl}`).toContain(new URL(p.liveUrl!).host);
    }
  });

  it("the CSP lists no stale demo hosts that no project links to any more", () => {
    const used = new Set(vercelLive.map((p) => new URL(p.liveUrl!).host));
    for (const host of cspDemoHosts) expect(used, `stale CSP host ${host}`).toContain(host);
  });

  it("no two projects share a live URL or a repository URL (copy-paste slips)", () => {
    const dupes = (urls: (string | undefined)[]) =>
      urls.filter((u): u is string => !!u).filter((u, i, a) => a.indexOf(u) !== i);
    expect(dupes(projects.map((p) => p.liveUrl))).toEqual([]);
    expect(dupes(projects.map((p) => p.repositoryUrl))).toEqual([]);
  });

  it("a project whose copy says its repo is private does not link to a repo", () => {
    for (const p of projects) {
      const says = [p.note, ...(p.limitations ?? [])].join(" ");
      if (/repo(sitory)? is private/i.test(says)) expect(p.repositoryUrl, p.id).toBeUndefined();
    }
  });

  it("Lulu's team repo is private, so it must not be linked (it 404s for visitors)", () => {
    const lulu = projects.find((p) => p.id === "lulu-sales")!;
    expect(lulu.repositoryUrl).toBeUndefined();
    expect([lulu.note, ...(lulu.limitations ?? [])].join(" ")).toMatch(/private/i);
  });

  it("repos that were renamed use their new names (the old ones only redirect)", () => {
    const urls = projects.map((p) => p.repositoryUrl ?? "");
    expect(urls.join(" ")).not.toMatch(/Compilance/i);
    expect(urls).not.toContain("https://github.com/krish2105/FinCopilot-");
  });
});
