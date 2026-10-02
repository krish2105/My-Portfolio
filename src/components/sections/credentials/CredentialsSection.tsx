import { memo, type ReactNode } from "react";
import { useSectionNumber } from "../../../hooks/usePageLayout";
import { credentialGroups, hasCredentials, type CredentialGroups } from "../../../lib/credentials";
import { RevealText, Rise } from "../../common/Reveal";
import AwardCards from "./AwardCards";
import CertificationList from "./CertificationList";
import RecommendationCards from "./RecommendationCards";
import WritingList from "./WritingList";

const Group = ({ title, children }: { title: string; children: ReactNode }) => (
  <div className="mt-14 first:mt-0">
    <p className="kicker mb-6">{title}</p>
    {children}
  </div>
);

/**
 * Real proof beyond the projects: awards, verified recommendations, certifications and published writing. Each
 * group renders only when it has real items, and the whole section renders nothing when none do — there are no
 * "pending / coming soon" placeholder cards (they read as "no proof" to a recruiter). To add proof, edit the data in
 * src/data/portfolio.ts (`recognition`, `testimonials`, `certifications`, `writing`).
 */
const CredentialsSection = ({ groups = credentialGroups() }: { groups?: CredentialGroups }) => {
  const number = useSectionNumber("credentials");
  if (!hasCredentials(groups)) return null;

  return (
    <section id="credentials" aria-labelledby="credentials-heading" className="relative border-t border-[var(--border)] px-6 py-20 md:px-[8vw] md:py-28">
      <div className="mb-10 flex items-center gap-4">
        <span className="kicker">{number}</span>
        <RevealText className="kicker">Credentials</RevealText>
      </div>

      <Rise>
        <h2 id="credentials-heading" className="mb-14 max-w-3xl font-display text-4xl font-black leading-[1.05] tracking-tight text-[var(--text)] md:text-6xl">
          Recognition &amp; <span className="text-gradient">credentials</span>
        </h2>
      </Rise>

      {groups.awards.length > 0 && (
        <Group title="Awards & honours">
          <AwardCards items={groups.awards} />
        </Group>
      )}
      {groups.recommendations.length > 0 && (
        <Group title="Recommendations">
          <RecommendationCards items={groups.recommendations} />
        </Group>
      )}
      {groups.certifications.length > 0 && (
        <Group title="Certifications">
          <CertificationList items={groups.certifications} />
        </Group>
      )}
      {groups.writing.length > 0 && (
        <Group title="Writing">
          <WritingList items={groups.writing} />
        </Group>
      )}
    </section>
  );
};

export default memo(CredentialsSection);
