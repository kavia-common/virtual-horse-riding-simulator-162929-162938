import React from 'react';
import './App.css';
import TopNav from './components/TopNav';
import Sidebar from './components/Sidebar';
import Simulator from './components/Simulator';
import HUD from './components/HUD';
import useGameStore from './state/gameStore';

// PUBLIC_INTERFACE
function App() {
  /** Root of the Horse Riding Simulator Frontend.
   * Renders the application shell including:
   * - Top navigation (brand, quality, settings)
   * - Sidebar (controls, customization, tutorial)
   * - Main area with 3D scene and HUD cards
   */
  const { score } = useGameStore();

  return (
    <div className="app-shell" aria-label="Horse Riding Simulator Shell">
      <TopNav />
      <aside className="sidebar" aria-label="Sidebar Controls and Tutorials">
        <Sidebar />
      </aside>
      <main className="main" aria-label="Main Simulation Area">
        <div className="canvas-wrap" aria-label="3D Simulation Canvas">
          <Simulator />
        </div>
        <HUD />
      </main>
    </div>
  );
}

export default App;
