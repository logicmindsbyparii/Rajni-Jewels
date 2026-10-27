import { useCallback } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ClipboardList, Minus, Plus, Trash2, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import SafeImage from "./SafeImage.jsx";
import Button from "./Button.jsx";
import { useEscape, useLockScroll } from "./Modal.jsx";
import { useStore } from "../context/StoreContext.jsx";

export function lineDetails(line) {
  return [line.product?.code || line.code, line.size && `Size ${line.size}`].filter(Boolean).join(" · ");
}

export default function CartDrawer() {
  const { cartOpen, setCartOpen, lines, totals, changeQty, removeLine } = useStore();
  const navigate = useNavigate();
  const close = useCallback(() => setCartOpen(false), [setCartOpen]);
  useLockScroll(cartOpen);
  useEscape(cartOpen, close);

  const go = (path) => { close(); navigate(path); };

  return createPortal(
    <AnimatePresence>
      {cartOpen && (
        <>
          <motion.div className="drawer-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close} />
          <motion.aside className="drawer" role="dialog" aria-modal="true" aria-label="Enquiry list" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}>
            <header className="drawer-head">
              <h2>Enquiry list <span>({totals.count})</span></h2>
              <button className="icon-button" aria-label="Close enquiry list" onClick={close}><X size={20} /></button>
            </header>

            {lines.length === 0 ? (
              <div className="drawer-empty">
                <ClipboardList size={34} />
                <p>Your enquiry list is empty.</p>
                <Button variant="gold" onClick={() => go("/shop")}>Explore jewellery</Button>
              </div>
            ) : (
              <>
                <ul className="drawer-list">
                  <AnimatePresence initial={false}>
                    {lines.map((line) => (
                      <motion.li key={line.key} layout initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 60, height: 0 }} transition={{ duration: 0.4 }}>
                        <Link to={`/product/${line.id}`} onClick={close} className="drawer-thumb"><SafeImage id={line.product.images[0]} alt={line.product.name} widths={[160, 240]} sizes="88px" /></Link>
                        <div className="drawer-item">
                          <strong>{line.product.name}</strong>
                          <small>{lineDetails(line)}</small>
                          <div className="qty">
                            <button aria-label={`Decrease ${line.product.name}`} onClick={() => changeQty(line.key, -1)} disabled={line.qty <= 1}><Minus size={14} /></button>
                            <span>{line.qty}</span>
                            <button aria-label={`Increase ${line.product.name}`} onClick={() => changeQty(line.key, 1)}><Plus size={14} /></button>
                          </div>
                        </div>
                        <div className="drawer-price">
                          <button aria-label={`Remove ${line.product.name}`} onClick={() => removeLine(line.key)}><Trash2 size={16} /></button>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
                <footer className="drawer-foot">
                  <small>Our team will reply on WhatsApp with prices, weight and delivery details.</small>
                  <div className="drawer-buttons">
                    <Button variant="line" onClick={() => go("/cart")}>View list</Button>
                    <Button variant="gold" onClick={() => go("/checkout")}>Send enquiry</Button>
                  </div>
                </footer>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}
