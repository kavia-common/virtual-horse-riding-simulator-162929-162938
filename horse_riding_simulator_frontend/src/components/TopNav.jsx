import React from 'react';
import useGameStore from '../state/gameStore';

// PUBLIC_INTERFACE
export default function TopNav() {
  /** Top navigation bar with brand, quality selector, and utility actions. */
  const { quality, setQuality, resetGame } = useGameStore();

  return (
    <header className="topbar">
      <div className="brand" aria-label="Brand">
        <div className="logo" />
        Horse Riding Simulator
      </div>
      <div className="top-actions">
        <select
          className="select"
          value={quality}
          onChange={(e) => setQuality(e.target.value)}
          aria-label="Graphics Quality"
        >
          <option value="low">Low Quality</option>
          <option value="medium">Medium Quality</option>
          <option value="high">High Quality</option>
        </select>
        <button className="btn ghost" onClick={resetGame} aria-label="Reset Game">Reset</button>
        <a className="btn primary" href="#" onClick={(e)=>e.preventDefault()} aria-label="Leaderboard">Leaderboard</a>
      </div>
    </header>
  );
}
