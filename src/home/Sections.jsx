import { useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ArrowUpRight, Gem, HandHeart, Hammer, MessageCircle, Play, ShieldCheck, Sparkles, Store } from "lucide-react";
import { Link } from "react-router-dom";
import SafeImage from "../components/SafeImage.jsx";
import Tilt from "../components/Tilt.jsx";
import Button from "../components/Button.jsx";
import ProductCard from "../components/ProductCard.jsx";
import Reveal, { SectionHead, ease } from "../components/Reveal.jsx";
import { CATEGORIES, COMPANY, GALLERY_VIDEOS, OCCASIONS, OCCASION_IMAGES, PRODUCTS, WHY, waLink } from "../data/catalog.js";

const TRUST = ["Free delivery on all products", "Easy, hassle-free returns", "100% secure payments", "BIS hallmarked gold", "Certified diamonds", "Natural gemstones", "Handcrafted in Surat", "Bespoke customisation"];

export function TrustMarquee() {
  const items = [...TRUST, ...TRUST];
  return (
    <div className="marquee" aria-label="Our promises">
      <div className="marquee-track">
        {items.map((t, i) => <span key={i} aria-hidden={i >= TRUST.length}>{t}<i>✦</i></span>)}
      </div>
    </div>
  );
}

export function Categories() {
  const count = (id) => PRODUCTS.filter((p) => p.category === id).length;
  return (
    <section className="section">
      <div className="section-container">
        <SectionHead eyebrow="Our products" title={<>Shop by <em>collection</em></>} sub="Gold, Polki, diamond and gemstone jewellery, handcrafted by our karigars in Surat." action={<Button to="/shop" variant="line" icon={<ArrowRight size={16} />}>All products</Button>} />
        <div className="category-grid">
          {CATEGORIES.map((c, i) => (
            <Reveal key={c.id} delay={i * 0.06} y={50}>
              <Tilt className="category-card" max={9}>
                <Link to={`/shop/${c.id}`}>
                  <SafeImage id={c.image} alt={c.name} widths={[400, 700, 1000]} sizes="(max-width: 700px) 50vw, 33vw" />
                  <span className="category-shade" />
                  <span className="category-copy">
                    <small>{String(i + 1).padStart(2, "0")} · {count(c.id)} pieces</small>
                    <strong>{c.name}</strong>
                    <span>{c.blurb}</span>
                  </span>
                  <span className="category-arrow"><ArrowUpRight size={18} /></span>
                </Link>
              </Tilt>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

const TABS = [
  { id: "new", label: "Newly listed", pick: (list) => list },
  { id: "polki", label: "Polki & bridal", pick: (list) => list.filter((p) => p.type === "polki-set" || p.occasions.includes("bridal")) },
  { id: "diamond", label: "Diamonds", pick: (list) => list.filter((p) => p.stoneKind === "diamond") },
  { id: "men", label: "For him", pick: (list) => list.filter((p) => p.category === "mens") },
];

export function Trending() {
  const [tab, setTab] = useState("new");
  const products = TABS.find((t) => t.id === tab).pick(PRODUCTS).slice(0, 8);
  return (
    <section className="section section-tint">
      <div className="section-container">
        <SectionHead eyebrow="Popular products" title={<>View our <em>newly listed</em> pieces</>} sub="Every piece is available on enquiry — add it to your list or ask us on WhatsApp." />
        <div className="tabs" role="tablist">
          {TABS.map((t) => (
            <button key={t.id} role="tab" aria-selected={tab === t.id} className={`tab ${tab === t.id ? "is-active" : ""}`} onClick={() => setTab(t.id)}>
              {tab === t.id && <motion.span layoutId="tab-pill" className="tab-pill" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
              <span>{t.label}</span>
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={tab} className="product-grid" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.45, ease }}>
            {products.map((p) => <ProductCard key={p.id} product={p} />)}
          </motion.div>
        </AnimatePresence>
        <div className="center-row"><Button to="/shop" variant="dark" icon={<ArrowRight size={16} />}>View all {PRODUCTS.length} pieces</Button></div>
      </div>
    </section>
  );
}

export function Occasions() {
  return (
    <section className="section">
      <div className="section-container">
        <SectionHead eyebrow="Curated edits" title={<>For every <em>occasion</em></>} />
        <div className="occasion-grid">
          {OCCASIONS.map((o, i) => (
            <Reveal key={o.id} delay={i * 0.08} className={`occasion occasion-${i}`}>
              <Link to={`/shop?occasion=${o.id}`}>
                <SafeImage id={OCCASION_IMAGES[o.id]} alt={o.name} widths={[500, 900, 1300]} sizes="(max-width: 800px) 100vw, 50vw" position={o.id === "bridal" ? "72% center" : "center"} />
                <span className="occasion-copy"><small>{o.note}</small><strong>{o.name}</strong><span className="text-link">Explore <ArrowRight size={15} /></span></span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// Stacked photo cards that fan out in 3D as the section scrolls by
export function Craft() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const r1 = useTransform(scrollYProgress, [0, 0.5, 1], [-18, -8, 2]);
  const r2 = useTransform(scrollYProgress, [0, 0.5, 1], [14, 6, -4]);
  const y1 = useTransform(scrollYProgress, [0, 1], [80, -60]);
  const y2 = useTransform(scrollYProgress, [0, 1], [140, -100]);
  const rx = useTransform(scrollYProgress, [0, 0.5, 1], [24, 0, -12]);
  const polki = PRODUCTS.find((p) => p.type === "polki-set");

  return (
    <section className="section craft" ref={ref}>
      <div className="section-container craft-inner">
        <div className="craft-stack" style={{ perspective: 1200 }}>
          <motion.div className="craft-card card-a" style={{ rotateZ: r1, rotateX: rx, y: y1 }}><SafeImage id="/site/about-home.webp" alt="Rajani Jewels craftsmanship" widths={[500, 800]} sizes="40vw" /></motion.div>
          <motion.div className="craft-card card-b" style={{ rotateZ: r2, rotateX: rx, y: y2 }}><SafeImage id={polki.images[0]} alt={polki.name} widths={[500, 800]} sizes="40vw" /></motion.div>
        </div>
        <div className="craft-copy">
          <Reveal><p className="eyebrow">Est. {COMPANY.established} | {COMPANY.city}</p></Reveal>
          <Reveal delay={0.05}><h2 className="section-title">Welcome to <em>Rajani Jewels</em></h2></Reveal>
          <Reveal delay={0.1}><p className="section-sub">At Rajani Jewels, we manufacture fine jewellery that celebrates tradition, artistry, and elegance. From the royal allure of Polki to the brilliance of certified diamonds and the beauty of natural gemstones, every piece is crafted to be cherished for generations.</p></Reveal>
          <Reveal delay={0.12}><p className="section-sub">Based in Surat — the heart of India's diamond and jewellery industry — our skilled karigars blend heritage craftsmanship with modern design to create timeless jewellery for today and tomorrow.</p></Reveal>
          <ul className="craft-stats">
            {[[COMPANY.established, "established in Surat"], [`${PRODUCTS.length}+`, "designs listed"], [CATEGORIES.length, "collections"]].map(([n, l], i) => (
              <Reveal as="li" key={l} delay={0.15 + i * 0.07}><strong>{n}</strong><span>{l}</span></Reveal>
            ))}
          </ul>
          <Reveal delay={0.3}><Button to="/about" variant="dark" icon={<ArrowRight size={16} />}>Discover our story</Button></Reveal>
        </div>
      </div>
    </section>
  );
}

const WHY_ICONS = [ShieldCheck, Hammer, Sparkles, HandHeart];

export function WhyUs() {
  return (
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
  );
}

export function Videos() {
  return (
    <section className="section">
      <div className="section-container">
        <SectionHead center eyebrow="Our videos" title={<>See it <em>in motion</em></>} sub="Jewellery is more than an accessory — it is a reflection of your style, emotions, and memories. Designs for both modern and traditional tastes." />
        <div className="look-grid">
          {GALLERY_VIDEOS.slice(0, 6).map((src, i) => (
            <Reveal key={src} delay={i * 0.05} className="look">
              <Link to="/gallery" className="look-video" aria-label="Open the video gallery">
                <video src={`${src}#t=0.5`} preload="metadata" muted playsInline onMouseEnter={(e) => e.currentTarget.play().catch(() => {})} onMouseLeave={(e) => e.currentTarget.pause()} />
                <span className="video-play is-small"><Play size={16} fill="currentColor" /></span>
              </Link>
            </Reveal>
          ))}
        </div>
        <div className="center-row"><Button to="/gallery" variant="line" icon={<ArrowRight size={16} />}>View full gallery</Button></div>
      </div>
    </section>
  );
}

export function Services() {
  const items = [
    { icon: MessageCircle, title: "Enquire on WhatsApp", text: "Send us any design and get prices, weight and delivery details directly from our team.", href: waLink(), cta: "Chat now" },
    { icon: Gem, title: "Bespoke customisation", text: "Have a design in mind? We transform your vision into wearable art.", to: "/appointment?type=custom", cta: "Book a consultation" },
    { icon: Store, title: "Visit us in Surat", text: "518, Shashwat, Pipla Sheri, Mahidharpura — see our designs in person.", to: "/contact", cta: "Get directions" },
  ];
  return (
    <section className="section services">
      <div className="section-container">
        <SectionHead center eyebrow="Personal service" title={<>We're here <em>to help</em></>} />
        <div className="service-grid">
          {items.map(({ icon: Icon, ...s }, i) => {
            const body = (
              <>
                <span className="service-icon"><Icon size={26} strokeWidth={1.4} /></span>
                <strong>{s.title}</strong>
                <p>{s.text}</p>
                <span className="text-link">{s.cta} <ArrowRight size={15} /></span>
              </>
            );
            return (
              <Reveal key={s.title} delay={i * 0.08}>
                <Tilt className="service-card" max={8}>
                  {s.href ? <a href={s.href} target="_blank" rel="noreferrer">{body}</a> : <Link to={s.to}>{body}</Link>}
                </Tilt>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
