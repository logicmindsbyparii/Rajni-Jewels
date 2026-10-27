import { useState } from "react";
import { ArrowRight, Eye, Gem, HandHeart, Hammer, ShieldCheck, Sparkles, Target } from "lucide-react";
import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader.jsx";
import SafeImage from "../components/SafeImage.jsx";
import Tilt from "../components/Tilt.jsx";
import Button from "../components/Button.jsx";
import Modal from "../components/Modal.jsx";
import Reveal, { SectionHead } from "../components/Reveal.jsx";
import { useTitle } from "../components/FloatingActions.jsx";
import { COMPANY, CRAFTS, WHY } from "../data/catalog.js";

const WHY_ICONS = [ShieldCheck, Hammer, Sparkles, HandHeart];
const CERTIFICATES = ["/site/certificate-1.jpg", "/site/certificate-2.jpg"];

export default function About() {
  const [cert, setCert] = useState(null);
  useTitle("About us");

  return (
    <>
      <PageHeader title="Where every design tells a story" sub="Timeless jewellery, made with passion." crumbs={[{ label: "About us" }]} />

      <section className="section">
        <div className="section-container about-intro">
          <Reveal className="about-photo"><Tilt max={5}><SafeImage id="/site/about.jpeg" alt="Rajani Jewels" widths={[600, 900]} sizes="(max-width: 900px) 90vw, 40vw" position="center 20%" /></Tilt></Reveal>
          <div>
            <Reveal><p className="eyebrow">Heritage meets elegance · Est. {COMPANY.established} | {COMPANY.city}</p></Reveal>
            <Reveal delay={0.05}><h2 className="section-title">Welcome to <em>Rajani Jewels</em></h2></Reveal>
            <Reveal delay={0.1}><p className="section-sub">At Rajani Jewels, we manufacture fine jewellery that celebrates tradition, artistry, and elegance. From the royal allure of Polki to the brilliance of certified diamonds and the beauty of natural gemstones, every piece is crafted to be cherished for generations.</p></Reveal>
            <Reveal delay={0.15}><p className="section-sub">Based in Surat — the heart of India's diamond and jewellery industry — our skilled karigars blend heritage craftsmanship with modern design to create timeless jewellery for today and tomorrow.</p></Reveal>
            <div className="mission-grid">
              <Reveal delay={0.2} className="mission"><Target size={22} strokeWidth={1.5} /><h3>Our Mission</h3><p>To provide beautiful, reliable, and affordable jewelry to our customers while ensuring a smooth and trustworthy shopping experience.</p></Reveal>
              <Reveal delay={0.25} className="mission"><Eye size={22} strokeWidth={1.5} /><h3>Our Vision</h3><p>To become a trusted name in online jewelry shopping by delivering quality products and excellent customer service.</p></Reveal>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-tint">
        <div className="section-container">
          <SectionHead center eyebrow="Made in Surat, worn worldwide" title={<>What we <em>craft</em></>} />
          <div className="service-grid craft-grid">
            {CRAFTS.map((c, i) => (
              <Reveal key={c.title} delay={i * 0.06}>
                <Tilt className="service-card" max={8}>
                  <Link to={c.to}>
                    <span className="service-icon"><Gem size={24} strokeWidth={1.4} /></span>
                    <strong>{c.title}</strong>
                    <p>{c.text}</p>
                    <span className="text-link">Explore <ArrowRight size={15} /></span>
                  </Link>
                </Tilt>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-dark">
        <div className="section-container">
          <SectionHead center eyebrow="Crafted to be cherished" title={<>Why <em>Rajani Jewels</em></>} />
          <div className="why-grid">
            {WHY.map((w, i) => {
              const Icon = WHY_ICONS[i];
              return <Reveal key={w.title} delay={i * 0.07} className="why"><Icon size={26} strokeWidth={1.4} /><h3>{w.title}</h3><p>{w.text}</p></Reveal>;
            })}
          </div>
        </div>
      </section>

      <section className="section" id="certifications">
        <div className="section-container">
          <SectionHead center eyebrow="Trust & transparency" title={<>Certifications & <em>authenticity</em></>} sub="BIS hallmarked gold, certified diamonds and natural gemstones. Tap a certificate to view it." />
          <div className="cert-grid">
            {CERTIFICATES.map((src, i) => (
              <Reveal key={src} delay={i * 0.08}>
                <button className="cert" onClick={() => setCert(src)} aria-label={`View certificate ${i + 1}`}>
                  <SafeImage id={src} alt={`Rajani Jewels certificate ${i + 1}`} widths={[500, 800]} sizes="(max-width: 700px) 90vw, 40vw" />
                </button>
              </Reveal>
            ))}
          </div>
          <div className="center-row"><Button to="/contact" variant="gold" icon={<ArrowRight size={16} />}>Get in touch</Button></div>
        </div>
      </section>

      <Modal open={!!cert} onClose={() => setCert(null)} title="Certificate" wide>
        {cert && <img className="cert-full" src={cert} alt="Rajani Jewels certificate" />}
      </Modal>
    </>
  );
}
