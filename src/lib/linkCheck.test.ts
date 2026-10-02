import { describe, expect, it } from "vitest";
import { canCheckTitle, extractTitle, isStreamlitHost, titleMatchesProject } from "./linkCheck";

const project = (shortTitle: string) => ({ shortTitle }) as never;

describe("extractTitle", () => {
  it("reads the <title> text, collapsing whitespace and entities-free", () => {
    expect(extractTitle("<html><head><title>\n  FinCopilot — Agentic   Analyst \n</title></head>")).toBe("FinCopilot — Agentic Analyst");
  });
  it("returns null when there is no title", () => {
    expect(extractTitle("<html><body>hi</body></html>")).toBeNull();
  });
});

describe("titleMatchesProject", () => {
  it("matches on the project's distinctive first word, ignoring case and punctuation", () => {
    expect(titleMatchesProject("Sakan AI — Deal Intelligence Terminal", project("Sakan AI"))).toBe(true);
    expect(titleMatchesProject("ComplianceAgent — AML/KYC Investigation Copilot", project("ComplianceAgent"))).toBe(true);
    expect(titleMatchesProject("autovaluate intelligence", project("AutoValuate"))).toBe(true);
  });

  // Regression: the ComplianceAgent link pointed at an unrelated app and nothing noticed.
  it("rejects a page that is clearly a different app", () => {
    expect(titleMatchesProject("Masar AI — Dubai Mobility Decision Intelligence", project("ComplianceAgent"))).toBe(false);
  });

  it("rejects a missing title", () => {
    expect(titleMatchesProject(null, project("FinCopilot"))).toBe(false);
  });
});

describe("canCheckTitle", () => {
  it("skips hosts whose HTML shell has no meaningful title (client-rendered Streamlit)", () => {
    expect(canCheckTitle("https://my-app-abc.streamlit.app/")).toBe(false);
    expect(canCheckTitle("https://fin-copilot-six.vercel.app")).toBe(true);
  });
});

describe("isStreamlitHost", () => {
  it("recognises Streamlit Community Cloud apps only", () => {
    expect(isStreamlitHost("https://my-app-abc.streamlit.app/")).toBe(true);
    expect(isStreamlitHost("https://fin-copilot-six.vercel.app")).toBe(false);
  });
});
