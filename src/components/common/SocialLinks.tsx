import type { ComponentType } from "react";
import {
  FaGithub,
  FaLinkedinIn,
  FaInstagram,
  FaXTwitter,
  FaKaggle,
  FaEnvelope,
  FaPhone,
  FaWhatsapp,
} from "react-icons/fa6";
import { socialLinks } from "../../data/portfolio";
import { isValidUrl } from "../../utils/linkValidation";

interface SocialEntry {
  key: keyof typeof socialLinks;
  label: string;
  href: string;
  Icon: ComponentType<{ size?: number; className?: string }>;
}

const ALL: SocialEntry[] = [
  { key: "github", label: "GitHub", href: socialLinks.github, Icon: FaGithub },
  { key: "linkedin", label: "LinkedIn", href: socialLinks.linkedin, Icon: FaLinkedinIn },
  { key: "instagram", label: "Instagram", href: socialLinks.instagram, Icon: FaInstagram },
  { key: "kaggle", label: "Kaggle", href: socialLinks.kaggle, Icon: FaKaggle },
  { key: "twitter", label: "X (Twitter)", href: socialLinks.twitter, Icon: FaXTwitter },
  { key: "phone", label: "Call", href: socialLinks.phone, Icon: FaPhone },
  { key: "whatsapp", label: "WhatsApp", href: socialLinks.whatsapp, Icon: FaWhatsapp },
  { key: "email", label: "Email", href: socialLinks.email, Icon: FaEnvelope },
];

interface SocialLinksProps {
  size?: number;
  className?: string;
  iconClassName?: string;
}

/** A consistent, accessible row of neon social icons. Hides any link left blank. */
const SocialLinks = ({ size = 20, className = "", iconClassName = "" }: SocialLinksProps) => {
  const entries = ALL.filter((e) => isValidUrl(e.href));

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      {entries.map(({ key, label, href, Icon }) => {
        const opensInPage = href.startsWith("mailto:") || href.startsWith("tel:");
        return (
          <a
            key={key}
            href={href}
            target={opensInPage ? undefined : "_blank"}
            rel={opensInPage ? undefined : "noopener noreferrer"}
            aria-label={label}
            title={label}
            className={`group relative grid place-items-center w-11 h-11 rounded-md border border-[rgba(215,226,234,0.14)] bg-[var(--panel-2)] text-[var(--text-2)] transition-all duration-300 hover:text-[#050505] hover:bg-[#00FF94] hover:border-[#00FF94] hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(0,255,148,0.45)] focus-visible-ring ${iconClassName}`}
          >
            <Icon size={size} />
          </a>
        );
      })}
    </div>
  );
};

export default SocialLinks;
