import { motion } from "framer-motion";

export const ease = [0.2, 0.7, 0.1, 1];

// Fade-and-rise once the element scrolls into view
export default function Reveal({ as = "div", delay = 0, y = 36, className = "", children, ...props }) {
  const Tag = motion[as];
  return (
    <Tag className={className} initial={{ opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.9, delay, ease }} {...props}>
      {children}
    </Tag>
  );
}

// Section heading with eyebrow, title and optional subtitle
export function SectionHead({ eyebrow, title, sub, action, center = false }) {
  return (
    <div className={`section-head ${center ? "is-center" : ""}`}>
      <Reveal>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2 className="section-title">{title}</h2>
        {sub && <p className="section-sub">{sub}</p>}
      </Reveal>
      {action && <Reveal delay={0.1}>{action}</Reveal>}
    </div>
  );
}
