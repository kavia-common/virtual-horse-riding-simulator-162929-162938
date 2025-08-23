import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html, Sky } from '@react-three/drei';
import useGameStore from '../../store/gameStore';
import useKeyboardControls from './useKeyboardControls';

/**
 * A chase camera positioned very close and low behind the horse for a third-person view.
 * Camera hugs the rear with smoothing, looking slightly above the back.
 */
function ChaseCamera({ targetRef, offset = [0, 1.4, 3.2], stiffness = 0.22, lookAtOffset = [0, 1.1, -0.2] }) {
  const { camera } = useThree();
  const desired = useRef(new window.THREE.Vector3());
  const tmp = useRef(new window.THREE.Vector3());
  const up = useMemo(() => new window.THREE.Vector3(0, 1, 0), []);

  useFrame((_, dt) => {
    if (!targetRef?.current) return;

    const horse = targetRef.current;
    const worldPos = tmp.current.copy(horse.position);

    // Place the camera slightly above and close behind the horse, aligned to its rotation
    const back = new window.THREE.Vector3(0, 0, 1).applyEuler(horse.rotation).normalize(); // back direction in world
    const lateral = new window.THREE.Vector3(1, 0, 0).applyEuler(horse.rotation).normalize();

    desired.current
      .copy(worldPos)
      .addScaledVector(up, offset[1])      // raise camera
      .addScaledVector(back, offset[2])    // behind
      .addScaledVector(lateral, offset[0]); // side shift if needed

    // Smooth follow
    const lerpAlpha = 1 - Math.pow(1 - stiffness, dt * 60);
    camera.position.lerp(desired.current, Math.min(1, lerpAlpha));

    // Look a bit ahead above the horse's back for visibility
    const lookTarget = tmp.current.copy(worldPos).add(new window.THREE.Vector3(...lookAtOffset).applyEuler(horse.rotation));
    camera.lookAt(lookTarget);
  });

  return null;
}

// PUBLIC_INTERFACE
export default function Simulation() {
  /** The main 3D simulation area using react-three-fiber with a simple horse placeholder and movement loop.
   * Summary: Renders ground, sky, and a stylized horse mesh. Integrates movement-based animation and close third-person camera.
   * Returns: JSX.Element
   */
  const horseRef = useRef();

  return (
    <Canvas camera={{ position: [0, 1.4, 3.2], fov: 60 }} style={{ height: '60vh', minHeight: 360 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 2]} intensity={0.9} castShadow />
      <Sky sunPosition={[5, 2, 1]} turbidity={6} />
      <Ground />
      <Horse ref={horseRef} />
      {/* Third-person chase camera, close and low behind the horse */}
      <ChaseCamera targetRef={horseRef} offset={[0, 1.4, 3.2]} lookAtOffset={[0, 1.1, 0.4]} />
      <Html position={[0, 0.02, 0]} distanceFactor={12}>
        <div className="hud-chip" style={{ pointerEvents: 'none' }}>
          Training Arena
        </div>
      </Html>
    </Canvas>
  );
}

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[200, 200]} />
      <meshStandardMaterial color="#98d48e" />
    </mesh>
  );
}

/**
 * Stylized "low-poly" placeholder horse using primitive shapes with simple gait animation.
 * Legs animate when the horse moves, and head/torso bob slightly based on gait speed.
 */
const Horse = React.forwardRef(function Horse(_, ref) {
  const localRef = useRef();
  const rootRef = ref || localRef;

  const bodyRef = useRef();
  const headRef = useRef();
  const legRefs = useRef([React.createRef(), React.createRef(), React.createRef(), React.createRef()]); // FL, FR, RL, RR

  const { input, gait, setSpeed, setStamina, stamina, addDistance, avatar } = useGameStore(s => ({
    input: s.input, gait: s.gait, setSpeed: s.setSpeed, setStamina: s.setStamina, stamina: s.stamina, addDistance: s.addDistance, avatar: s.avatar
  }));

  useKeyboardControls(); // attach keyboard listeners to update input

  // gait parameters and animation frequencies
  const gaitMeta = {
    walk:   { speed: 1.5, drain: 0.02, freq: 2.2, amp: 0.35 },
    trot:   { speed: 3.2, drain: 0.05, freq: 3.2, amp: 0.45 },
    canter: { speed: 5.0, drain: 0.09, freq: 4.4, amp: 0.55 },
    gallop: { speed: 8.0, drain: 0.16, freq: 6.0, amp: 0.65 },
  };

  useFrame((_, dt) => {
    const { forward, back, left, right } = input;
    const meta = gaitMeta[gait] || gaitMeta.walk;

    // desired speed based on input
    let target = 0;
    if (forward) target = meta.speed;
    if (back) target = -meta.speed * 0.5;

    // stamina management
    if (forward) setStamina(stamina - meta.drain);
    else setStamina(Math.min(100, stamina + 0.05)); // passive regen

    if (rootRef.current) {
      // Movement integration
      const dir = new window.THREE.Vector3();
      if (forward || back) {
        const move = target * dt;
        dir.set(0, 0, forward ? -1 : 1).applyEuler(rootRef.current.rotation);
        rootRef.current.position.addScaledVector(dir, Math.abs(move));
        addDistance(Math.abs(move));
      }
      if (left) rootRef.current.rotation.y += 1.5 * dt;
      if (right) rootRef.current.rotation.y -= 1.5 * dt;

      // Animation logic
      const moving = Math.abs(target) > 0.02;
      const t = performance.now() / 1000;
      const w = meta.freq;  // base step frequency
      const amp = meta.amp; // leg swing amplitude

      // Torso bobbing: subtle when idle, stronger when moving
      const bob = moving ? Math.sin(t * w) * 0.04 : Math.sin(t * 1.5) * 0.01;
      rootRef.current.position.y = 0.8 + bob;

      // Head nodding: correlates with gait frequency when moving; almost still when idle
      if (headRef.current) {
        headRef.current.rotation.x = moving ? Math.sin(t * w) * 0.12 : Math.sin(t * 1.2) * 0.02;
      }

      // Legs: simple pendulum swing. Diagonal pairing for a natural look.
      // Order: 0-FL, 1-FR, 2-RL, 3-RR
      const phases = [0, Math.PI, Math.PI, 0]; // FL in phase with RR; FR with RL
      legRefs.current.forEach((leg, i) => {
        const node = leg.current;
        if (!node) return;
        // Swing only when moving; relax towards neutral when idle
        const targetRot = moving ? Math.sin(t * w + phases[i]) * amp : 0;
        // Smooth approach to target using simple damping
        node.rotation.x += (targetRot - node.rotation.x) * Math.min(1, dt * 10);
      });

      // Body subtle forward tilt when accelerating for a dynamic feel
      if (bodyRef.current) {
        const targetTilt = moving ? -0.06 : 0;
        bodyRef.current.rotation.x += (targetTilt - bodyRef.current.rotation.x) * Math.min(1, dt * 5);
      }
    }

    setSpeed(Math.abs(target));
  });

  // Build the horse from parts so we can animate specific nodes cleanly
  return (
    <group ref={rootRef} position={[0, 0.8, 0]}>
      {/* Body */}
      <mesh ref={bodyRef} castShadow position={[0, 0.6, 0]}>
        <boxGeometry args={[1.4, 0.6, 0.4]} />
        <meshStandardMaterial color={avatar.horseColor} roughness={0.8} metalness={0.1} />
      </mesh>

      {/* Head */}
      <mesh ref={headRef} castShadow position={[0.6, 0.95, 0]}>
        <boxGeometry args={[0.4, 0.3, 0.3]} />
        <meshStandardMaterial color={avatar.horseColor} />
      </mesh>

      {/* Mane */}
      <mesh castShadow position={[0.4, 1.05, 0]}>
        <boxGeometry args={[0.5, 0.08, 0.32]} />
        <meshStandardMaterial color={avatar.maneColor} />
      </mesh>

      {/* Legs (as separate meshes for animation) */}
      <mesh ref={legRefs.current[0]} castShadow position={[-0.5, 0.3, 0.15]}>
        <boxGeometry args={[0.12, 0.5, 0.12]} />
        <meshStandardMaterial color={avatar.horseColor} />
      </mesh>
      <mesh ref={legRefs.current[1]} castShadow position={[-0.5, 0.3, -0.15]}>
        <boxGeometry args={[0.12, 0.5, 0.12]} />
        <meshStandardMaterial color={avatar.horseColor} />
      </mesh>
      <mesh ref={legRefs.current[2]} castShadow position={[0.5, 0.3, 0.15]}>
        <boxGeometry args={[0.12, 0.5, 0.12]} />
        <meshStandardMaterial color={avatar.horseColor} />
      </mesh>
      <mesh ref={legRefs.current[3]} castShadow position={[0.5, 0.3, -0.15]}>
        <boxGeometry args={[0.12, 0.5, 0.12]} />
        <meshStandardMaterial color={avatar.horseColor} />
      </mesh>

      {/* Saddle to reflect rider outfit */}
      <mesh castShadow position={[0.1, 0.9, 0]}>
        <boxGeometry args={[0.6, 0.06, 0.42]} />
        <meshStandardMaterial color={avatar.riderOutfit === 'Royal' ? '#5b21b6' : avatar.riderOutfit === 'Sport' ? '#0ea5e9' : avatar.riderOutfit === 'Trail' ? '#065f46' : '#4b5563'} />
      </mesh>
    </group>
  );
});
