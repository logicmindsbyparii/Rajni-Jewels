import { BadgeCheck, Gem, Mail, MapPin, Phone, RefreshCcw, ShieldCheck, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import { CATEGORIES, COMPANY, PROMISES, mapLink } from "../data/catalog.js";

const ICONS = [Truck, RefreshCcw, ShieldCheck, BadgeCheck, Gem];

export function Promises() {
  return (
    <ul className="promises section-container">
      {PROMISES.map(({ title, text }, i) => {
        const Icon = ICONS[i];
        return <li key={title}><Icon size={24} strokeWidth={1.4} /><div><strong>{title}</strong><small>{text}</small></div></li>;
      })}
    </ul>
  );
}

// Brand glyphs (lucide dropped its brand icons)
const SOCIAL = [
  { id: "instagram", label: "Instagram", path: "M12 2.2c3.2 0 3.6 0 4.8.1 1.2.1 1.8.2 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2-.1-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8c.1-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2zm0 4.7a5.1 5.1 0 1 0 0 10.2 5.1 5.1 0 0 0 0-10.2zm0 8.4a3.3 3.3 0 1 1 0-6.6 3.3 3.3 0 0 1 0 6.6zm5.3-9.8a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4z" },
  { id: "facebook", label: "Facebook", path: "M13.5 21v-7.6h2.6l.4-3h-3V8.5c0-.9.2-1.5 1.5-1.5h1.6V4.3c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H7.8v3h2.6V21h3.1z" },
  { id: "youtube", label: "YouTube", path: "M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8c1.6.4 7.8.4 7.8.4s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8zM10 15V9l5.2 3-5.2 3z" },
];

export function SocialLinks() {
  return (
    <div className="social-links">
      {SOCIAL.map((s) => (
        <a key={s.id} href={COMPANY.social[s.id]} target="_blank" rel="noreferrer" aria-label={s.label}>
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d={s.path} fill="currentColor" /></svg>
        </a>
      ))}
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="footer">
      <Promises />
      <div className="footer-main section-container">
        <div className="footer-brand">
          <Link className="brand" to="/" aria-label="Rajani Jewels home"><img className="brand-logo" src="/logo.webp" alt="Rajani Jewels" width="328" height="110" /></Link>
          <p>{COMPANY.intro} Est. {COMPANY.established} · {COMPANY.city}.</p>
          <ul className="contact-list footer-contact">
            <li><MapPin size={16} /> <a href={mapLink} target="_blank" rel="noreferrer">{COMPANY.address}</a></li>
            <li><Phone size={16} /> <a href={`tel:${COMPANY.tel}`}>{COMPANY.phone}</a></li>
            <li><Mail size={16} /> <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a></li>
          </ul>
          <SocialLinks />
        </div>
        <div>
          <h4>Our Products</h4>
          {CATEGORIES.map((c) => <Link key={c.id} to={`/shop/${c.id}`}>{c.name}</Link>)}
          <Link to="/shop">All products</Link>
        </div>
        <div>
          <h4>Quick links</h4>
          <Link to="/">Home</Link>
          <Link to="/about">About us</Link>
          <Link to="/gallery">Gallery & videos</Link>
          <Link to="/diamond-purchase">Diamond purchase</Link>
          <Link to="/appointment">Book an appointment</Link>
        </div>
        <div>
          <h4>Supports</h4>
          <Link to="/contact">Contact us</Link>
          <Link to="/help#faq">FAQs</Link>
          <Link to="/policies/privacy">Privacy policy</Link>
          <Link to="/policies/terms">Terms & conditions</Link>
          <Link to="/policies/refund-returns">Refund & return policy</Link>
        </div>
      </div>
      <div className="footer-bottom section-container">
        <span>© {new Date().getFullYear()} RAJANI JEWELS. All rights reserved.</span>
        <span>{COMPANY.promise}</span>
      </div>
    </footer>
  );
}
