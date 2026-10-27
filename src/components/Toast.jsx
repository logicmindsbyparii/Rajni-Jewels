import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { useStore } from "../context/StoreContext.jsx";

export default function Toast() {
  const { toast, setToast } = useStore();
  return (
    <div className="toast-region" aria-live="polite">
      <AnimatePresence>
        {toast && (
          <motion.div key={toast.id} className="toast" initial={{ opacity: 0, y: 30, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }} transition={{ duration: 0.35 }}>
            <span className="toast-icon"><Check size={15} /></span>
            <span>{toast.text}</span>
            {toast.action && <button onClick={() => { toast.action.run(); setToast(null); }}>{toast.action.label}</button>}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
