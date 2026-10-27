import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { ArrowUp, MessageCircle } from "lucide-react";
import { useLocation } from "react-router-dom";
import { waLink } from "../data/catalog.js";

// WhatsApp chat + back-to-top, bottom-right
export function FloatingActions() {
  const { scrollY } = useScroll();
  const [show, setShow] = useState(false);
  useMotionValueEvent(scrollY, "change", (v) => setShow(v > 700));

  return (
    <div className="float-actions">
      <AnimatePresence>
        {show && (
          <motion.button className="float-btn" aria-label="Back to top" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.6 }}>
            <ArrowUp size={18} />
          </motion.button>
        )}
      </AnimatePresence>
      <a className="float-btn is-whatsapp" href={waLink()} target="_blank" rel="noreferrer" aria-label="Chat with us on WhatsApp">
        <MessageCircle size={22} />
        <span>Chat on WhatsApp</span>
      </a>
    </div>
  );
}

// Reset scroll on navigation, or jump to #hash targets once they render
export function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const t = setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "smooth" }), 120);
      return () => clearTimeout(t);
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname, hash]);
  return null;
}

export function useTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · Rajani Jewels` : "Rajani Jewels · Handcrafted Gold, Polki, Diamond & Gemstone Jewellery";
  }, [title]);
}
