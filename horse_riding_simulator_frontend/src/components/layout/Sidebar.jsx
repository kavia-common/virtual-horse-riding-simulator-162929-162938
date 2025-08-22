import React from 'react';
import useGameStore from '../../store/gameStore';
import Tutorials from '../tutorials/Tutorials';

// PUBLIC_INTERFACE
export default function Sidebar() {
  /** Sidebar housing controls and tutorials.
   * Summary: Controls for gait and avatar customization, plus interactive tutorials.
   * Returns: JSX.Element
   */
  const { gait, setGait, avatar, setAvatar, tutorial } = useGameStore(s => ({
    gait: s.gait,
    setGait: s.setGait,
    avatar: s.avatar,
    setAvatar: s.setAvatar,
    tutorial: s.tutorial,
  }));

  return (
    <aside className="sidebar" role="complementary" aria-label="Controls and tutorials">
      <div className="card">
        <div className="section-title">🎮 Movement & Gaits</div>
        <div className="control-row">
          <label htmlFor="gait">Gait</label>
          <select id="gait" className="select" value={gait} onChange={(e) => setGait(e.target.value)}>
            <option value="walk">Walk</option>
            <option value="trot">Trot</option>
            <option value="canter">Canter</option>
            <option value="gallop">Gallop</option>
          </select>
        </div>
        <div className="tutorial-step">Tip: Faster gaits increase speed but drain stamina quicker.</div>
      </div>

      <div className="card">
        <div className="section-title">🧑‍🎨 Avatar Customization</div>
        <div className="control-row">
          <label htmlFor="horseColor">Horse Color</label>
          <input id="horseColor" className="text" type="color" value={avatar.horseColor} onChange={(e)=>setAvatar({ horseColor: e.target.value })} />
        </div>
        <div className="control-row">
          <label htmlFor="maneColor">Mane Color</label>
          <input id="maneColor" className="text" type="color" value={avatar.maneColor} onChange={(e)=>setAvatar({ maneColor: e.target.value })} />
        </div>
        <div className="control-row">
          <label htmlFor="outfit">Rider Outfit</label>
          <select id="outfit" className="select" value={avatar.riderOutfit} onChange={(e)=>setAvatar({ riderOutfit: e.target.value })}>
            <option>Classic</option>
            <option>Sport</option>
            <option>Royal</option>
            <option>Trail</option>
          </select>
        </div>
      </div>

      <div className="card">
        <div className="section-title">📘 Tutorials</div>
        {tutorial?.active ? <Tutorials /> : <div className="tutorial-step">Tutorial is hidden. Toggle from the top bar.</div>}
      </div>
    </aside>
  );
}
