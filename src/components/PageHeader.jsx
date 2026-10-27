import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ease } from "./Reveal.jsx";

// Compact page banner with breadcrumbs, used by every inner page
export default function PageHeader({ title, sub, crumbs = [] }) {
  return (
    <header className="page-header">
      <div className="section-container">
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          {crumbs.map((c) => (
            <span key={c.label}><ChevronRight size={13} />{c.to ? <Link to={c.to}>{c.label}</Link> : <span aria-current="page">{c.label}</span>}</span>
          ))}
        </nav>
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease }}>{title}</motion.h1>
        {sub && <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1, ease }}>{sub}</motion.p>}
      </div>
    </header>
  );
}
