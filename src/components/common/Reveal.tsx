import type { ReactNode } from "react";
import { motion } from "motion/react";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Masked line reveal — the child slides up from behind a clipped edge.
 * The kinetic-editorial signature used for headings and copy across the site.
 */
export const RevealText = ({
  children,
  delay = 0,
  className = "",
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "h2" | "h3" | "p" | "span";
}) => {
  const Tag = motion[as] as typeof motion.div;
  return (
    <span className="line-mask">
      <Tag
        initial={{ y: "120%" }}
        whileInView={{ y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.9, ease: EASE, delay }}
        className={className}
      >
        {children}
      </Tag>
    </span>
  );
};

/** Splits a string into words, each masked and revealed in sequence on scroll. */
export const RevealWords = ({
  text,
  className = "",
  stagger = 0.04,
  delay = 0,
}: {
  text: string;
  className?: string;
  stagger?: number;
  delay?: number;
}) => {
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((word, i) => (
        <span key={i} className="line-mask inline-flex">
          <motion.span
            initial={{ y: "110%" }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.7, ease: EASE, delay: delay + i * stagger }}
            className="inline-block"
          >
            {word}&nbsp;
          </motion.span>
        </span>
      ))}
    </span>
  );
};

/** Generic fade + rise used for non-text blocks (cards, media). */
export const Rise = ({
  children,
  delay = 0,
  y = 40,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-12%" }}
    transition={{ duration: 0.8, ease: EASE, delay }}
    className={className}
  >
    {children}
  </motion.div>
);
