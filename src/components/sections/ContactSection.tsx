import { useEffect, useRef, useState } from "react";
import { track } from "@vercel/analytics";
import { profile, socialLinks } from "../../data/portfolio";
import SafeExternalLink from "../common/SafeExternalLink";
import SocialLinks from "../common/SocialLinks";
import ResumeButton from "../common/ResumeButton";
import { RevealText, RevealWords, Rise } from "../common/Reveal";

const EMAIL = "krishnamathur008@gmail.com";

type FieldKey = "name" | "email" | "subject" | "message";

const FIELDS: {
  key: FieldKey;
  label: string;
  placeholder: string;
  required: boolean;
  type?: string;
  textarea?: boolean;
}[] = [
  { key: "name", label: "Name", placeholder: "Your name", required: true },
  { key: "email", label: "Email", placeholder: "you@example.com", required: true, type: "email" },
  { key: "subject", label: "Subject", placeholder: "What's this about?", required: false },
  { key: "message", label: "Message", placeholder: "Tell me about your project or idea…", required: true, textarea: true },
];

/** A normal contact form wrapped in macOS-window chrome. Submits via mailto.
 * Exported (in addition to the default ContactSection) so the honeypot/
 * timing-guard + submit logic is directly unit-testable without mounting
 * the whole decorative section tree. */
export const ContactTerminal = () => {
  const [formData, setFormData] = useState<Record<FieldKey, string>>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Partial<Record<FieldKey, string>>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "mailto">("idle");
  // Spam mitigation: honeypot field (must stay empty) + time-to-submit.
  const [honeypot, setHoneypot] = useState("");
  const mountedAt = useRef(0);
  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);

  const setField = (key: FieldKey, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = () => {
    const next: Partial<Record<FieldKey, string>> = {};
    FIELDS.forEach((f) => {
      const v = formData[f.key].trim();
      if (f.required && !v) next[f.key] = `${f.label} is required.`;
    });
    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      next.email = "That doesn't look like a valid email.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  /** Open the user's mail client as a last-resort fallback so no message is lost. */
  const openMailto = () => {
    if (!socialLinks.email) return;
    const mailto = `${socialLinks.email}?subject=${encodeURIComponent(
      formData.subject || "Contact from Portfolio"
    )}&body=${encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    )}`;
    window.location.href = mailto;
    setStatus("mailto");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...formData,
          company: honeypot,
          elapsedMs: Date.now() - mountedAt.current,
        }),
      });
      if (res.ok) {
        setStatus("sent");
        track("contact_submit_success");
        setFormData({ name: "", email: "", subject: "", message: "" });
        return;
      }
      // API reachable but not configured / errored → fall back to mailto.
      openMailto();
    } catch {
      // Network error or running without the serverless function (e.g. local dev).
      openMailto();
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0b0f14] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] ring-1 ring-black/40">
      {/* macOS title bar */}
      <div className="flex items-center gap-2 border-b border-white/10 bg-[#1b2027] px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
        <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
        <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
        <span className="flex-1 select-none text-center text-xs text-[#8b95a1]">
          New Message — krishna@portfolio
        </span>
      </div>

      {/* Form body */}
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5 px-5 py-6 md:px-7 md:py-7">
        {/* Honeypot — hidden from humans, hidden from a11y tree; bots fill it. */}
        <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
          <label htmlFor="company-website">Company website</label>
          <input
            id="company-website"
            type="text"
            name="company"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          {FIELDS.filter((f) => !f.textarea).map((f) => (
            <Field key={f.key} field={f} value={formData[f.key]} error={errors[f.key]} onChange={setField} />
          ))}
        </div>
        {FIELDS.filter((f) => f.textarea).map((f) => (
          <Field key={f.key} field={f} value={formData[f.key]} error={errors[f.key]} onChange={setField} />
        ))}

        <div className="mt-1 flex flex-wrap items-center gap-4">
          <button
            type="submit"
            data-cursor="Send"
            disabled={status === "sending"}
            className="group inline-flex items-center gap-3 rounded-full bg-[#00FF94] px-7 py-3.5 font-bold tracking-wide text-[#050505] transition-transform hover:scale-[1.03] disabled:opacity-60"
          >
            {status === "sending" ? "SENDING…" : "SEND MESSAGE"}
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </button>
          {status === "sent" && (
            <span className="text-sm text-[#27c93f]">Message sent — thanks! I'll reply soon ✓</span>
          )}
          {status === "mailto" && (
            <span className="text-sm text-[#8b95a1]">Opening your mail client…</span>
          )}
        </div>
      </form>
    </div>
  );
};

const Field = ({
  field,
  value,
  error,
  onChange,
}: {
  field: (typeof FIELDS)[number];
  value: string;
  error?: string;
  onChange: (key: FieldKey, value: string) => void;
}) => {
  const base =
    "w-full rounded-lg border bg-[var(--panel)] px-4 py-3 text-[var(--text)] outline-none transition-colors placeholder:text-[var(--text-3)] focus:border-[#00FF94] focus:ring-1 focus:ring-[#00FF94]/40";
  const borderClass = error ? "border-[#ff5f56]" : "border-white/10";

  return (
    <label className={`flex flex-col gap-2 ${field.textarea ? "" : ""}`}>
      <span className="kicker">
        {field.label}
        {field.required && <span className="text-[var(--accent)]"> *</span>}
      </span>
      {field.textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(field.key, e.target.value)}
          placeholder={field.placeholder}
          rows={5}
          className={`${base} ${borderClass} resize-none`}
        />
      ) : (
        <input
          type={field.type ?? "text"}
          value={value}
          onChange={(e) => onChange(field.key, e.target.value)}
          placeholder={field.placeholder}
          autoComplete="off"
          className={`${base} ${borderClass}`}
        />
      )}
      {error && <span className="text-xs text-[#ff5f56]">{error}</span>}
    </label>
  );
};

const ContactSection = () => {
  return (
    <section id="contact" className="relative overflow-hidden border-t border-[var(--border)] px-6 py-28 md:px-[8vw] md:py-40">
      <div className="absolute -top-1/3 left-1/2 -z-10 h-[60vh] w-[60vh] -translate-x-1/2 bg-radial-glow opacity-60" />

      <div className="mb-10 flex items-center gap-4">
        <span className="kicker">(08)</span>
        <RevealText className="kicker">Contact</RevealText>
      </div>

      <h2 className="font-display text-[clamp(2.5rem,9vw,9rem)] font-black leading-[0.9] tracking-tighter text-[var(--text)]">
        <RevealText as="span">LET'S BUILD</RevealText>
        <br />
        <span className="text-outline-accent">
          <RevealText as="span" delay={0.08}>
            SOMETHING
          </RevealText>
        </span>{" "}
        <span className="text-gradient">
          <RevealText as="span" delay={0.16}>
            INTELLIGENT
          </RevealText>
        </span>
      </h2>

      <Rise delay={0.1} className="mt-10 max-w-2xl">
        <RevealWords
          text="Tell me the decision you're trying to make with AI — I'm open to roles and collaborations in ML, GenAI, data analytics and intelligent software."
          className="text-base text-[var(--text-2)] md:text-lg"
        />
      </Rise>

      <Rise delay={0.13} className="mt-3 flex items-center gap-2 text-sm text-[var(--text-2)]">
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" aria-hidden />
        {profile.responseTime}
      </Rise>

      {/* Giant email link */}
      <Rise delay={0.15} className="mt-12">
        <SafeExternalLink
          href={socialLinks.email}
          className="group inline-flex flex-wrap items-baseline gap-x-4 font-display text-2xl font-bold tracking-tight text-[var(--text)] transition-colors hover:text-[var(--accent)] md:text-5xl"
        >
          <span data-cursor="Email">{EMAIL}</span>
          <span className="transition-transform group-hover:translate-x-2">→</span>
        </SafeExternalLink>
      </Rise>

      <div className="mt-20 grid gap-16 md:grid-cols-[1fr_1.2fr]">
        {/* Left: meta + socials */}
        <Rise>
          <div className="flex flex-col gap-8">
            <div>
              <p className="kicker mb-3">Based in</p>
              <p className="font-display text-2xl font-bold text-[var(--text)]">Dubai, UAE</p>
            </div>
            <div>
              <p className="kicker mb-3">Find me online</p>
              <SocialLinks />
            </div>
            <ResumeButton variant="outline" label="Download Resume" className="self-start" />
          </div>
        </Rise>

        {/* Right: macOS terminal contact */}
        <Rise delay={0.1}>
          <ContactTerminal />
        </Rise>
      </div>
    </section>
  );
};

export default ContactSection;
