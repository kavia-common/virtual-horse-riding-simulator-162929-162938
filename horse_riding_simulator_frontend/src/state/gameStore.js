import create from 'zustand';
import { generateCourse } from '../logic/course';

const course = generateCourse();

const initialTutorial = [
  { id: 'move', title: 'Move Forward', description: 'Press W to move forward', done: false },
  { id: 'turn', title: 'Turn Left/Right', description: 'Use A and D to turn the horse', done: false },
  { id: 'sprint', title: 'Sprint', description: 'Hold Shift while moving to sprint', done: false },
  { id: 'checkpoint', title: 'Reach a Checkpoint', description: 'Ride through a checkpoint marker', done: false },
];

// PUBLIC_INTERFACE
const useGameStore = create((set, get) => ({
  // Avatar customization
  horseColor: '#7d5a4f',
  riderColor: '#3B4CCA',

  // Movement and status
  position: [0, 0, 0],
  velocity: [0, 0, 0],
  speedMultiplier: 1.0,
  quality: 'medium',
  lastInputAt: 0,

  // Scoring and progress
  score: 0,
  checkpointsCompleted: 0,
  totalCheckpoints: course.checkpoints.length,
  lastCheckpointId: null,

  // Tutorial
  tutorialSteps: initialTutorial,

  // Actions
  setHorseColor: (color) => set({ horseColor: color }),
  setRiderColor: (color) => set({ riderColor: color }),
  setQuality: (q) => set({ quality: q }),

  setSpeedMultiplier: (m) => set({ speedMultiplier: m }),

  setPosition: (pos) => set({ position: pos }),
  setVelocity: (vel) => set({ velocity: vel }),

  addScore: (delta) => set((state) => ({ score: Math.max(0, state.score + delta) })),

  setCheckpointAchieved: (id) =>
    set((state) => {
      const already = state.lastCheckpointId === id;
      let checkpointsCompleted = state.checkpointsCompleted;
      if (!already) {
        checkpointsCompleted += 1;
      }
      const steps = state.tutorialSteps.map((s) =>
        s.id === 'checkpoint' ? { ...s, done: true } : s
      );
      return {
        lastCheckpointId: id,
        checkpointsCompleted,
        tutorialSteps: steps,
      };
    }),

  markTutorialDone: (id) =>
    set((state) => ({
      tutorialSteps: state.tutorialSteps.map((s) => (s.id === id ? { ...s, done: true } : s)),
    })),

  setLastInputAt: (t) => set({ lastInputAt: t }),

  resetGame: () =>
    set({
      position: [0, 0, 0],
      velocity: [0, 0, 0],
      score: 0,
      checkpointsCompleted: 0,
      lastCheckpointId: null,
      tutorialSteps: initialTutorial.map((s) => ({ ...s, done: false })),
    }),
}));

export default useGameStore;
