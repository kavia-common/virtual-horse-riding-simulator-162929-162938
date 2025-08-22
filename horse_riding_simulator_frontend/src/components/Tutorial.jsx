import React from 'react';
import useGameStore from '../state/gameStore';

// PUBLIC_INTERFACE
export default function Tutorial() {
  /** Interactive tutorial listing basic actions and completion state. */
  const { tutorialSteps } = useGameStore();

  return (
    <div className="tutorial-list">
      {tutorialSteps.map((step) => (
        <div key={step.id} className={`tutorial-step ${step.done ? 'done' : ''}`}>
          <span className="badge">{step.id}</span>
          <div>
            <div style={{ fontWeight: 700 }}>{step.title}</div>
            <div style={{ fontSize: 12, color: '#475069' }}>{step.description}</div>
          </div>
          <div>{step.done ? '✅' : '⬜'}</div>
        </div>
      ))}
    </div>
  );
}
