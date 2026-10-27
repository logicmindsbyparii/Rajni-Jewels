import { useState } from "react";
import { Mail, MapPin, MessageCircle, Navigation, Phone } from "lucide-react";
import PageHeader from "../components/PageHeader.jsx";
import Tilt from "../components/Tilt.jsx";
import { SocialLinks } from "../components/Footer.jsx";
import { useTitle } from "../components/FloatingActions.jsx";
import { useStore } from "../context/StoreContext.jsx";
import { COMPANY, mapLink, waLink } from "../data/catalog.js";

// Same fields as the original contact form; the message goes out on WhatsApp
export function ContactForm({ title = "Send us a message" }) {
  const { notify } = useStore();
  const [sent, setSent] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.currentTarget));
    if (!d.name.trim() || !/^\S+@\S+\.\S+$/.test(d.email) || d.message.trim().length < 5) return notify("Please fill in your name, email and a message");
    const text = [`Hi Rajani Jewels! ${d.message.trim()}`, "", `Name: ${d.name}`, `Email: ${d.email}`, d.phone && `Phone: ${d.phone}`, d.company && `Company: ${d.company}`].filter((l) => l !== undefined && l !== "").join("\n");
    window.open(waLink(text), "_blank", "noopener");
    setSent(true);
  };

  if (sent) return <div className="auth-card"><h3>Message ready</h3><p className="muted">Press send in WhatsApp and we'll get in touch shortly. You can also email us at <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>.</p></div>;

  return (
    <form className="auth-card form-stack" onSubmit={submit} noValidate>
      <h3>{title}</h3>
      <label className="field"><span>Your name</span><input name="name" autoComplete="name" /></label>
      <label className="field"><span>Your email</span><input name="email" type="email" autoComplete="email" /></label>
      <label className="field"><span>Phone number</span><input name="phone" inputMode="tel" autoComplete="tel" /></label>
      <label className="field"><span>Company (optional)</span><input name="company" autoComplete="organization" /></label>
      <label className="field"><span>Your message</span><textarea name="message" rows={4} /></label>
      <button className="btn btn-gold" type="submit"><span className="btn-label"><MessageCircle size={17} /> Send message</span></button>
    </form>
  );
}

export default function Contact() {
  useTitle("Contact us");

  return (
    <>
      <PageHeader title="Contact us" sub="Do you have questions about how we can help? Send us a message and we'll get in touch shortly." crumbs={[{ label: "Contact us" }]} />
      <div className="section-container contact-page">
        <div className="contact-cards">
          <Tilt className="store-card" max={6}>
            <small className="eyebrow">Visit us</small>
            <h3>{COMPANY.name}, Surat</h3>
            <p><MapPin size={15} /> {COMPANY.address}</p>
            <div className="store-actions">
              <a className="link-btn" href={mapLink} target="_blank" rel="noreferrer"><Navigation size={14} /> Get directions</a>
            </div>
          </Tilt>
          <Tilt className="store-card" max={6}>
            <small className="eyebrow">Call or WhatsApp</small>
            <h3><a href={`tel:${COMPANY.tel}`}>{COMPANY.phone}</a></h3>
            <p><Phone size={15} /> <a href={`tel:${COMPANY.tel}`}>Call now</a></p>
            <p><MessageCircle size={15} /> <a href={waLink()} target="_blank" rel="noreferrer">Chat on WhatsApp</a></p>
          </Tilt>
          <Tilt className="store-card" max={6}>
            <small className="eyebrow">Email & social</small>
            <h3><a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a></h3>
            <p><Mail size={15} /> We reply to every message</p>
            <SocialLinks />
          </Tilt>
        </div>

        <div className="contact">
          <iframe className="contact-map" title="Rajani Jewels on Google Maps" src={`https://www.google.com/maps?q=${encodeURIComponent(COMPANY.address)}&output=embed`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          <ContactForm />
        </div>
      </div>
    </>
  );
}
