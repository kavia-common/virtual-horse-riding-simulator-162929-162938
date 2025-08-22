import React from 'react';
import useGameStore from '../../store/gameStore';

// PUBLIC_INTERFACE
export default function ControlsBar() {
  /** Bottom controls bar with on-screen movement and actions for mobile/desktop users.
   * Summary: D-Pad and action buttons for touch and mouse input.
   * Returns: JSX.Element
   */
  const setInput = useGameStore(s => s.setInput);
  const { stamina, setStamina } = useGameStore(s => ({ stamina: s.stamina, setStamina: s.setStamina }));

  const press = (key, pressed) => () => setInput({ [key]: pressed });

  const jump = () => {
    alert('Jump! (demo). Add obstacle/jump logic in physics loop.');
  };
  const rest = () => {
    // slowly recover stamina in demo
    setStamina(Math.min(100, stamina + 10));
  };

  return (
    <div className="controls-bar" role="region" aria-label="On-screen controls">
      <div className="movement">
        <div className="dpad"
          onContextMenu={(e)=>e.preventDefault()}
        >
          <div />
          <div className="dbtn" onMouseDown={press('forward', true)} onMouseUp={press('forward', false)} onTouchStart={press('forward', true)} onTouchEnd={press('forward', false)}>▲</div>
          <div />
          <div className="dbtn" onMouseDown={press('left', true)} onMouseUp={press('left', false)} onTouchStart={press('left', true)} onTouchEnd={press('left', false)}>◀</div>
          <div className="dbtn" onMouseDown={press('back', true)} onMouseUp={press('back', false)} onTouchStart={press('back', true)} onTouchEnd={press('back', false)}>▼</div>
          <div className="dbtn" onMouseDown={press('right', true)} onMouseUp={press('right', false)} onTouchStart={press('right', true)} onTouchEnd={press('right', false)}>▶</div>
          <div />
        </div>
        <div className="action-row">
          <button className="action-btn" onClick={jump}>Jump ⤴</button>
          <button className="action-btn secondary" onClick={rest}>Rest ☕</button>
        </div>
      </div>

      <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
        <span className="hud-chip"><span className="badge">Hint</span>Use WASD keys to move</span>
      </div>
    </div>
  );
}
