import type { MouseEventHandler, ReactNode } from "react";
import { isValidUrl } from "../../utils/linkValidation";

interface SafeExternalLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  "aria-label"?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}

const SafeExternalLink = ({
  href,
  children,
  className,
  "aria-label": ariaLabel,
  onClick,
}: SafeExternalLinkProps) => {
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
      onClick={onClick}
    >
      {children}
    </a>
  );
};

export default SafeExternalLink;
