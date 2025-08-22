const rnd = (min, max) => Math.random() * (max - min) + min;

// PUBLIC_INTERFACE
export function generateCourse() {
  /** Generate a lightweight course with a few checkpoints and obstacles. */
  const checkpoints = Array.from({ length: 8 }).map((_, i) => ({
    id: `CP-${i + 1}`,
    position: [rnd(-25, 25), 0.6, rnd(-25, 25)],
  }));

  const obstacles = Array.from({ length: 12 }).map((_, i) => ({
    id: `OB-${i + 1}`,
    position: [rnd(-18, 18), 0.5, rnd(-18, 18)],
    size: [rnd(0.8, 2.2), rnd(0.6, 1.4), rnd(0.8, 2.2)],
  }));

  return { checkpoints, obstacles };
}
