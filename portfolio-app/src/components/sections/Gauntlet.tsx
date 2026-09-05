"use client";

import { Suspense, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, useGLTF } from "@react-three/drei";
import { Color, Group, Mesh, MeshStandardMaterial, SpotLight, Vector3 } from "three";
import type { MotionValue } from "motion/react";
import { stones, STOPS } from "@/data/stones";

const MODEL = "/models/gauntlet.glb";

// Pose constants. Tuned by eye in the browser; keep them all here.
const GROUP_POS = new Vector3(0.7, -0.15, 0); // fist sits centre-right of the viewport
const ENTER_FROM_Y = -2.6; // intro: gauntlet rises from below
const ROT_X_START = -0.9; // knuckles tilted toward the viewer, fist low
const ROT_Y_SWEEP = 0.6; // slow turn across the whole section
const TUMBLE = 0.03; // idle wobble amplitude, radians
// Stone offset at full lift, in the GLB's local Z-up frame (see file comment).
const LIFT = new Vector3(-0.35, -0.6, 0.12);
const LIFT_SCALE = 3;
const BOB = 0.02;
const EMISSIVE_DIM = 0.2;
const EMISSIVE_CLAIMED = 0.8;
const EMISSIVE_LIFT = 2.5;
const RIM_IDLE = new Color("#ffffff");

const GOLD = new MeshStandardMaterial({ color: "#c9a24a", metalness: 1, roughness: 0.35 });

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (v: number) => {
  const t = clamp01(v);
  return t * t * (3 - 2 * t);
};
/** Lift for local stop progress t: rise 0 to 0.25, hold to 0.75, return to 1. */
const liftOf = (t: number) => (t < 0.25 ? smooth(t / 0.25) : t < 0.75 ? 1 : smooth((1 - t) / 0.25));

export function Gauntlet({ progress }: { progress: MotionValue<number> }) {
  // dpr 1 below md, up to 1.5 on desktop. Safe to read window here: WebGLBoundary
  // defers this component to the client, so it never renders on the server.
  const [dpr] = useState<number | [number, number]>(() =>
    window.matchMedia("(min-width: 768px)").matches ? [1, 1.5] : 1,
  );
  return (
    <Canvas
      dpr={dpr}
      camera={{ position: [0, 0.1, 3.4], fov: 35 }}
      gl={{ antialias: true, alpha: true }}
      className="h-full w-full"
    >
      <Suspense fallback={null}>
        <Environment preset="city" />
        <Rig progress={progress} />
      </Suspense>
    </Canvas>
  );
}

type StoneRig = { mesh: Mesh; rest: Vector3; color: Color; material: MeshStandardMaterial };

function Rig({ progress }: { progress: MotionValue<number> }) {
  const { scene } = useGLTF(MODEL);
  const group = useRef<Group>(null);
  const rim = useRef<SpotLight>(null);
  const rimColor = useMemo(() => new Color(), []);

  // useGLTF caches the scene, and WebGLBoundary remounts this canvas every time
  // the section scrolls back into view, so the one-time geometry surgery below
  // is guarded by userData or the stones would drift on every remount.
  const rigs = useMemo<StoneRig[]>(() => {
    scene.traverse((o) => {
      const m = o as Mesh;
      if (m.isMesh && !m.userData.stone) m.material = GOLD;
    });
    return stones.map((s) => {
      const mesh = scene.getObjectByName(s.mesh) as Mesh;
      if (!mesh.userData.stone) {
        const geo = mesh.geometry;
        geo.computeBoundingBox();
        const centre = geo.boundingBox!.getCenter(new Vector3());
        geo.translate(-centre.x, -centre.y, -centre.z);
        mesh.position.copy(centre);
        mesh.material = new MeshStandardMaterial({
          color: s.hex,
          emissive: s.hex,
          emissiveIntensity: EMISSIVE_DIM,
          roughness: 0.15,
          metalness: 0,
        });
        mesh.userData.stone = s.id;
      }
      return {
        mesh,
        rest: mesh.position.clone(),
        color: new Color(s.hex),
        material: mesh.material as MeshStandardMaterial,
      };
    });
  }, [scene]);

  useFrame(({ clock }) => {
    const g = group.current;
    if (!g) return;
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
    g.rotation.y = ROT_Y_SWEEP * p + Math.cos(time * 0.3) * TUMBLE;

    let active = -1;
    let activeLift = 0;
    rigs.forEach(({ mesh, rest, material }, i) => {
      const start = (i + 1) * stop;
      const inStop = p > start && p < start + stop;
      const lift = inStop ? liftOf((p - start) / stop) : 0;
      const claimed = p >= start + stop;

      mesh.position.copy(rest).addScaledVector(LIFT, lift);
      mesh.position.z += Math.sin(time * 2 + i) * BOB * lift; // hold bob, local z is world up
      mesh.scale.setScalar(1 + (LIFT_SCALE - 1) * lift);
      const base = claimed ? EMISSIVE_CLAIMED : EMISSIVE_DIM;
      material.emissiveIntensity = base + (EMISSIVE_LIFT - base) * lift;

      if (lift > activeLift) {
        activeLift = lift;
        active = i;
      }
    });

    if (rim.current) {
      rimColor.copy(RIM_IDLE);
      if (active >= 0) rimColor.lerp(rigs[active].color, activeLift);
      rim.current.color.copy(rimColor);
    }
  });

  return (
    <>
      <spotLight ref={rim} position={[-2.5, 2, 2.5]} intensity={60} angle={0.6} penumbra={0.8} decay={1.5} />
      <group ref={group}>
        <primitive object={scene} />
      </group>
    </>
  );
}

useGLTF.preload(MODEL);
