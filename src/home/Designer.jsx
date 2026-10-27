import { Suspense, lazy, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { ArrowRight, MessageCircle, Move3d } from "lucide-react";
import Button from "../components/Button.jsx";
import Reveal from "../components/Reveal.jsx";
import { GEMS } from "../three/gems.js";
import { COLORS, waLink } from "../data/catalog.js";

const RingViewer = lazy(() => import("../three/RingViewer.jsx"));

const METAL_CHOICES = ["yellow", "rose", "white"];
const GEM_CHOICES = ["diamond", "ruby", "sapphire", "emerald", "pearl", "none"];
const CARATS = [0.3, 0.5, 0.75, 1];

export default function Designer() {
  const ref = useRef(null);
  const inView = useInView(ref, { margin: "300px", once: true });
  const [metal, setMetal] = useState("yellow");
  const [gem, setGem] = useState("diamond");
  const [carat, setCarat] = useState(1);
  const [auto, setAuto] = useState(true);

  const hasCarat = gem !== "none" && gem !== "pearl";
  const enquiry = waLink(`Hi Rajani Jewels! I'd like a custom ring made:\nMetal: ${COLORS[metal].label}\nCentre stone: ${GEMS[gem].label}${hasCarat ? `\nCarat weight: ${CARATS[carat]} ct` : ""}\nPlease share the price and making time.`);

  return (
    <section className="section section-dark designer" id="designer" ref={ref}>
      <div className="section-container designer-inner">
        <div className="designer-stage">
          <div className="designer-ring-bg" aria-hidden="true" />
          {inView && (
            <Suspense fallback={<div className="canvas-loading"><span /></div>}>
              <RingViewer metal={COLORS[metal].hex} gem={gem} autoRotate={auto} />
            </Suspense>
          )}
          <button className="designer-hint" onClick={() => setAuto((a) => !a)}><Move3d size={15} /> Drag to rotate · scroll to zoom · {auto ? "Pause" : "Resume"} spin</button>
        </div>

        <div className="designer-panel">
          <Reveal><p className="eyebrow">Bespoke customisation</p></Reveal>
          <Reveal delay={0.05}><h2 className="section-title">Design your <em>own</em> ring.</h2></Reveal>
          <Reveal delay={0.1}><p className="section-sub">Have a design in mind? Pick a metal and centre stone and watch it come to life in 3D — our karigars in Surat will transform your vision into wearable art.</p></Reveal>

          <div className="designer-group">
            <h4>Metal <span>{COLORS[metal].label}</span></h4>
            <div className="chip-row">
              {METAL_CHOICES.map((m) => (
                <button key={m} className={`swatch-btn is-lg ${metal === m ? "is-active" : ""}`} style={{ "--sw": COLORS[m].swatch }} aria-label={COLORS[m].label} aria-pressed={metal === m} onClick={() => setMetal(m)} />
              ))}
            </div>
          </div>

          <div className="designer-group">
            <h4>Centre stone <span>{GEMS[gem].label}</span></h4>
            <div className="chip-row">
              {GEM_CHOICES.map((g) => (
                <button key={g} className={`gem-btn ${gem === g ? "is-active" : ""}`} aria-pressed={gem === g} onClick={() => setGem(g)}>
                  <i style={{ background: GEMS[g].swatch }} />{GEMS[g].label}
                </button>
              ))}
            </div>
          </div>

          {hasCarat && (
            <div className="designer-group">
              <h4>Carat weight <span>{CARATS[carat]} ct</span></h4>
              <input type="range" className="range" min={0} max={CARATS.length - 1} step={1} value={carat} onChange={(e) => setCarat(Number(e.target.value))} aria-label="Carat weight" />
              <div className="range-labels">{CARATS.map((c) => <span key={c}>{c}</span>)}</div>
            </div>
          )}

          <div className="designer-total">
            <div><small>Your design</small><strong>{COLORS[metal].label} · {GEMS[gem].label}</strong><small>Price on request · final quote after consultation</small></div>
          </div>
          <div className="designer-actions">
            <Button as="a" href={enquiry} target="_blank" rel="noreferrer" variant="gold" icon={<MessageCircle size={17} />}>Enquire about this design</Button>
            <Button to="/shop/rings-nose?type=womens-ring" variant="ghost" icon={<ArrowRight size={16} />}>Shop rings</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
