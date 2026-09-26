"use client";

import { ContactShadows } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { type AllianceId } from "@/lib/fruit-games-config";

const ORDER: AllianceId[] = ["gold", "crimson", "white"];

const METAL: Record<AllianceId, string> = {
  gold: "#c6a15a",
  crimson: "#9d2344",
  white: "#c9ced6",
};

function Column({
  alliance,
  height,
  x,
  hot,
  burst,
}: {
  alliance: AllianceId;
  height: number;
  x: number;
  hot: boolean;
  burst: number;
}) {
  const shaft = useRef<THREE.Group>(null);
  const metal = useRef<THREE.MeshStandardMaterial>(null);
  const ring = useRef<THREE.Mesh>(null);
  const ringMat = useRef<THREE.MeshBasicMaterial>(null);
  const seen = useRef(burst);
  const life = useRef(0);
  const color = METAL[alliance];

  useFrame((_, delta) => {
    if (seen.current !== burst) {
      seen.current = burst;
      if (hot) life.current = 1;
    }
    life.current = Math.max(0, life.current - delta * 0.85);
    if (shaft.current) {
      const target = height * (1 + life.current * 0.22);
      shaft.current.scale.y = THREE.MathUtils.damp(shaft.current.scale.y, target, hot ? 7 : 3.2, delta);
    }
    if (metal.current) {
      const glow = (hot ? 0.85 : 0.22) + life.current * 1.4;
      metal.current.emissiveIntensity = THREE.MathUtils.damp(metal.current.emissiveIntensity, glow, 4, delta);
    }
    if (ring.current && ringMat.current) {
      const spread = 0.7 + (1 - life.current) * 2.4;
      ring.current.scale.setScalar(spread);
      ringMat.current.opacity = life.current * 0.85;
    }
  });

  return (
    <group position={[x, 0, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[0.72, 0.98, 48]} />
        <meshBasicMaterial color={color} transparent opacity={hot ? 0.55 : 0.28} />
      </mesh>
      <mesh ref={ring} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
        <ringGeometry args={[0.5, 0.62, 48]} />
        <meshBasicMaterial ref={ringMat} color="#fff6ea" transparent opacity={0} />
      </mesh>
      <mesh position={[0, 0.08, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.72, 0.84, 0.16, 48]} />
        <meshStandardMaterial color={color} metalness={0.86} roughness={0.24} emissive={color} emissiveIntensity={0.18} />
      </mesh>
      <pointLight position={[0, height * 0.55 + 0.4, 0.4]} color={color} intensity={hot ? 8 : 2.2} distance={4.5} />
      <group ref={shaft} position={[0, 0.16, 0]}>
        <mesh position={[0, 0.5, 0]} castShadow>
          <cylinderGeometry args={[0.42, 0.5, 1, 48]} />
          <meshStandardMaterial
            ref={metal}
            color={color}
            metalness={0.92}
            roughness={0.18}
            emissive={color}
            emissiveIntensity={0.22}
          />
        </mesh>
        <mesh position={[0, 1.04, 0]} castShadow>
          <sphereGeometry args={[0.28, 32, 24]} />
          <meshStandardMaterial color="#fff8ee" emissive={color} emissiveIntensity={hot ? 1.2 : 0.35} metalness={0.4} roughness={0.2} />
        </mesh>
      </group>
    </group>
  );
}

function Aim() {
  const camera = useThree((state) => state.camera);
  useFrame(() => {
    camera.lookAt(0, 2.15, 0);
  });
  return null;
}

function Hall({
  scores,
  hot,
  burst,
}: {
  scores: Record<string, number>;
  hot: AllianceId | null;
  burst: number;
}) {
  const peak = Math.max(...ORDER.map((id) => scores[id] ?? 0), 1);
  const heights = useMemo(
    () =>
      Object.fromEntries(
        ORDER.map((id) => [id, 1.05 + ((scores[id] ?? 0) / peak) * 2.45])
      ) as Record<AllianceId, number>,
    [scores, peak]
  );

  return (
    <>
      <hemisphereLight args={["#242833", "#050506", 0.45]} />
      <spotLight
        position={[0, 7.5, 4.5]}
        angle={0.55}
        penumbra={0.85}
        intensity={28}
        color="#fff6ea"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <spotLight position={[-4.5, 4, 1]} angle={0.6} penumbra={1} intensity={10} color="#e7c27a" />
      <spotLight position={[4.2, 3.5, 1]} angle={0.6} penumbra={1} intensity={8} color="#ffd0dc" />
      {ORDER.map((id, index) => (
        <Column key={id} alliance={id} height={heights[id]} x={(index - 1) * 2.15} hot={hot === id} burst={burst} />
      ))}
      <ContactShadows opacity={0.28} scale={7} blur={2.8} far={2.4} color="#000000" />
    </>
  );
}

export default function Arena({
  scores,
  hot,
  burst = 0,
}: {
  scores: Record<string, number>;
  hot: AllianceId | null;
  burst?: number;
}) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.6]}
      camera={{ position: [0, 2.4, 12.4], fov: 28 }}
      gl={{ alpha: true, antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.08 }}
      onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
    >
      <Aim />
      <Hall scores={scores} hot={hot} burst={burst} />
    </Canvas>
  );
}
