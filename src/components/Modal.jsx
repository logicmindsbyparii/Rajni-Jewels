import { useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

export function useLockScroll(active) {
  useEffect(() => {
    if (!active) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [active]);
}

export function useEscape(active, onClose) {
  useEffect(() => {
    if (!active) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [active, onClose]);
}

// Centered dialog. `wide` for the quick view layout.
export default function Modal({ open, onClose, title, wide = false, children }) {
  useLockScroll(open);
  useEscape(open, onClose);

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div className="modal-root" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="modal-backdrop" onClick={onClose} />
          <motion.div className={`modal ${wide ? "is-wide" : ""}`} role="dialog" aria-modal="true" aria-label={title} initial={{ opacity: 0, y: 40, scale: 0.96, rotateX: 8 }} animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }} exit={{ opacity: 0, y: 30, scale: 0.97 }} transition={{ duration: 0.45, ease: [0.2, 0.7, 0.1, 1] }}>
            <button className="icon-button modal-close" aria-label="Close" onClick={onClose}><X size={20} /></button>
            {title && !wide && <h2 className="modal-title">{title}</h2>}
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
