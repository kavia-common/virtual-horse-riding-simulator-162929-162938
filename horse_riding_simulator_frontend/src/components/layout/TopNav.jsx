import React from 'react';
import useGameStore from '../../store/gameStore';

// PUBLIC_INTERFACE
export default function TopNav() {
  /** Top navigation bar: brand, leaderboard and settings actions.
   * Summary: Provides brand identity and quick access actions (leaderboard, tutorial, settings).
   * Returns: JSX.Element
   */
  const handleLeaderboard = () => {
    alert('Leaderboard is not connected to backend yet. Demo only.');
  };
  const handleSettings = () => {
    alert('Settings panel can be extended. Current theme: Light.');
  };
  const toggleTutorial = useGameStore(s => s.toggleTutorial);

  return (
    <header className="topnav" role="banner" aria-label="Top navigation">
      <div className="brand">
        <div className="brand-badge" />
        <div>
          <div className="brand-title">Horse Riding Simulator</div>
          <div style={{ fontSize: 12, color: '#6b7280' }}>Modern 3D Riding Experience</div>
        </div>
      </div>
      <div className="top-actions" role="group" aria-label="Global actions">
        <button className="icon-btn" onClick={toggleTutorial} aria-label="Toggle tutorial">❓ Tutorial</button>
        <button className="icon-btn" onClick={handleLeaderboard} aria-label="Open leaderboard">🏆 Leaderboard</button>
        <button className="primary-btn" onClick={handleSettings} aria-label="Open settings">⚙ Settings</button>
      </div>
    </header>
  );
}
