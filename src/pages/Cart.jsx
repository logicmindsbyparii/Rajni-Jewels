import { AnimatePresence, motion } from "framer-motion";
import { Heart, Lock, Minus, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader.jsx";
import SafeImage from "../components/SafeImage.jsx";
import Button from "../components/Button.jsx";
import { lineDetails } from "../components/CartDrawer.jsx";
import { useTitle } from "../components/FloatingActions.jsx";
import { useStore } from "../context/StoreContext.jsx";
import { COMPANY } from "../data/catalog.js";

// Side panel shared by the enquiry list and send-enquiry pages
export function OrderSummary({ children }) {
  const { totals } = useStore();
  return (
    <aside className="summary">
      <h3>Enquiry summary</h3>
      <dl className="summary-rows">
        <div><dt>Pieces</dt><dd>{totals.count}</dd></div>
        <div><dt>Delivery</dt><dd>Free across India</dd></div>
        <div className="summary-total"><dt>Price</dt><dd>On request</dd></div>
      </dl>
      <p className="muted small">Our team will reply on WhatsApp ({COMPANY.phone}) with prices, weight and delivery details. Payment by bank transfer or UPI once you confirm.</p>
      {children}
      <p className="secure"><Lock size={13} /> 100% secure payments · BIS hallmarked gold</p>
    </aside>
  );
}

export default function Cart() {
  const { lines, totals, changeQty, removeLine, toggleWish, wishlist } = useStore();
  useTitle("Enquiry list");

  const saveForLater = (line) => {
    if (!wishlist.includes(line.id)) toggleWish(line.product);
    removeLine(line.key);
  };

  return (
    <>
      <PageHeader title="Your enquiry list" sub={lines.length ? `${totals.count} ${totals.count === 1 ? "piece" : "pieces"} selected — send them to us in one message.` : null} crumbs={[{ label: "Enquiry list" }]} />
      <div className="section-container">
        {lines.length === 0 ? (
          <div className="empty">
            <h3>Your enquiry list is empty</h3>
            <p className="muted">Add the pieces you love and enquire about all of them together.</p>
            <Button to="/shop" variant="gold">Explore jewellery</Button>
          </div>
        ) : (
          <div className="cart-layout">
            <ul className="cart-list">
              <AnimatePresence initial={false}>
                {lines.map((line) => (
                  <motion.li key={line.key} layout exit={{ opacity: 0, x: -40, height: 0 }} transition={{ duration: 0.35 }}>
                    <Link to={`/product/${line.id}`} className="cart-thumb"><SafeImage id={line.product.images[0]} alt={line.product.name} widths={[200, 320]} sizes="120px" /></Link>
                    <div className="cart-item">
                      <Link to={`/product/${line.id}`}><strong>{line.product.name}</strong></Link>
                      <small>{lineDetails(line)}</small>
                      <small className="muted">{line.product.metal}</small>
                      <div className="cart-item-actions">
                        <div className="qty">
                          <button aria-label="Decrease" disabled={line.qty <= 1} onClick={() => changeQty(line.key, -1)}><Minus size={14} /></button>
                          <span>{line.qty}</span>
                          <button aria-label="Increase" onClick={() => changeQty(line.key, 1)}><Plus size={14} /></button>
                        </div>
                        <button className="link-btn" onClick={() => saveForLater(line)}><Heart size={14} /> Save for later</button>
                        <button className="link-btn" onClick={() => removeLine(line.key)}><Trash2 size={14} /> Remove</button>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
            <OrderSummary>
              <Button to="/checkout" variant="gold" className="btn-block">Send enquiry</Button>
              <Link className="text-link center" to="/shop">Continue browsing</Link>
            </OrderSummary>
          </div>
        )}
      </div>
    </>
  );
}
