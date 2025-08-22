import React, { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, StatsGl, Sky, PresentationControls } from '@react-three/drei';
import * as THREE from 'three';
import useGameStore from '../state/gameStore';
import { useControls } from '../hooks/useControls';
import { generateCourse } from '../logic/course';

// Simple horse placeholder made of primitives
function Horse({ color = '#7d5a4f' }) {
  const group = useRef();
  // Build a simple low-poly-ish horse using boxes and spheres
  return (
    <group ref={group}>
      {/* Body */}
      <mesh position={[0, 0.75, 0]}>
        <boxGeometry args={[1.8, 0.6, 0.5]} />
        <meshStandardMaterial color={color} roughness={0.7} metalness={0.05} />
      </mesh>
      {/* Neck */}
      <mesh position={[0.7, 1.1, 0]}>
        <boxGeometry args={[0.4, 0.5, 0.4]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Head */}
      <mesh position={[1.0, 1.35, 0]}>
        <boxGeometry args={[0.5, 0.35, 0.35]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Legs */}
      {[-0.6, 0.6].map((x, i) =>
        [-0.16, 0.16].map((z, j) => (
          <mesh key={`${i}-${j}`} position={[x, 0.3, z]}>
            <boxGeometry args={[0.15, 0.6, 0.15]} />
            <meshStandardMaterial color={color} />
          </mesh>
        ))
      )}
      {/* Tail */}
      <mesh position={[-0.9, 0.75, 0]}>
        <cylinderGeometry args={[0.05, 0.15, 0.6, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Saddle */}
      <mesh position={[0.2, 1.05, 0]}>
        <boxGeometry args={[0.7, 0.15, 0.6]} />
        <meshStandardMaterial color={'#432818'} />
      </mesh>
    </group>
  );
}

// Rider placeholder
function Rider({ color = '#3B4CCA' }) {
  return (
    <group position={[0.2, 1.25, 0]}>
      <mesh position={[0, 0.35, 0]}>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh>
        <cylinderGeometry args={[0.16, 0.16, 0.5, 12]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
}

// Course obstacles and checkpoints
function Course({ onCheckpoint }) {
  const course = useMemo(() => generateCourse(), []);
  return (
    <group>
      {/* ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#9fd3c7" />
      </mesh>
      {/* checkpoints */}
      {course.checkpoints.map((cp) => (
        <mesh key={cp.id} position={cp.position} userData={{ type: 'checkpoint', id: cp.id }}>
          <cylinderGeometry args={[0.2, 0.2, 1.2, 12]} />
          <meshStandardMaterial color="#F4A300" emissive="#F4A300" emissiveIntensity={0.1} />
        </mesh>
      ))}
      {/* obstacles */}
      {course.obstacles.map((ob) => (
        <mesh key={ob.id} position={ob.position} userData={{ type: 'obstacle', id: ob.id }}>
          <boxGeometry args={[ob.size[0], ob.size[1], ob.size[2]]} />
          <meshStandardMaterial color="#3B4CCA" opacity={0.9} transparent />
        </mesh>
      ))}
    </group>
  );
}

function HorseController() {
  const ref = useRef();
  const vel = useRef(new THREE.Vector3());
  const dir = useRef(0); // heading in radians
  const forward = useRef(0);
  const turn = useRef(0);

  const {
    setPosition, addScore, setVelocity,
    setCheckpointAchieved, lastCheckpointId,
    horseColor, riderColor, quality,
  } = useGameStore();

  const controls = useControls();

  // movement parameters
  const maxSpeed =  controls.sprint ? 8 : 5;
  const accel =  controls.sprint ? 8 : 5;
  const friction = 2.5;
  const turnSpeed = 1.8;

  // collision temp box
  const tempBox = useRef(new THREE.Box3());

  useFrame((state, delta) => {
    // read controls
    forward.current = (controls.forward ? 1 : 0) - (controls.backward ? 1 : 0);
    turn.current = (controls.left ? 1 : 0) - (controls.right ? 1 : 0);

    // update heading
    dir.current -= turn.current * turnSpeed * delta;

    // update velocity along heading
    const targetSpeed = forward.current * maxSpeed;
    const currentSpeed = vel.current.length();
    const speedDelta = targetSpeed - currentSpeed;
    let newSpeed = currentSpeed + Math.sign(speedDelta) * Math.min(Math.abs(speedDelta), accel * delta);
    newSpeed = Math.max(0, Math.min(newSpeed, maxSpeed));

    // convert speed to vector
    vel.current.set(Math.cos(dir.current), 0, Math.sin(dir.current)).multiplyScalar(newSpeed);

    // apply friction when no input
    if (forward.current === 0) {
      const frictionFactor = Math.max(0, 1 - friction * delta);
      vel.current.multiplyScalar(frictionFactor);
    }

    // update position
    ref.current.position.addScaledVector(vel.current, delta);

    // keep above ground
    ref.current.position.y = 0;

    // rotate visual towards direction if moving
    if (vel.current.lengthSq() > 0.0001) {
      ref.current.rotation.y = -Math.atan2(vel.current.z, vel.current.x);
    }

    // collision detection with scene objects (simple)
    const scene = state.scene;
    const horseBox = new THREE.Box3().setFromObject(ref.current);
    scene.traverse((obj) => {
      if (obj.userData?.type === 'obstacle') {
        tempBox.current.setFromObject(obj);
        if (horseBox.intersectsBox(tempBox.current)) {
          // push back upon collision
          ref.current.position.addScaledVector(vel.current.clone().multiplyScalar(-1), delta * 2);
          addScore(-1);
        }
      }
      if (obj.userData?.type === 'checkpoint') {
        tempBox.current.setFromObject(obj);
        if (horseBox.intersectsBox(tempBox.current)) {
          if (lastCheckpointId !== obj.userData.id) {
            setCheckpointAchieved(obj.userData.id);
            addScore(5);
          }
        }
      }
    });

    // sync store
    setPosition(ref.current.position.toArray());
    setVelocity(vel.current.toArray());
  });

  return (
    <group ref={ref} position={[0, 0, 0]}>
      <Horse color={horseColor} />
      <Rider color={riderColor} />
      {/* helper for performance: level-of-detail for horse materials */}
      {quality !== 'high' && (
        <mesh position={[0, 0, 0]} visible={false}>
          <boxGeometry args={[0.01, 0.01, 0.01]} />
          <meshBasicMaterial color="#fff" />
        </mesh>
      )}
    </group>
  );
}

// PUBLIC_INTERFACE
export default function Simulator() {
  /** 3D canvas hosting the riding environment and the horse controller. */
  const { quality, setQuality } = useGameStore((s) => ({ quality: s.quality, setQuality: s.setQuality }));

  // read default from env
  useEffect(() => {
    const preset = (process.env.REACT_APP_QUALITY_PRESET || 'medium').toLowerCase();
    if (preset === 'low' || preset === 'medium' || preset === 'high') setQuality(preset);
  }, [setQuality]);

  const dpr = quality === 'high' ? [1.5, 2] : quality === 'medium' ? [1, 1.5] : [0.75, 1];

  return (
    <>
      <Canvas
        shadows
        dpr={dpr}
        camera={{ position: [6, 4, 6], fov: 50 }}
      >
        {/* Lights */}
        <hemisphereLight intensity={0.6} color={'#ffffff'} groundColor={'#99ccaa'} />
        <directionalLight
          castShadow
          intensity={1.1}
          position={[6, 8, 2]}
          shadow-mapSize={[1024, 1024]}
        />
        <ambientLight intensity={0.2} />
        <Sky sunPosition={[100, 20, 100]} distance={450000} turbidity={6} rayleigh={1} />
        <fog attach="fog" args={['#e7f0ff', 50, 160]} />

        {/* Scene */}
        <Course />
        <HorseController />

        {/* Camera controls for viewing (locked zoom for UX) */}
        <PresentationControls
          global
          enabled
          polar={[0, Math.PI / 3]}
          azimuth={[-Math.PI / 2.5, Math.PI / 2.5]}
          config={{ mass: 1, tension: 170, friction: 26 }}
          snap={{ mass: 1, tension: 170, friction: 26 }}
        >
          <group />
        </PresentationControls>
        <OrbitControls enablePan enableZoom={false} />
        <StatsGl showPanel={0} className="stats" />
      </Canvas>

      {/* On-canvas overlays */}
      <div className="overlay">
        <div className="help">
          <div><strong>Controls:</strong> <span className="key">W</span>/<span className="key">S</span> Move, <span className="key">A</span>/<span className="key">D</span> Turn, <span className="key">Shift</span> Sprint</div>
        </div>
      </div>
    </>
  );
}
