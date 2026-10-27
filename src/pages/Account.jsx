import { useState } from "react";
import { motion } from "framer-motion";
import { ClipboardList, LogOut, MessageCircle, PartyPopper } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import PageHeader from "../components/PageHeader.jsx";
import SafeImage from "../components/SafeImage.jsx";
import Button from "../components/Button.jsx";
import { useTitle } from "../components/FloatingActions.jsx";
import { useStore } from "../context/StoreContext.jsx";
import { COMPANY, getProduct, enquiryText, waLink } from "../data/catalog.js";

// Re-open WhatsApp with a past enquiry, e.g. if the first tab was closed
const resendLink = (order) => waLink(enquiryText(order.items.map((it) => ({ ...it, product: getProduct(it.id) || { name: it.name, code: it.code, id: it.id } })), order));

export function OrderCard({ order }) {
  return (
    <article className="order">
      <header>
        <div><strong>#{order.id}</strong><small>{new Date(order.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} · {order.items.length} {order.items.length === 1 ? "piece" : "pieces"}</small></div>
        <span className="order-status">Sent on WhatsApp</span>
      </header>
      <div className="order-items">
        {order.items.map((it) => (
          <Link key={it.id + it.size} to={`/product/${it.id}`} className="order-item">
            <SafeImage id={it.image} alt="" widths={[120, 160]} sizes="56px" />
            <span>{it.name}<small>{it.code}{it.size ? ` · Size ${it.size}` : ""} × {it.qty}</small></span>
          </Link>
        ))}
      </div>
      <a className="link-btn" href={resendLink(order)} target="_blank" rel="noreferrer"><MessageCircle size={14} /> Send again on WhatsApp</a>
    </article>
  );
}

export function OrderSuccess() {
  const { id } = useParams();
  const { orders } = useStore();
  const order = orders.find((o) => o.id === id);
  useTitle("Enquiry sent");

  return (
    <div className="section-container success">
      <motion.div className="success-badge" initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 200, damping: 14 }}>
        <PartyPopper size={34} />
      </motion.div>
      <h1>Thank you{order ? `, ${order.name.split(" ")[0]}` : ""}!</h1>
      <p className="muted">Your enquiry <strong>#{id}</strong> is ready in WhatsApp — press send there and our team will reply with prices and delivery details. You can also call us on <a href={`tel:${COMPANY.tel}`}>{COMPANY.phone}</a>.</p>
      {order && <OrderCard order={order} />}
      <div className="center-row">
        <Button to="/account" variant="dark">My enquiries</Button>
        <Button to="/shop" variant="gold">Continue browsing</Button>
      </div>
    </div>
  );
}

function SignIn() {
  const { setUser, notify } = useStore();
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const save = (e) => {
    e.preventDefault();
    if (name.trim().length < 2) return setError("Please tell us your name");
    if (!/^[6-9]\d{9}$/.test(phone)) return setError("Enter a valid 10-digit mobile number");
    setUser({ name: name.trim(), phone, email: "", city: "" });
    notify(`Welcome, ${name.trim().split(" ")[0]}!`);
  };

  return (
    <div className="auth-card">
      <h2>Save your details</h2>
      <p className="muted">We'll fill them in for your enquiries. Your details stay on this device.</p>
      <form onSubmit={save} className="form-stack">
        <label className="field"><span>Your name</span><input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" /></label>
        <label className="field"><span>Mobile number</span><input value={phone} inputMode="numeric" maxLength={10} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))} autoComplete="tel" /></label>
        {error && <p className="field-error">{error}</p>}
        <button className="btn btn-gold btn-block" type="submit"><span className="btn-label">Continue</span></button>
      </form>
    </div>
  );
}

export default function Account() {
  const { user, setUser, orders, wishlist } = useStore();
  useTitle("My account");

  const list = orders.length ? orders.map((o) => <OrderCard key={o.id} order={o} />) : (
    <div className="empty"><p className="muted">No enquiries yet.</p><Button to="/shop" variant="gold">Explore jewellery</Button></div>
  );

  return (
    <>
      <PageHeader title={user ? `Hello, ${user.name.split(" ")[0]}` : "My account"} crumbs={[{ label: "Account" }]} />
      <div className="section-container account">
        {!user ? (
          <div className="account-guest">
            <SignIn />
            {orders.length > 0 && <div><h3 className="block-title">Enquiries from this device</h3>{list}</div>}
          </div>
        ) : (
          <div className="account-grid">
            <aside className="account-side">
              <strong>{user.name}</strong>
              <small>+91 {user.phone}</small>
              <Link to="/wishlist">Wishlist ({wishlist.length})</Link>
              <Link to="/appointment">Book appointment</Link>
              <Link to="/contact">Contact us</Link>
              <button className="link-btn" onClick={() => setUser(null)}><LogOut size={14} /> Forget my details</button>
            </aside>
            <div>
              <h3 className="block-title"><ClipboardList size={18} /> My enquiries</h3>
              {list}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
