import React from 'react';
import useGameStore from '../../store/gameStore';

// PUBLIC_INTERFACE
export default function Tutorials() {
  /** Interactive tutorials with step navigation.
   * Summary: Displays current tutorial step and allows navigation between steps.
   * Returns: JSX.Element
   */
  const { tutorial, nextTutorial, prevTutorial } = useGameStore(s => ({
    tutorial: s.tutorial,
    nextTutorial: s.nextTutorial,
    prevTutorial: s.prevTutorial,
  }));

  const step = tutorial.steps[tutorial.step];

  return (
    <div>
      <div style={{ fontWeight: 800, marginBottom: 6, color: 'var(--color-primary)' }}>{step.title}</div>
      <div className="tutorial-step">{step.text}</div>
      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        <button className="icon-btn" onClick={prevTutorial} disabled={tutorial.step === 0}>← Prev</button>
        <button className="primary-btn accent" onClick={nextTutorial} disabled={tutorial.step === tutorial.steps.length - 1}>Next →</button>
      </div>
      <div style={{ marginTop: 8, fontSize: 12, color: '#6b7280' }}>
        Step {tutorial.step + 1} / {tutorial.steps.length}
      </div>
    </div>
  );
}
