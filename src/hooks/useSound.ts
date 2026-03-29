import { useCallback, useRef } from 'react';
import clickSound from '../assets/click.wav';
import pointSound from '../assets/pointgained.wav';

export const useSound = () => {
  const clickAudioRef = useRef<HTMLAudioElement | null>(null);
  const pointAudioRef = useRef<HTMLAudioElement | null>(null);

  const playClick = useCallback(() => {
    if (!clickAudioRef.current) {
      clickAudioRef.current = new Audio(clickSound);
      clickAudioRef.current.volume = 0.5;
    }
    clickAudioRef.current.currentTime = 0;
    clickAudioRef.current.play().catch(() => {});
  }, []);

  const playPointGained = useCallback(() => {
    try {
      const audio = new Audio(pointSound);
      audio.volume = 0.6;
      audio.play().catch(err => console.warn('Point sound playback failed:', err));
    } catch (e) {
      console.error('Error playing point sound:', e);
    }
  }, []);

  return { playClick, playPointGained };
};
