"use client";

import { Suspense, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, useGLTF } from "@react-three/drei";
import { Bloom, EffectComposer, ToneMapping } from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import {
  Color,
  Group,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  Quaternion,
  SpotLight,
  Vector3,
} from "three";
import type { MotionValue } from "motion/react";
import { stones, STOPS } from "@/data/stones";

const MODEL = "/models/gauntlet.glb";

// Pose constants. Tuned by eye in the browser; keep them all here.
const GROUP_POS = new Vector3(0.7, -0.15, 0); // fist sits centre-right of the viewport
const ENTER_FROM_Y = -2.6; // intro: gauntlet rises from below
const ROT_X_START = -0.9; // knuckles tilted toward the viewer, fist low
const ROT_Y_SWEEP = 1.3; // turn across the whole section, ending with the thumb toward the viewer
const TUMBLE = 0.03; // idle wobble amplitude, radians
// Stone offset at full lift, in world space (the camera looks down -z from +z):
// -x toward the text, +z toward the viewer. Converted into the gem frame per
// frame so the pose of the fist never changes where a stone floats.
const LIFT = new Vector3(-0.55, -0.02, 0.35);
const LIFT_SCALE = 2.1;
const BOB = 0.02;
// Emissive is HDR: bloom only catches values above the threshold of 1, so the
// gold body never glows while a lifted stone does.
const EMISSIVE_DIM = 0.35;
const EMISSIVE_CLAIMED = 1.2;
const EMISSIVE_LIFT = 2.2;
const RIM_IDLE = new Color("#ffffff");
// The model is 1.77 units long along its up axis with the cuff at 0.
const MODEL_CENTRE_Y = -0.88;
// Gems are cabochons: a sphere squashed along the socket normal, dome centred a
// hair above the painted surface so the dark cap underneath stays hidden at rest.
const GEM_FLATTEN = 0.55;
const GEM_SEAT = 0.03;
const MODEL_SCALE = 1.3;
const UP = new Vector3(0, 1, 0);

const scratchQ = new Quaternion();
const liftLocal = new Vector3();

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (v: number) => {
  const t = clamp01(v);
  return t * t * (3 - 2 * t);
};
/** Lift for local stop progress t: rise 0 to 0.25, hold to 0.75, return to 1. */
const liftOf = (t: number) => (t < 0.25 ? smooth(t / 0.25) : t < 0.75 ? 1 : smooth((1 - t) / 0.25));

export function Gauntlet({ progress }: { progress: MotionValue<number> }) {
  // Desktop gets dpr up to 1.5, MSAA through the composer and bloom; phones get
  // dpr 1 and the plain renderer. Safe to read window here: WebGLBoundary
  // defers this component to the client, so it never renders on the server.
  const [wide] = useState(() => window.matchMedia("(min-width: 768px)").matches);
  return (
    <Canvas
      dpr={wide ? [1, 1.5] : 1}
      camera={{ position: [0, 0.1, 3.4], fov: 35 }}
      gl={{ antialias: !wide, alpha: true }}
      className="h-full w-full"
    >
      <Suspense fallback={null}>
        <Studio />
        <Rig progress={progress} />
      </Suspense>
      {wide && (
        <EffectComposer multisampling={4}>
          <Bloom luminanceThreshold={1} luminanceSmoothing={0.25} intensity={0.7} radius={0.5} mipmapBlur />
          <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
        </EffectComposer>
      )}
    </Canvas>
  );
}

/** Owned studio environment: no CDN fetch, one warm key, cool fill, bounce, rim. */
function Studio() {
  return (
    <>
      <Environment resolution={256} frames={1}>
        <Lightformer intensity={4} color="#ffe2b8" position={[-3, 3, 3]} scale={[4, 3, 1]} target={[0, 0, 0]} />
        <Lightformer intensity={1.2} color="#a9c8ff" position={[4, 0.5, 2]} scale={[2, 4, 1]} target={[0, 0, 0]} />
        <Lightformer intensity={0.5} color="#ffd1a0" position={[0, -3, 2]} scale={[6, 2, 1]} target={[0, 0, 0]} />
        <Lightformer intensity={2} color="#ffffff" position={[1, 2, -4]} scale={[3, 3, 1]} target={[0, 0, 0]} />
      </Environment>
      <ambientLight intensity={0.15} />
      <directionalLight position={[-3, 4, 4]} intensity={2.2} color="#ffe9c9" />
    </>
  );
}

type Placement = { rest: Vector3; orient: Quaternion; color: Color };

function Rig({ progress }: { progress: MotionValue<number> }) {
  const { scene } = useGLTF(MODEL);
  const group = useRef<Group>(null);
  const gemRoot = useRef<Group>(null);
  const rim = useRef<SpotLight>(null);
  const gems = useRef<(Mesh | null)[]>([]);
  const rimColor = useMemo(() => new Color(), []);

  // The model ships a baked colour map and no roughness data; give the paint a
  // metal response so the environment reads on it. Idempotent across remounts.
  useMemo(() => {
    scene.traverse((o) => {
      const m = o as Mesh;
      if (!m.isMesh) return;
      const mat = m.material as MeshStandardMaterial;
      mat.metalness = 0.85;
      mat.roughness = 0.5;
      mat.envMapIntensity = 1;
    });
  }, [scene]);

  // Gem rest positions sit proud of the painted socket along its normal; the
  // dark cap underneath reads as the empty socket once the gem lifts.
  const placements = useMemo<Placement[]>(
    () =>
      stones.map((s) => {
        const n = new Vector3(...s.normal).normalize();
        return {
          rest: new Vector3(...s.socket).addScaledVector(n, s.radius * GEM_SEAT),
          orient: new Quaternion().setFromUnitVectors(UP, n),
          color: new Color(s.hex),
        };
      }),
    [],
  );

  useFrame(({ clock }) => {
    const g = group.current;
    const root = gemRoot.current;
    if (!g || !root) return;
    const p = progress.get();
    const stop = 1 / STOPS;
    const time = clock.elapsedTime;

    // Gauntlet pose: rise in during the intro, tilt up over the first half, sweep, tumble.
    g.position.set(
      GROUP_POS.x,
      ENTER_FROM_Y + (GROUP_POS.y - ENTER_FROM_Y) * smooth(p / stop),
      GROUP_POS.z,
    );
    g.rotation.x = ROT_X_START * (1 - smooth(p / 0.5)) + Math.sin(time * 0.4) * TUMBLE;
    // Negative: the fist turns clockwise (seen from the front) as the visitor scrolls down.
    g.rotation.y = -ROT_Y_SWEEP * p + Math.cos(time * 0.3) * TUMBLE;

    // World-space LIFT expressed in the gem frame (the model's local axes).
    root.getWorldQuaternion(scratchQ).invert();
    liftLocal.copy(LIFT).applyQuaternion(scratchQ);

    let active = -1;
    let activeLift = 0;
    placements.forEach(({ rest }, i) => {
      const mesh = gems.current[i];
      if (!mesh) return;
      const start = (i + 1) * stop;
      const inStop = p > start && p < start + stop;
      const lift = inStop ? liftOf((p - start) / stop) : 0;
      const claimed = p >= start + stop;

      mesh.position.copy(rest).addScaledVector(liftLocal, lift);
      mesh.position.z -= Math.sin(time * 2 + i) * BOB * lift; // hold bob; local -z is world up
      const k = 1 + (LIFT_SCALE - 1) * lift;
      mesh.scale.set(k, k * GEM_FLATTEN, k);
      const base = claimed ? EMISSIVE_CLAIMED : EMISSIVE_DIM;
      (mesh.material as MeshPhysicalMaterial).emissiveIntensity = base + (EMISSIVE_LIFT - base) * lift;

      if (lift > activeLift) {
        activeLift = lift;
        active = i;
      }
    });

    if (rim.current) {
      rimColor.copy(RIM_IDLE);
      if (active >= 0) rimColor.lerp(placements[active].color, activeLift);
      rim.current.color.copy(rimColor);
    }
  });

  return (
    <>
      <spotLight ref={rim} position={[-2.5, 2, 2.5]} intensity={60} angle={0.6} penumbra={0.8} decay={1.5} />
      <group ref={group} scale={MODEL_SCALE}>
        <group position={[0, MODEL_CENTRE_Y, 0]}>
          <primitive object={scene} />
          {/* Same +90deg X rotation as the model's root node, so socket coordinates apply as-is. */}
          <group ref={gemRoot} rotation={[Math.PI / 2, 0, 0]}>
            {stones.map((s, i) => (
              <group key={s.id}>
                <mesh
                  position={s.socket}
                  quaternion={placements[i].orient}
                  scale={[s.radius * 1.2, s.radius * 0.3, s.radius * 1.2]}
                >
                  <sphereGeometry args={[1, 24, 16]} />
                  <meshStandardMaterial color="#120c05" roughness={0.6} metalness={0.4} />
                </mesh>
                <mesh
                  ref={(el) => {
                    gems.current[i] = el;
                  }}
                  position={placements[i].rest}
                  quaternion={placements[i].orient}
                  scale={[1, GEM_FLATTEN, 1]}
                >
                  <sphereGeometry args={[s.radius, 48, 32]} />
                  <meshPhysicalMaterial
                    color={s.hex}
                    emissive={s.hex}
                    emissiveIntensity={EMISSIVE_DIM}
                    roughness={0.12}
                    metalness={0}
                    clearcoat={1}
                    clearcoatRoughness={0.08}
                    ior={1.8}
                    envMapIntensity={1.4}
                  />
                </mesh>
              </group>
            ))}
          </group>
        </group>
      </group>
    </>
  );
}

useGLTF.preload(MODEL);
