import React from 'react';
import useGameStore from '../state/gameStore';
import Tutorial from './Tutorial';

// PUBLIC_INTERFACE
export default function Sidebar() {
  /** Sidebar aggregating control hints, customization options, and tutorial steps. */
  const {
    horseColor, setHorseColor,
    riderColor, setRiderColor,
    speedMultiplier, setSpeedMultiplier,
  } = useGameStore();

  return (
    <div>
      <section className="panel">
        <h3>Controls</h3>
        <div className="control">
          <div className="row">
            <span className="label">Move Forward</span>
            <span className="badge">W</span>
          </div>
          <div className="row">
            <span className="label">Turn Left/Right</span>
            <span><span className="badge">A</span> / <span className="badge">D</span></span>
          </div>
          <div className="row">
            <span className="label">Slow down / Reverse</span>
            <span className="badge">S</span>
          </div>
          <div className="row">
            <span className="label">Sprint</span>
            <span className="badge">Shift</span>
          </div>
        </div>
      </section>

      <section className="panel">
        <h3>Customization</h3>
        <div className="control">
          <label className="label" htmlFor="horseColor">Horse Color</label>
          <input
            id="horseColor"
            className="input"
            type="color"
            value={horseColor}
            onChange={(e) => setHorseColor(e.target.value)}
            aria-label="Horse Color"
          />
        </div>
        <div className="control" style={{ marginTop: 10 }}>
          <label className="label" htmlFor="riderColor">Rider Color</label>
          <input
            id="riderColor"
            className="input"
            type="color"
            value={riderColor}
            onChange={(e) => setRiderColor(e.target.value)}
            aria-label="Rider Color"
          />
        </div>
        <div className="control" style={{ marginTop: 10 }}>
          <label className="label" htmlFor="speedMult">Speed Multiplier ({speedMultiplier.toFixed(1)}x)</label>
          <input
            id="speedMult"
            className="range"
            type="range"
            min="0.5"
            max="2.0"
            step="0.1"
            value={speedMultiplier}
            onChange={(e) => setSpeedMultiplier(parseFloat(e.target.value))}
            aria-label="Speed Multiplier"
          />
        </div>
      </section>

      <section className="panel">
        <h3>Interactive Tutorial</h3>
        <Tutorial />
      </section>
    </div>
  );
}
