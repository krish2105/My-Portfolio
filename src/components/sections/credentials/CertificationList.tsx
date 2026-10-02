import { BadgeCheck } from "lucide-react";
import type { Certification } from "../../../types/portfolio";
import { Rise } from "../../common/Reveal";
import SafeExternalLink from "../../common/SafeExternalLink";

/** Certifications he actually holds: name, issuer · year, and a verification link when one is public. */
const CertificationList = ({ items }: { items: Certification[] }) => (
  <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
    {items.map((c, i) => (
      <Rise key={c.id} delay={i * 0.06}>
        <li className="flex h-full items-start gap-4 rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-6">
          <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[#00FF94]/30 bg-[#00FF94]/10">
            <BadgeCheck size={16} className="text-[var(--accent)]" aria-hidden />
          </span>
          <div className="min-w-0">
            <h3 className="font-display text-lg font-bold tracking-tight text-[var(--text)]">{c.name}</h3>
            <p className="mt-1 text-sm text-[var(--text-2)]">
              {c.issuer} · {c.year}
            </p>
            {c.credentialUrl && (
              <SafeExternalLink href={c.credentialUrl} className="mt-3 inline-block text-xs font-medium text-[var(--accent)] underline-offset-2 hover:underline">
                Verify ↗
              </SafeExternalLink>
            )}
          </div>
        </li>
      </Rise>
    ))}
  </ul>
);

export default CertificationList;
