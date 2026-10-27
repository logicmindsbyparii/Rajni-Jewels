import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Float, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { Gem, RingModel, StudioEnvironment } from "./RingModel.jsx";

// Tells the intro loader the hero has actually drawn, so it can reveal a finished page
function ReadySignal() {
  const frames = useRef(0);
  useFrame(() => {
    if (++frames.current !== 3) return;
    window.__luxoraSceneReady = true;
    window.dispatchEvent(new Event("luxora:scene-ready"));
  });
  return null;
}

// Ring slowly spins and leans toward the cursor
function SpinningRing() {
  const ref = useRef();
  useFrame((state, delta) => {
    const g = ref.current;
    g.rotation.y += delta * 0.45;
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, 0.25 + state.pointer.y * 0.25, 3, delta);
    g.rotation.z = THREE.MathUtils.damp(g.rotation.z, -state.pointer.x * 0.18, 3, delta);
  });
  return (
    <group ref={ref}>
      <RingModel metal="#e8c374" gem="diamond" />
    </group>
  );
}

// Loose diamonds drifting around the ring
function OrbitingGems() {
  const ref = useRef();
  useFrame((_, delta) => { ref.current.rotation.y -= delta * 0.18; });
  const gems = [
    { pos: [2.1, 0.8, 0.4], s: 0.32, r: [0.4, 0, 0.6] },
    { pos: [-2.2, -0.5, 0.6], s: 0.26, r: [-0.3, 0, -0.5] },
    { pos: [1.4, -1.2, -1.2], s: 0.2, r: [0.9, 0, 0.2] },
    { pos: [-1.3, 1.5, -1.0], s: 0.18, r: [0.2, 0, 1.2] },
  ];
  return (
    <group ref={ref}>
      {gems.map((g, i) => (
        <Float key={i} speed={2 + i * 0.4} rotationIntensity={2} floatIntensity={1.4}>
          <Gem type="diamond" position={g.pos} rotation={g.r} scale={g.s} />
        </Float>
      ))}
    </group>
  );
}

export default function HeroScene() {
  return (
    <Canvas dpr={[1, 2]} camera={{ position: [0, 0.3, 5.4], fov: 34 }} gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.15 }}>
      <ambientLight intensity={0.35} />
      <spotLight position={[4, 6, 4]} angle={0.35} penumbra={1} intensity={80} color="#fff1d6" />
      <pointLight position={[-4, -2, 2]} intensity={18} color="#d9a85c" />
      <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.7}>
        <SpinningRing />
      </Float>
      <OrbitingGems />
      <Sparkles count={70} scale={[7, 4.5, 3]} size={2.4} speed={0.35} opacity={0.8} color="#f3d79b" />
      <ContactShadows position={[0, -1.75, 0]} opacity={0.5} scale={7} blur={2.8} far={3} color="#3b2a14" />
      <StudioEnvironment />
      <ReadySignal />
    </Canvas>
  );
}
