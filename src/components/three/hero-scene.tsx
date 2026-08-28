"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, PresentationControls, useGLTF, useProgress } from "@react-three/drei";
import { Suspense, useRef, useSyncExternalStore } from "react";
import type { Group } from "three";

const MODELS = {
  portal: "/models/portal.glb",
  rick: "/models/rick.glb",
  morty: "/models/morty.glb",
} as const;

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void) {
  const mq = window.matchMedia(REDUCED_MOTION);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false,
  );
}

function Model({
  url,
  position,
  scale = 1,
  rotation = [0, 0, 0],
}: {
  url: string;
  position: [number, number, number];
  scale?: number;
  rotation?: [number, number, number];
}) {
  const { scene } = useGLTF(url, false);
  return <primitive object={scene} position={position} scale={scale} rotation={rotation} />;
}

/** The whole composition slowly sways; the portal light breathes. */
function Composition({ animate }: { animate: boolean }) {
  const group = useRef<Group>(null);
  const light = useRef<{ intensity: number }>(null);

  useFrame(({ clock }) => {
    if (!animate) return;
    const t = clock.getElapsedTime();
    if (group.current) group.current.rotation.y = Math.sin(t * 0.25) * 0.12;
    if (light.current) light.current.intensity = 6 + Math.sin(t * 2.2) * 1.5;
  });

  return (
    <group ref={group} position={[0, -0.15, 0]}>
      <Model url={MODELS.portal} position={[0, 0.12, -0.7]} scale={1.35} />
      <pointLight ref={light} position={[0, 0.2, -0.2]} color="#97ce4c" intensity={6} distance={5} decay={2} />

      <Float speed={animate ? 1.6 : 0} rotationIntensity={0.15} floatIntensity={0.35}>
        <Model url={MODELS.rick} position={[-0.92, 0, 0.2]} rotation={[0, 0.35, 0]} />
      </Float>
      <Float speed={animate ? 1.9 : 0} rotationIntensity={0.15} floatIntensity={0.35}>
        <Model url={MODELS.morty} position={[0.92, -0.14, 0.2]} scale={0.85} rotation={[0, -0.35, 0]} />
      </Float>
    </group>
  );
}

function LoadingOverlay() {
  // useProgress keeps progress at 100 once everything is loaded — no local state needed.
  const { active, progress } = useProgress();
  if (!active && progress === 100) return null;
  return (
    <div
      aria-busy="true"
      aria-label="Загрузка 3D-сцены"
      className="skeleton absolute inset-0 flex items-end justify-center rounded-card p-4"
    >
      <span className="font-mono text-[11px] text-muted">{Math.round(progress)}%</span>
    </div>
  );
}

export default function HeroScene() {
  const reduced = useReducedMotion();

  return (
    <div className="relative h-full w-full touch-none">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0.3, 4.8], fov: 34 }}
        frameloop={reduced ? "demand" : "always"}
        gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
        aria-label="3D-сцена: Рик и Морти у портала"
        className="rounded-card"
      >
        <ambientLight intensity={0.55} />
        <directionalLight position={[3, 4, 5]} intensity={1.6} />
        <directionalLight position={[-4, 2, -2]} intensity={0.5} color="#7fd9d9" />

        <Suspense fallback={null}>
          <PresentationControls
            global
            snap
            speed={1.2}
            polar={[-0.15, 0.25]}
            azimuth={[-0.6, 0.6]}
            cursor
          >
            <Composition animate={!reduced} />
          </PresentationControls>
        </Suspense>
      </Canvas>
      <LoadingOverlay />
    </div>
  );
}

useGLTF.preload(MODELS.portal, false);
useGLTF.preload(MODELS.rick, false);
useGLTF.preload(MODELS.morty, false);
