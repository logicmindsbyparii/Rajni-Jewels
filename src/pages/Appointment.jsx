import { useState } from "react";
import { motion } from "framer-motion";
import { CalendarCheck, Gem, MessageCircle, Store, Video } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import PageHeader from "../components/PageHeader.jsx";
import Button from "../components/Button.jsx";
import { useTitle } from "../components/FloatingActions.jsx";
import { useStore } from "../context/StoreContext.jsx";
import { COMPANY, waLink } from "../data/catalog.js";

const TYPES = [
  { id: "store", label: "Visit us in Surat", note: "See our designs in person", icon: Store },
  { id: "video", label: "Video call", note: "View pieces live over WhatsApp", icon: Video },
  { id: "custom", label: "Custom design", note: "Turn your idea into wearable art", icon: Gem },
];
const SLOTS = ["11:00 AM", "12:30 PM", "2:00 PM", "3:30 PM", "5:00 PM", "6:30 PM"];

const nextDays = () => Array.from({ length: 7 }, (_, i) => new Date(Date.now() + (i + 1) * 864e5));

// Requests go to the team on WhatsApp; they confirm the slot
export default function Appointment() {
  const [params] = useSearchParams();
  const { user } = useStore();
  const initial = TYPES.some((t) => t.id === params.get("type")) ? params.get("type") : "store";
  const [type, setType] = useState(initial);
  const [day, setDay] = useState(0);
  const [slot, setSlot] = useState(SLOTS[1]);
  const [form, setForm] = useState({ name: user?.name || "", phone: user?.phone || "", notes: "" });
  const [error, setError] = useState("");
  const [booked, setBooked] = useState(null);
  const days = nextDays();
  useTitle("Book an appointment");

  const submit = (e) => {
    e.preventDefault();
    if (form.name.trim().length < 2 || !/^[6-9]\d{9}$/.test(form.phone)) return setError("Please enter your name and a valid 10-digit mobile number.");
    setError("");
    const request = { type: TYPES.find((t) => t.id === type).label, date: days[day].toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" }), slot };
    const text = [`Hi Rajani Jewels! I'd like to book an appointment.`, `Type: ${request.type}`, `Preferred time: ${request.date}, ${request.slot}`, `Name: ${form.name}`, `Phone: ${form.phone}`, form.notes && `Notes: ${form.notes}`].filter(Boolean).join("\n");
    window.open(waLink(text), "_blank", "noopener");
    setBooked(request);
  };

  return (
    <>
      <PageHeader title="Book an appointment" sub="Free, personal and no obligation. Our team is here to help you choose or create your piece." crumbs={[{ label: "Appointment" }]} />
      <div className="section-container">
        {booked ? (
          <motion.div className="success" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="success-badge"><CalendarCheck size={34} /></div>
            <h2>Almost done, {form.name.split(" ")[0]}!</h2>
            <p className="muted">{booked.type} · {booked.date} at {booked.slot}</p>
            <p className="muted small">Press send in WhatsApp and our team will confirm your slot. Questions? Call <a href={`tel:${COMPANY.tel}`}>{COMPANY.phone}</a>.</p>
            <Button to="/shop" variant="gold">Browse while you wait</Button>
          </motion.div>
        ) : (
          <form className="appointment" onSubmit={submit}>
            <fieldset>
              <legend>1. What would you like?</legend>
              <div className="type-grid">
                {TYPES.map(({ icon: Icon, ...t }) => (
                  <label key={t.id} className={`choice is-card ${type === t.id ? "is-active" : ""}`}>
                    <input type="radio" name="type" checked={type === t.id} onChange={() => setType(t.id)} />
                    <Icon size={24} strokeWidth={1.5} /><strong>{t.label}</strong><small>{t.note}</small>
                  </label>
                ))}
              </div>
              {type === "store" && <p className="muted small">{COMPANY.address}</p>}
            </fieldset>

            <fieldset>
              <legend>2. Pick a date & time</legend>
              <div className="day-row">
                {days.map((d, i) => (
                  <button type="button" key={i} className={`day ${day === i ? "is-active" : ""}`} onClick={() => setDay(i)}>
                    <small>{d.toLocaleDateString("en-IN", { weekday: "short" })}</small>
                    <strong>{d.getDate()}</strong>
                    <small>{d.toLocaleDateString("en-IN", { month: "short" })}</small>
                  </button>
                ))}
              </div>
              <div className="chip-row">
                {SLOTS.map((s) => <button type="button" key={s} className={`chip ${slot === s ? "is-active" : ""}`} onClick={() => setSlot(s)}>{s}</button>)}
              </div>
            </fieldset>

            <fieldset>
              <legend>3. Your details</legend>
              <div className="form-grid">
                <label className="field"><span>Name</span><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoComplete="name" /></label>
                <label className="field"><span>Mobile number</span><input value={form.phone} inputMode="numeric" maxLength={10} onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "") })} autoComplete="tel" /></label>
                <label className="field is-wide"><span>Anything we should know? (optional)</span><textarea rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Design idea, metal, size, occasion, budget…" /></label>
              </div>
            </fieldset>
            {error && <p className="field-error">{error}</p>}
            <button className="btn btn-gold" type="submit"><span className="btn-label"><MessageCircle size={17} /> Request on WhatsApp</span></button>
          </form>
        )}
      </div>
    </>
  );
}
