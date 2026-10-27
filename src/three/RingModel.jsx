import { useMemo } from "react";
import * as THREE from "three";
import { Environment, Lightformer } from "@react-three/drei";

import { GEMS } from "./gems.js";

// Round brilliant profile revolved around Y — flat shading turns it into facets
function useBrilliantGeometry() {
  return useMemo(() => {
    const pts = [
      new THREE.Vector2(0.001, -0.43),
      new THREE.Vector2(0.5, 0),
      new THREE.Vector2(0.5, 0.03),
      new THREE.Vector2(0.3, 0.17),
      new THREE.Vector2(0.001, 0.17),
    ];
    const geo = new THREE.LatheGeometry(pts, 16);
    return geo.toNonIndexed();
  }, []);
}

export function Gem({ type = "diamond", ...props }) {
  const geo = useBrilliantGeometry();
  const gem = GEMS[type] || GEMS.diamond;
  if (type === "pearl") {
    return (
      <mesh {...props} position={[props.position[0], props.position[1] - 0.02, props.position[2]]}>
        <sphereGeometry args={[0.45, 48, 48]} />
        <meshPhysicalMaterial color={gem.color} roughness={0.18} metalness={0} sheen={1} sheenColor="#ffe9d6" iridescence={0.6} iridescenceIOR={1.4} clearcoat={1} envMapIntensity={1.4} />
      </mesh>
    );
  }
  // The canvas is transparent, so transmission has nothing to refract —
  // a mirror-faceted surface with iridescent "fire" reads better as a gem
  const isDiamond = type === "diamond";
  return (
    <mesh geometry={geo} {...props}>
      <meshPhysicalMaterial
        color={isDiamond ? "#dfe9f3" : gem.color}
        flatShading
        metalness={isDiamond ? 0.55 : 0.35}
        roughness={0.02}
        ior={isDiamond ? 2.42 : 1.77}
        specularIntensity={1}
        specularColor="#ffffff"
        envMapIntensity={isDiamond ? 4 : 3}
        clearcoat={1}
        clearcoatRoughness={0}
        iridescence={isDiamond ? 1 : 0.3}
        iridescenceIOR={1.9}
        iridescenceThicknessRange={[100, 800]}
      />
    </mesh>
  );
}

function Metal({ color }) {
  return <meshPhysicalMaterial color={color} metalness={1} roughness={0.14} clearcoat={0.6} clearcoatRoughness={0.1} envMapIntensity={1.6} />;
}

// Upright solitaire: band in the XY plane, stone at the top pointing +Y
export function RingModel({ metal = "#e8c374", gem = "diamond", ...props }) {
  const prongs = [45, 135, 225, 315].map((deg) => {
    const a = (deg * Math.PI) / 180;
    return [Math.cos(a) * 0.17, Math.sin(a) * 0.17];
  });
  const hasStone = gem !== "none";

  return (
    <group {...props}>
      <mesh scale={[1, 1, 1.9]}>
        <torusGeometry args={[1, 0.085, 48, 220]} />
        <Metal color={metal} />
      </mesh>

      {hasStone && (
        <group>
          {/* basket + shoulders */}
          <mesh position={[0, 1.15, 0]}>
            <cylinderGeometry args={[0.13, 0.07, 0.16, 32, 1, true]} />
            <Metal color={metal} />
          </mesh>
          {prongs.map(([x, z], i) => (
            <group key={i}>
              <mesh position={[x * 0.85, 1.27, z * 0.85]} rotation={[z * 0.9, 0, -x * 0.9]}>
                <cylinderGeometry args={[0.022, 0.028, 0.36, 12]} />
                <Metal color={metal} />
              </mesh>
              <mesh position={[x, 1.44, z]}>
                <sphereGeometry args={[0.03, 16, 16]} />
                <Metal color={metal} />
              </mesh>
            </group>
          ))}
          <Gem type={gem} position={[0, 1.37, 0]} scale={0.4} />
          {/* pavé accents down the shoulders */}
          {[-1, 1].map((side) =>
            [0.18, 0.3, 0.42].map((t, k) => {
              const a = Math.PI / 2 + side * t;
              return (
                <mesh key={`${side}-${k}`} position={[Math.cos(a) * 1.075, Math.sin(a) * 1.075, 0]} rotation={[0, 0, a - Math.PI / 2]} scale={0.055}>
                  <octahedronGeometry args={[1, 0]} />
                  <meshPhysicalMaterial color="#e6eef6" metalness={0.6} roughness={0.02} iridescence={1} iridescenceIOR={1.9} envMapIntensity={4} flatShading />
                </mesh>
              );
            }),
          )}
        </group>
      )}
    </group>
  );
}

// Studio lighting built from light-formers, so no HDR file has to be downloaded
export function StudioEnvironment() {
  return (
    <Environment resolution={256} frames={1}>
      <color attach="background" args={["#14100c"]} />
      <Lightformer form="rect" intensity={5} position={[0, 5, -2]} scale={[10, 3, 1]} />
      <Lightformer form="rect" intensity={3} position={[-5, 1, 1]} rotation-y={Math.PI / 2} scale={[8, 2, 1]} color="#ffe2b0" />
      <Lightformer form="rect" intensity={3} position={[5, 1, 1]} rotation-y={-Math.PI / 2} scale={[8, 2, 1]} />
      <Lightformer form="ring" intensity={4} position={[0, 1, 5]} scale={3} color="#fff4e0" />
      <Lightformer form="circle" intensity={2} position={[0, -4, 0]} rotation-x={-Math.PI / 2} scale={4} color="#c9a46a" />
    </Environment>
  );
}
