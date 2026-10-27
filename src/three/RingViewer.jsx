import { Canvas } from "@react-three/fiber";
import { ContactShadows, OrbitControls, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { RingModel, StudioEnvironment } from "./RingModel.jsx";

// Drag-to-rotate 360° viewer used by the ring designer and product pages
export default function RingViewer({ metal, gem, autoRotate = true }) {
  return (
    <Canvas dpr={[1, 2]} camera={{ position: [0, 1.2, 4.6], fov: 36 }} gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.1 }}>
      <ambientLight intensity={0.4} />
      <spotLight position={[3, 6, 4]} angle={0.4} penumbra={1} intensity={70} />
      <RingModel metal={metal} gem={gem} position={[0, -0.15, 0]} rotation={[0.15, 0, 0]} />
      <Sparkles count={30} scale={[5, 3.5, 3]} size={1.8} speed={0.25} color="#f6e3b8" />
      <ContactShadows position={[0, -1.4, 0]} opacity={0.45} scale={6} blur={2.6} far={2.5} />
      <OrbitControls enablePan={false} enableZoom minDistance={3} maxDistance={7} autoRotate={autoRotate} autoRotateSpeed={1.6} enableDamping />
      <StudioEnvironment />
    </Canvas>
  );
}
