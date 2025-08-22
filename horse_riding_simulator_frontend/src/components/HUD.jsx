import React from 'react';
import useGameStore from '../state/gameStore';

// PUBLIC_INTERFACE
export default function HUD() {
  /** Heads-up display showing score, progress, and speed. */
  const { score, checkpointsCompleted, totalCheckpoints, velocity, elapsed } = useGameStore();
  const speed = Math.sqrt(velocity[0]*velocity[0]+velocity[2]*velocity[2]);

  return (
    <section className="hud" aria-label="HUD">
      <div className="card">
        <div className="title">Score</div>
        <div className="value">{score}</div>
      </div>
      <div className="card">
        <div className="title">Progress</div>
        <div className="value">{checkpointsCompleted}/{totalCheckpoints} CP</div>
      </div>
      <div className="card">
        <div className="title">Speed</div>
        <div className="value">{speed.toFixed(2)} m/s</div>
      </div>
    </section>
  );
}
