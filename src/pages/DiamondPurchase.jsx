import { useState } from "react";
import { Gem, MessageCircle } from "lucide-react";
import PageHeader from "../components/PageHeader.jsx";
import { useTitle } from "../components/FloatingActions.jsx";
import { useStore } from "../context/StoreContext.jsx";
import { COMPANY, waLink } from "../data/catalog.js";

// Options exactly as on the original "Define Your Perfect Diamond" form
const SPECS = [
  { key: "type", label: "Diamond type", options: ["Natural", "Lab Grown"] },
  { key: "size", label: "Diamond weight / size", options: ["Loose Diamond / Sieve", "Solitaire"] },
  { key: "shape", label: "Diamond shape", options: ["Round", "Pear", "Oval", "Princess", "Heart", "Other Fancy"] },
  { key: "clarity", label: "Diamond clarity", options: ["FL", "IF", "VVS1-VVS2", "VS1-VS2", "SI1-SI2", "I1-I2"] },
  { key: "color", label: "Diamond colour", options: ["D", "E", "F", "G", "H", "I", "J", "K"] },
  { key: "cut", label: "Diamond cut", options: ["3X", "EX-", "VG+", "VG-"] },
  { key: "fluorescence", label: "Fluorescence", options: ["None", "Very Slight", "Faint/Slight", "Medium", "Strong", "Very Strong"] },
  { key: "report", label: "Grading report", options: ["GIA", "IGI", "HRD", "None"] },
];

export default function DiamondPurchase() {
  const { user, notify } = useStore();
  const [spec, setSpec] = useState(() => Object.fromEntries(SPECS.map((s) => [s.key, s.options[0]])));
  const [form, setForm] = useState({ name: user?.name || "", phone: user?.phone || "", email: "", notes: "" });
  const [sent, setSent] = useState(false);
  useTitle("Diamond purchase");

  const submit = (e) => {
    e.preventDefault();
    if (form.name.trim().length < 2 || !/^\+?[\d\s-]{10,14}$/.test(form.phone) || !/^\S+@\S+\.\S+$/.test(form.email)) return notify("Please enter your name, contact number and email");
    const text = ["Hi Rajani Jewels! I'd like to purchase a diamond:", ...SPECS.map((s) => `${s.label}: ${spec[s.key]}`), form.notes ? `Additional requirements: ${form.notes}` : null, "", `Name: ${form.name}`, `Contact: ${form.phone}`, `Email: ${form.email}`].filter((l) => l !== null).join("\n");
    window.open(waLink(text), "_blank", "noopener");
    setSent(true);
  };

  return (
    <>
      <PageHeader title="Define your perfect diamond" sub="Tell us your preferred diamond specifications, and our experts will source the ideal diamond that matches your requirements and budget." crumbs={[{ label: "Diamond purchase" }]} />
      <div className="section-container">
        {sent ? (
          <div className="success">
            <div className="success-badge"><Gem size={34} /></div>
            <h2>Request ready in WhatsApp</h2>
            <p className="muted">Press send and our diamond experts will get back to you. Questions? Call <a href={`tel:${COMPANY.tel}`}>{COMPANY.phone}</a>.</p>
            <button className="btn btn-line" onClick={() => setSent(false)}><span className="btn-label">Request another diamond</span></button>
          </div>
        ) : (
          <form className="appointment" onSubmit={submit} noValidate>
            <fieldset>
              <legend>Your details</legend>
              <div className="form-grid">
                <label className="field"><span>Your name *</span><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoComplete="name" /></label>
                <label className="field"><span>Your contact no. *</span><input value={form.phone} inputMode="tel" onChange={(e) => setForm({ ...form, phone: e.target.value })} autoComplete="tel" /></label>
                <label className="field is-wide"><span>Email *</span><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} autoComplete="email" /></label>
              </div>
            </fieldset>
            {SPECS.map((s) => (
              <fieldset key={s.key}>
                <legend>{s.label} *</legend>
                <div className="chip-row">
                  {s.options.map((o) => <button type="button" key={o} className={`chip ${spec[s.key] === o ? "is-active" : ""}`} aria-pressed={spec[s.key] === o} onClick={() => setSpec({ ...spec, [s.key]: o })}>{o}</button>)}
                </div>
              </fieldset>
            ))}
            <fieldset>
              <legend>Additional requirements</legend>
              <label className="field"><textarea rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Carat weight, quantity, budget, setting…" aria-label="Additional requirements" /></label>
            </fieldset>
            <button className="btn btn-gold" type="submit"><span className="btn-label"><MessageCircle size={17} /> Submit on WhatsApp</span></button>
          </form>
        )}
      </div>
    </>
  );
}
