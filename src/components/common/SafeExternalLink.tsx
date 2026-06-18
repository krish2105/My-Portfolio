import type { ReactNode } from "react";
import { isValidUrl } from "../../utils/linkValidation";

interface SafeExternalLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  "aria-label"?: string;
}

const SafeExternalLink = ({ href, children, className, "aria-label": ariaLabel }: SafeExternalLinkProps) => {
  if (!isValidUrl(href)) {
    return null;
  }

  const isMailto = href.startsWith("mailto:");

  return (
    <a
      href={href}
      target={isMailto ? undefined : "_blank"}
      rel={isMailto ? undefined : "noopener noreferrer"}
      className={className}
      aria-label={ariaLabel}
    >
      {children}
    </a>
  );
};

export default SafeExternalLink;
