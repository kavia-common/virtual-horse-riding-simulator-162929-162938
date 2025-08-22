import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Sky, Float } from '@react-three/drei';
import useGameStore from '../../store/gameStore';
import useKeyboardControls from './useKeyboardControls';

// PUBLIC_INTERFACE
export default function Simulation() {
  /** The main 3D simulation area using react-three-fiber with a simple horse placeholder and movement loop.
   * Summary: Renders ground, sky, and a stylized horse mesh. Integrates movement based on input and gait.
   * Returns: JSX.Element
   */
  return (
    <Canvas camera={{ position: [6, 4, 8], fov: 55 }} style={{ height: '60vh', minHeight: 360 }}>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 10, 2]} intensity={0.9} castShadow />
      <Sky sunPosition={[5, 2, 1]} turbidity={6} />
      <Ground />
      <Horse />
      <OrbitControls enablePan={false} maxPolarAngle={Math.PI / 2.2} />
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

function Horse() {
  const ref = useRef();
  const { input, gait, setSpeed, setStamina, stamina, addDistance, avatar } = useGameStore(s => ({
    input: s.input, gait: s.gait, setSpeed: s.setSpeed, setStamina: s.setStamina, stamina: s.stamina, addDistance: s.addDistance, avatar: s.avatar
  }));

  useKeyboardControls(); // attach keyboard listeners to update input

  // gait parameters
  const gaitMeta = {
    walk: { speed: 1.5, drain: 0.02 },
    trot: { speed: 3.2, drain: 0.05 },
    canter: { speed: 5.0, drain: 0.09 },
    gallop: { speed: 8.0, drain: 0.16 },
  };

  useFrame((_, dt) => {
    const { forward, back, left, right } = input;
    const meta = gaitMeta[gait] || gaitMeta.walk;

    // desired speed based on input
    let target = 0;
    if (forward) target = meta.speed;
    if (back) target = -meta.speed * 0.5;

    // apply stamina drain if moving forward
    if (forward) setStamina(stamina - meta.drain);
    else setStamina(Math.min(100, stamina + 0.05)); // passive regen

    // integrate position
    if (ref.current) {
      const dir = new window.THREE.Vector3();
      if (forward || back) {
        const move = target * dt;
        dir.set(0, 0, forward ? -1 : 1).applyEuler(ref.current.rotation);
        ref.current.position.addScaledVector(dir, Math.abs(move));
        addDistance(Math.abs(move));
      }
      if (left) ref.current.rotation.y += 1.5 * dt;
      if (right) ref.current.rotation.y -= 1.5 * dt;

      // slight bobbing to simulate gait
      ref.current.position.y = 0.8 + Math.sin(performance.now() / 250) * 0.02;
    }

    setSpeed(Math.abs(target));
  });

  // Stylized "low-poly" placeholder horse using primitive shapes
  return (
    <group ref={ref} position={[0, 0.8, 0]}>
      <Float floatIntensity={0.5} rotationIntensity={0.1} speed={1}>
        <mesh castShadow position={[0, 0.6, 0]}>
          <boxGeometry args={[1.4, 0.6, 0.4]} />
          <meshStandardMaterial color={avatar.horseColor} roughness={0.8} metalness={0.1} />
        </mesh>
        <mesh castShadow position={[0.6, 0.95, 0]}>
          <boxGeometry args={[0.4, 0.3, 0.3]} />
          <meshStandardMaterial color={avatar.horseColor} />
        </mesh>
        {/* Mane */}
        <mesh castShadow position={[0.4, 1.05, 0]}>
          <boxGeometry args={[0.5, 0.08, 0.32]} />
          <meshStandardMaterial color={avatar.maneColor} />
        </mesh>
        {/* Legs */}
        {[[-0.5, 0.3, 0.15], [-0.5, 0.3, -0.15], [0.5, 0.3, 0.15], [0.5, 0.3, -0.15]].map((p, i) => (
          <mesh key={i} castShadow position={p}>
            <boxGeometry args={[0.12, 0.5, 0.12]} />
            <meshStandardMaterial color={avatar.horseColor} />
          </mesh>
        ))}
        {/* Simple saddle to reflect rider outfit */}
        <mesh castShadow position={[0.1, 0.9, 0]}>
          <boxGeometry args={[0.6, 0.06, 0.42]} />
          <meshStandardMaterial color={avatar.riderOutfit === 'Royal' ? '#5b21b6' : avatar.riderOutfit === 'Sport' ? '#0ea5e9' : avatar.riderOutfit === 'Trail' ? '#065f46' : '#4b5563'} />
        </mesh>
      </Float>
    </group>
  );
}
