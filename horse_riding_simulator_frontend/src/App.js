import React from 'react';
import './App.css';
import TopNav from './components/layout/TopNav';
import Sidebar from './components/layout/Sidebar';
import Simulation from './components/simulation/Simulation';
import ControlsBar from './components/layout/ControlsBar';
import useGameStore from './store/gameStore';

// PUBLIC_INTERFACE
export default function App() {
  /** The main application shell: top navigation, sidebar, 3D simulation area and a bottom controls bar. */
  const theme = 'light'; // fixed light theme per requirements

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const { score, speed, stamina } = useGameStore(state => ({
    score: state.score,
    speed: state.speed,
    stamina: state.stamina
  }));

  return (
    <div className="app-shell">
      <TopNav />
      <Sidebar />
      <main className="main">
        <div className="canvas-wrap">
          <Simulation />
          <div className="hud">
            <div className="hud-top">
              <div className="hud-chip"><span className="badge">Score</span><span className="score">{score}</span></div>
              <div className="hud-chip"><span className="badge">Speed</span><span className="speed">{speed.toFixed(1)} m/s</span></div>
              <div className="hud-chip"><span className="badge">Stamina</span><span className="stamina">{Math.round(stamina)}%</span></div>
            </div>
          </div>
        </div>
        <ControlsBar />
      </main>
    </div>
  );
}
