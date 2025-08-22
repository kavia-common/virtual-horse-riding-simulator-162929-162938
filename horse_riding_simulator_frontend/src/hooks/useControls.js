import { useEffect, useRef } from 'react';
import useGameStore from '../state/gameStore';

/**
 * Keyboard controls hook
 * W/S: forward/backward
 * A/D: left/right (turn)
 * Shift: sprint
 */
export function useControls() {
  const state = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
    sprint: false,
  });

  const { markTutorialDone, setLastInputAt } = useGameStore.getState();

  useEffect(() => {
    const down = (e) => {
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          state.current.forward = true;
          markTutorialDone('move');
          break;
        case 'KeyS':
        case 'ArrowDown':
          state.current.backward = true;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          state.current.left = true;
          markTutorialDone('turn');
          break;
        case 'KeyD':
        case 'ArrowRight':
          state.current.right = true;
          markTutorialDone('turn');
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          state.current.sprint = true;
          markTutorialDone('sprint');
          break;
        default:
          break;
      }
      setLastInputAt(Date.now());
    };

    const up = (e) => {
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          state.current.forward = false;
          break;
        case 'KeyS':
        case 'ArrowDown':
          state.current.backward = false;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          state.current.left = false;
          break;
        case 'KeyD':
        case 'ArrowRight':
          state.current.right = false;
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          state.current.sprint = false;
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, []);

  return state.current;
}
