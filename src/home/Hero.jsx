import { useEffect, useRef } from "react";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight, BadgeCheck, Gem, MessageCircle, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../components/Button.jsx";
import { COMPANY, PRODUCTS, waLink } from "../data/catalog.js";
import { ease } from "../components/Reveal.jsx";
import { useIntroDone } from "../context/IntroContext.js";

// Pieces on the 3D carousel ring — the newest piece of ten different types
const RING_TYPES = ["polki-set", "necklace", "womens-ring", "bangle", "earrings", "pendant-set", "mangalsutra", "bracelet", "mens-bracelet", "tika"];
const RING = RING_TYPES.map((t) => PRODUCTS.find((p) => p.type === t)).filter(Boolean);
const cardSrc = (p) => p.images[0].thumb;

const line = {
  hide: { y: "115%", rotateX: -40 },
  show: (i) => ({ y: 0, rotateX: 0, transition: { duration: 1.2, delay: 0.25 + i * 0.12, ease } }),
};
const rise = {
  hide: { opacity: 0, y: 26 },
  show: (i) => ({ opacity: 1, y: 0, transition: { duration: 0.9, delay: 0.5 + i * 0.12, ease } }),
};

export default function Hero() {
  const ref = useRef(null);
  const ready = useIntroDone();
  const state = ready ? "show" : "hide";

  // Scroll: the ring keeps turning and recedes as the hero leaves
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const scrollSpin = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const stageScale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
  const stageY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // Cursor: the whole ring leans toward the pointer
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const spring = { stiffness: 90, damping: 18 };
  const leanY = useSpring(useTransform(px, [-1, 1], [-14, 14]), spring);
  const leanX = useSpring(useTransform(py, [-1, 1], [-4, -16]), spring);
  const rotateY = useTransform([leanY, scrollSpin], ([a, b]) => a + b);
  const onPointerMove = (e) => {
    if (e.pointerType !== "mouse") return;
    px.set((e.clientX / window.innerWidth) * 2 - 1);
    py.set((e.clientY / window.innerHeight) * 2 - 1);
  };

  // Tell the intro loader once the ring photos are decoded, so it reveals a finished hero
  useEffect(() => {
    let cancelled = false;
    Promise.all(RING.map((p) => { const img = new Image(); img.src = cardSrc(p); return img.decode().catch(() => {}); })).then(() => {
      if (cancelled) return;
      window.__luxoraSceneReady = true;
      window.dispatchEvent(new Event("luxora:scene-ready"));
    });
    return () => { cancelled = true; };
  }, []);

  return (
    <section className="hero" ref={ref} onPointerMove={onPointerMove} onPointerLeave={() => { px.set(0); py.set(0); }}>
      <div className="hero-glow" aria-hidden="true" />
      <div className="hero-grid-lines" aria-hidden="true" />

      <div className="hero-center section-container">
        <motion.p className="hero-kicker" variants={rise} custom={0} initial="hide" animate={state}>
          <Sparkles size={15} /> Est. {COMPANY.established} · {COMPANY.city}
        </motion.p>

        <motion.div className="carousel-wrap" initial={{ opacity: 0, scale: 0.85 }} animate={ready ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }} transition={{ duration: 1.4, ease }}>
        <motion.div className="carousel-stage" style={{ scale: stageScale, y: stageY, opacity: fade }}>
          <motion.div className="carousel-tilt" style={{ rotateX: leanX, rotateY }}>
            <div className="carousel-ring" style={{ "--n": RING.length }}>
              {RING.map((p, i) => (
                <Link key={p.id} to={`/product/${p.id}`} className="ring-card" style={{ "--i": i }} aria-label={`${p.name}, ${p.typeName}`}>
                  <span className="ring-card-inner">
                    <span className="ring-face is-front">
                      <img src={cardSrc(p)} alt="" loading="eager" decoding="async" />
                      <span className="ring-info"><small>{p.typeName}</small><strong>{p.name}</strong><em>{p.code}</em></span>
                    </span>
                    <span className="ring-face is-back" aria-hidden="true"><img src="/logo.webp" alt="" width="328" height="110" decoding="async" /></span>
                  </span>
                </Link>
              ))}
            </div>

            <h1 className="hero-title ring-title" aria-label="Where every design tells a story.">
              {["Where every", "design tells", "a story."].map((word, i) => (
                <span className="hero-line" aria-hidden="true" key={word}>
                  <motion.span className={i === 2 ? "gold-text" : ""} variants={line} custom={i} initial="hide" animate={state}>{word}</motion.span>
                </span>
              ))}
            </h1>
          </motion.div>
          <div className="carousel-floor" aria-hidden="true" />

          <motion.div className="glass-chip chip-rate" initial={{ opacity: 0, x: 30 }} animate={ready ? { opacity: 1, x: 0, y: [0, -8, 0] } : { opacity: 0, x: 30 }} transition={{ opacity: { delay: 1.1 }, x: { delay: 1.1, duration: 0.8 }, y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 } }}>
            <Gem size={16} />
            <div><small>Handcrafted in Surat</small><strong>Polki · Diamond</strong><small>Gold & gemstone jewellery</small></div>
          </motion.div>
          <motion.div className="glass-chip chip-cert" initial={{ opacity: 0, x: -30 }} animate={ready ? { opacity: 1, x: 0, y: [0, 8, 0] } : { opacity: 0, x: -30 }} transition={{ opacity: { delay: 1.3 }, x: { delay: 1.3, duration: 0.8 }, y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2.2 } }}>
            <BadgeCheck size={16} />
            <div><small>BIS hallmarked gold</small><strong>Certified diamonds</strong></div>
          </motion.div>
        </motion.div>
        </motion.div>

        <motion.p className="hero-sub" variants={rise} custom={1} initial="hide" animate={state}>
          {COMPANY.tagline} — {COMPANY.promise}. {COMPANY.intro}
        </motion.p>

        <motion.div className="hero-buttons" variants={rise} custom={2} initial="hide" animate={state}>
          <Button to="/shop" variant="gold" magnetic icon={<ArrowUpRight size={18} />}>Explore collections</Button>
          <Button as="a" href={waLink()} target="_blank" rel="noreferrer" variant="ghost" icon={<MessageCircle size={17} />}>Enquire on WhatsApp</Button>
        </motion.div>
      </div>

      <motion.div className="scroll-cue" initial={{ opacity: 0 }} animate={{ opacity: ready ? 1 : 0 }} transition={{ delay: 2, duration: 1 }} aria-hidden="true">
        <span>Scroll</span><i />
      </motion.div>
    </section>
  );
}
