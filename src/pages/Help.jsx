import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronDown, Mail, MessageCircle, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader.jsx";
import { useTitle } from "../components/FloatingActions.jsx";
import { COMPANY, FAQS, POLICIES, waLink } from "../data/catalog.js";

export default function Help() {
  const [open, setOpen] = useState(0);
  useTitle("FAQs");

  return (
    <>
      <PageHeader title="Frequently asked questions" sub="Answers to common questions, our policies, and ways to reach our team." crumbs={[{ label: "FAQs" }]} />
      <div className="section-container help">
        <section id="faq">
          <h2 className="block-title">Information questions</h2>
          {FAQS.map((f, i) => (
            <div key={f.q} className={`accordion ${open === i ? "is-open" : ""}`}>
              <button onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>{f.q}<ChevronDown size={18} /></button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
                    <div className="accordion-body"><p>{f.a}</p></div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </section>

        <section id="policies">
          <h2 className="block-title">Our policies</h2>
          <div className="policy-grid">
            {POLICIES.map((p) => (
              <Link key={p.id} to={`/policies/${p.id}`} className="policy">
                <h3>{p.title}</h3>
                <p>{p.intro}</p>
                <span className="text-link">Read more <ArrowRight size={15} /></span>
              </Link>
            ))}
          </div>
        </section>

        <section id="contact" className="contact">
          <div>
            <h2 className="block-title">Still have a question?</h2>
            <p className="muted">Call, email or WhatsApp us — our team will get in touch shortly.</p>
            <ul className="contact-list">
              <li><Phone size={17} /> <a href={`tel:${COMPANY.tel}`}>{COMPANY.phone}</a></li>
              <li><MessageCircle size={17} /> <a href={waLink()} target="_blank" rel="noreferrer">WhatsApp us</a></li>
              <li><Mail size={17} /> <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a></li>
            </ul>
          </div>
          <div className="auth-card">
            <h3>Send us a message</h3>
            <p className="muted">Use our contact form and we'll reply on WhatsApp or email.</p>
            <Link className="btn btn-gold" to="/contact"><span className="btn-label">Contact us <ArrowRight size={16} /></span></Link>
          </div>
        </section>
      </div>
    </>
  );
}
