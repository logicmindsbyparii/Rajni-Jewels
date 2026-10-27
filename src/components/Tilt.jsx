import { useRef } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "framer-motion";

// 3D perspective tilt with a moving glare highlight, driven by the cursor
export default function Tilt({ children, className = "", max = 10, glare = true, ...props }) {
  const ref = useRef(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const spring = { stiffness: 180, damping: 18, mass: 0.5 };
  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), spring);
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), spring);
  const gx = useTransform(px, (v) => `${v * 100}%`);
  const gy = useTransform(py, (v) => `${v * 100}%`);
  const background = useMotionTemplate`radial-gradient(circle at ${gx} ${gy}, rgba(255,240,210,0.35), transparent 55%)`;

  function onMove(e) {
    if (e.pointerType !== "mouse") return;
    const r = ref.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  }
  function onLeave() {
    px.set(0.5);
    py.set(0.5);
  }

  return (
    <motion.div ref={ref} className={`tilt ${className}`} style={{ rotateX, rotateY, transformPerspective: 900 }} onPointerMove={onMove} onPointerLeave={onLeave} {...props}>
      {children}
      {glare && <motion.span className="tilt-glare" style={{ background }} aria-hidden="true" />}
    </motion.div>
  );
}
