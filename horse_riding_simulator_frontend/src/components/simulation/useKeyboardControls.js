import { useEffect } from 'react';
import useGameStore from '../../store/gameStore';

/**
 * Attaches WASD keyboard listeners to update the movement input state.
 */
export default function useKeyboardControls() {
  const setInput = useGameStore(s => s.setInput);

  useEffect(() => {
    const down = (e) => {
      const k = e.key.toLowerCase();
      if (k === 'w' || k === 'arrowup') setInput({ forward: true });
      if (k === 's' || k === 'arrowdown') setInput({ back: true });
      if (k === 'a' || k === 'arrowleft') setInput({ left: true });
      if (k === 'd' || k === 'arrowright') setInput({ right: true });
    };
    const up = (e) => {
      const k = e.key.toLowerCase();
      if (k === 'w' || k === 'arrowup') setInput({ forward: false });
      if (k === 's' || k === 'arrowdown') setInput({ back: false });
      if (k === 'a' || k === 'arrowleft') setInput({ left: false });
      if (k === 'd' || k === 'arrowright') setInput({ right: false });
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, [setInput]);
}
