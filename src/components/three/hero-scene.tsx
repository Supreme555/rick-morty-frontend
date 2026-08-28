"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Float, PresentationControls, useGLTF, useProgress } from "@react-three/drei";
import { useTheme } from "next-themes";
import { Suspense, useMemo, useRef, useSyncExternalStore } from "react";
import { CanvasTexture, type Group } from "three";

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


const FLOOR_Y = -0.96;

/** Soft-edged disc under the characters; colour follows the theme. */
function Floor({ dark, animate }: { dark: boolean; animate: boolean }) {
  // Radial alpha mask so the disc fades into the page instead of ending in a hard edge.
  const alphaMap = useMemo(() => {
    const size = 256;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    const g = ctx.createRadialGradient(size / 2, size / 2, size * 0.15, size / 2, size / 2, size / 2);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.7, "rgba(255,255,255,0.85)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
    return new CanvasTexture(canvas);
  }, []);

  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, FLOOR_Y, 0]}>
        <circleGeometry args={[2.6, 64]} />
        <meshStandardMaterial
          color={dark ? "#22343f" : "#d4ddcd"}
          roughness={0.75}
          metalness={0}
          transparent
          alphaMap={alphaMap}
        />
      </mesh>
      <ContactShadows
        position={[0, FLOOR_Y + 0.005, 0]}
        scale={5.5}
        blur={2.4}
        far={2.4}
        opacity={dark ? 0.9 : 0.55}
        resolution={512}
        frames={animate ? Infinity : 1}
      />
    </>
  );
}

const PORTAL_SCALE = 1.3;

/** The whole composition slowly sways; the portal spins, pulses and its light breathes. */
function Composition({ animate, dark }: { animate: boolean; dark: boolean }) {
  const group = useRef<Group>(null);
  const portal = useRef<Group>(null);
  const light = useRef<{ intensity: number }>(null);

  useFrame(({ clock }) => {
    if (!animate) return;
    const t = clock.getElapsedTime();
    if (group.current) group.current.rotation.y = Math.sin(t * 0.25) * 0.12;
    if (portal.current) {
      // Swirl: steady spin with a slow wobble, plus a gentle pulse in sync with the light.
      portal.current.rotation.z = -t * 0.35 + Math.sin(t * 0.9) * 0.08;
      const pulse = 1 + Math.sin(t * 2.2) * 0.025;
      portal.current.scale.setScalar(PORTAL_SCALE * pulse);
    }
    if (light.current) light.current.intensity = 6 + Math.sin(t * 2.2) * 1.5;
  });

  return (
    <group ref={group} position={[0, -0.1, 0]}>
      <Floor dark={dark} animate={animate} />
      <group ref={portal} position={[0, 0.27, -0.7]} scale={PORTAL_SCALE}>
        <Model url={MODELS.portal} position={[0, 0, 0]} />
      </group>
      <pointLight ref={light} position={[0, 0.2, -0.2]} color="#97ce4c" intensity={6} distance={5} decay={2} />

      <Float speed={animate ? 1.6 : 0} rotationIntensity={0.08} floatIntensity={0.12}>
        <Model url={MODELS.rick} position={[-0.92, 0, 0.2]} rotation={[0, 0.35, 0]} />
      </Float>
      <Float speed={animate ? 1.9 : 0} rotationIntensity={0.08} floatIntensity={0.12}>
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
  const { resolvedTheme } = useTheme();
  const dark = resolvedTheme === "dark";

  return (
    <div className="relative h-full w-full touch-none">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0.75, 4.9], fov: 34 }}
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
            <Composition animate={!reduced} dark={dark} />
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
