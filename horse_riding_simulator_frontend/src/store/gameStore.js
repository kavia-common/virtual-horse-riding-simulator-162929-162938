import { create } from 'zustand';

/**
 * Global game state using Zustand, holding movement, gameplay stats, avatar customization, and tutorial state.
 */
const useGameStore = create((set, get) => ({
  // Core gameplay metrics
  score: 0,
  speed: 0,        // meters per second (display)
  stamina: 100,    // 0..100
  distance: 0,     // meters traveled

  // Movement input state
  input: { forward: false, back: false, left: false, right: false },
  // Gait: walk / trot / canter / gallop influences speed multiplier and stamina drain
  gait: 'walk',

  // Avatar customization
  avatar: {
    horseColor: '#8B5A2B',
    maneColor: '#3b2f2f',
    riderOutfit: 'Classic',
  },

  // Tutorial
  tutorial: {
    active: true,
    step: 0,
    steps: [
      { title: 'Welcome', text: 'Use WASD or on-screen controls to move your horse.' },
      { title: 'Gaits', text: 'Change gaits to increase speed. Faster gaits drain stamina.' },
      { title: 'Scoring', text: 'Score increases with distance. Keep an eye on stamina!' },
      { title: 'Customize', text: 'Use the sidebar to customize your horse and rider.' },
    ],
  },

  // Actions
  setInput: (partial) => set((state) => ({ input: { ...state.input, ...partial } })),
  setGait: (gait) => set({ gait }),
  setAvatar: (partial) => set((state) => ({ avatar: { ...state.avatar, ...partial } })),
  addScore: (amount) => set((state) => ({ score: Math.max(0, state.score + amount) })),
  setSpeed: (val) => set({ speed: Math.max(0, val) }),
  setStamina: (val) => set({ stamina: Math.min(100, Math.max(0, val)) }),
  addDistance: (d) => set((state) => ({ distance: Math.max(0, state.distance + d) })),

  // Tutorial nav
  nextTutorial: () => set((state) => {
    const next = Math.min(state.tutorial.step + 1, state.tutorial.steps.length - 1);
    return { tutorial: { ...state.tutorial, step: next } };
  }),
  prevTutorial: () => set((state) => {
    const prev = Math.max(state.tutorial.step - 1, 0);
    return { tutorial: { ...state.tutorial, step: prev } };
  }),
  toggleTutorial: () => set((state) => ({ tutorial: { ...state.tutorial, active: !state.tutorial.active } })),
}));

export default useGameStore;
