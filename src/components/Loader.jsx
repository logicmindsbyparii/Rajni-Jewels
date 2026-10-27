import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const SEGMENTS = 48;
const LETTERS = "RAJANI".split("");
const SPARKS = Array.from({ length: 22 }, (_, i) => ({
  left: `${(i * 37) % 100}%`,
  top: `${(i * 53 + 11) % 100}%`,
  delay: `${(i % 7) * 0.45}s`,
  size: 2 + (i % 3),
}));
const ease = [0.76, 0, 0.24, 1];

// Without WebGL the 3D hero never draws, so the loader mustn't wait for it
function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return Boolean(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

// Faceted brilliant drawn as two crossed planes so it keeps volume while spinning
function Diamond() {
  const face = (
    <svg viewBox="0 0 60 48" aria-hidden="true">
      <defs>
        <linearGradient id="dz-a" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.5" stopColor="#d8ecff" />
          <stop offset="1" stopColor="#9fc3e6" />
        </linearGradient>
        <linearGradient id="dz-b" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#bcd6ee" />
        </linearGradient>
      </defs>
      <polygon points="14,2 46,2 58,16 30,46 2,16" fill="url(#dz-a)" />
      <polygon points="14,2 22,16 2,16" fill="#ffffff" />
      <polygon points="46,2 38,16 58,16" fill="#cfe4f8" />
      <polygon points="22,16 30,2 38,16" fill="#f4fbff" />
      <polygon points="2,16 22,16 30,46" fill="url(#dz-b)" />
      <polygon points="58,16 38,16 30,46" fill="#a9cbea" />
      <polygon points="22,16 38,16 30,46" fill="#e6f3ff" />
    </svg>
  );
  return (
    <div className="ld-diamond">
      <div className="ld-diamond-face">{face}</div>
      <div className="ld-diamond-face is-cross">{face}</div>
      <span className="ld-flare" />
    </div>
  );
}

export default function Loader({ onDone, waitForScene = false }) {
  const [pct, setPct] = useState(0);
  const done = useRef(false);

  // Progress follows a minimum show-time, the window load event and — on the
  // home page — the first rendered frame of the 3D hero, so 100% means ready
  useEffect(() => {
    let raf;
    let loaded = document.readyState === "complete";
    let scene = !waitForScene || !hasWebGL() || Boolean(window.__luxoraSceneReady);
    const onLoad = () => { loaded = true; };
    const onScene = () => { scene = true; };
    window.addEventListener("load", onLoad);
    window.addEventListener("luxora:scene-ready", onScene);
    const start = performance.now();
    const MIN = 2600;
    const finish = () => {
      if (done.current) return;
      done.current = true;
      setTimeout(onDone, 120);
    };
    const tick = (now) => {
      const t = Math.min(1, (now - start) / MIN);
      const p = Math.min(loaded && scene ? 100 : 92, (1 - Math.pow(1 - t, 3)) * 100);
      setPct(Math.round(p));
      if (p >= 100) return finish();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const safety = setTimeout(() => { setPct(100); finish(); }, 9000);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(safety);
      window.removeEventListener("load", onLoad);
      window.removeEventListener("luxora:scene-ready", onScene);
      document.body.style.overflow = prev;
    };
  }, [onDone, waitForScene]);

  return (
    <motion.div className="ld" role="status" aria-label={`Loading Rajani Jewels, ${pct}%`} exit={{ opacity: 1 }} transition={{ duration: 1.2 }}>
      <motion.div className="ld-panel is-top" exit={{ y: "-100%" }} transition={{ duration: 1, ease, delay: 0.05 }} />
      <motion.div className="ld-panel is-bottom" exit={{ y: "100%" }} transition={{ duration: 1, ease, delay: 0.05 }} />

      <motion.div className="ld-stage" exit={{ opacity: 0, scale: 1.25, filter: "blur(8px)" }} transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}>
        <div className="ld-glow" aria-hidden="true" />
        <div className="ld-sparks" aria-hidden="true">
          {SPARKS.map((s, i) => <i key={i} style={{ left: s.left, top: s.top, animationDelay: s.delay, width: s.size, height: s.size }} />)}
        </div>

        <div className="ld-scene-wrap">
        <motion.div className="ld-scene" aria-hidden="true" initial={{ opacity: 0, scale: 0.6, rotateX: 40 }} animate={{ opacity: 1, scale: 1, rotateX: 0 }} transition={{ duration: 1.2, ease: [0.2, 0.7, 0.1, 1] }}>
          <div className="ld-tilt">
            <div className="ld-spin">
              <div className="ld-band">
                {Array.from({ length: SEGMENTS }, (_, i) => (
                  <span key={i} style={{ "--i": i, "--shade": (0.55 + 0.45 * Math.cos((i / SEGMENTS) * Math.PI * 2 - 0.9)).toFixed(3) }} />
                ))}
              </div>
              <Diamond />
            </div>
          </div>
          <div className="ld-shadow" />
        </motion.div>
        </div>

        <div className="ld-word" aria-hidden="true">
          {LETTERS.map((ch, i) => (
            <span className="ld-letter-mask" key={i}>
              <motion.span initial={{ rotateX: -95, y: "60%", opacity: 0 }} animate={{ rotateX: 0, y: 0, opacity: 1 }} transition={{ duration: 0.9, delay: 0.5 + i * 0.08, ease: [0.2, 0.7, 0.1, 1] }}>{ch}</motion.span>
            </span>
          ))}
        </div>
        <motion.p className="ld-tag" initial={{ opacity: 0, letterSpacing: "0.2em" }} animate={{ opacity: 1, letterSpacing: "0.55em" }} transition={{ duration: 1.4, delay: 1 }}>
          Jewels
        </motion.p>

        <div className="ld-progress" aria-hidden="true">
          <div className="ld-bar"><i style={{ transform: `scaleX(${pct / 100})` }} /></div>
          <span className="ld-pct">{String(pct).padStart(3, "0")}<small>%</small></span>
        </div>
      </motion.div>
    </motion.div>
  );
}
