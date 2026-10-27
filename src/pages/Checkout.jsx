import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader.jsx";
import SafeImage from "../components/SafeImage.jsx";
import { lineDetails } from "../components/CartDrawer.jsx";
import { useTitle } from "../components/FloatingActions.jsx";
import { OrderSummary } from "./Cart.jsx";
import { useStore } from "../context/StoreContext.jsx";

const FIELDS = [
  { name: "name", label: "Full name", auto: "name", test: (v) => v.trim().length > 1 },
  { name: "phone", label: "Mobile number", auto: "tel", test: (v) => /^[6-9]\d{9}$/.test(v), hint: "10-digit mobile number" },
  { name: "email", label: "Email (optional)", auto: "email", test: (v) => !v || /^\S+@\S+\.\S+$/.test(v), hint: "email" },
  { name: "city", label: "City (optional)", auto: "address-level2", test: () => true },
  { name: "message", label: "Message (optional)", test: () => true, wide: true, area: true },
];

// Sends the enquiry list to the team on WhatsApp
export default function Checkout() {
  const { lines, user, placeOrder } = useStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: user?.name || "", phone: user?.phone || "", email: user?.email || "", city: user?.city || "", message: "" });
  const [touched, setTouched] = useState(false);
  const [sent, setSent] = useState(false);
  useTitle("Send enquiry");

  if (!lines.length && !sent) return <Navigate to="/cart" replace />;

  const invalid = FIELDS.filter((f) => !f.test(form[f.name]));

  // window.open must run inside the click, or browsers block the WhatsApp tab
  const submit = (e) => {
    e.preventDefault();
    setTouched(true);
    if (invalid.length) return;
    setSent(true);
    const id = placeOrder(form);
    navigate(`/order/${id}`, { replace: true });
  };

  return (
    <>
      <PageHeader title="Send your enquiry" sub="Share your details and we'll continue on WhatsApp." crumbs={[{ label: "Enquiry list", to: "/cart" }, { label: "Send enquiry" }]} />
      <div className="section-container cart-layout">
        <form className="form-grid checkout-panel" onSubmit={submit} noValidate>
          {FIELDS.map((f) => {
            const bad = touched && !f.test(form[f.name]);
            const Input = f.area ? "textarea" : "input";
            return (
              <label key={f.name} className={`field ${f.wide ? "is-wide" : ""} ${bad ? "has-error" : ""}`}>
                <span>{f.label}</span>
                <Input name={f.name} autoComplete={f.auto} rows={f.area ? 4 : undefined} value={form[f.name]} inputMode={f.name === "phone" ? "numeric" : undefined} placeholder={f.area ? "Preferred metal, size, budget or delivery date…" : undefined} onChange={(e) => setForm({ ...form, [f.name]: e.target.value })} aria-invalid={bad} />
                {bad && <small className="field-error">Please enter a valid {f.hint || f.label.toLowerCase()}</small>}
              </label>
            );
          })}
          <button className="btn btn-gold is-wide" type="submit"><span className="btn-label"><MessageCircle size={17} /> Send enquiry on WhatsApp</span></button>
          <p className="muted small is-wide">WhatsApp opens with your list ready to send. Our team will confirm price and delivery before any payment.</p>
        </form>

        <OrderSummary>
          <ul className="mini-lines">
            {lines.map((l) => (
              <li key={l.key}>
                <span className="mini-thumb"><SafeImage id={l.product.images[0]} alt="" widths={[120, 160]} sizes="56px" /><i>{l.qty}</i></span>
                <span><strong>{l.product.name}</strong><small>{lineDetails(l)}</small></span>
              </li>
            ))}
          </ul>
        </OrderSummary>
      </div>
    </>
  );
}
