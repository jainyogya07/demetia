import { useCallback, useEffect, useRef, useState } from 'react';
import {
  DEMO_CITIES,
  computeSpatialMetrics,
  getActiveDemoCity,
  getActiveDemoCityId,
  sampleDemoWalk,
  setActiveDemoCityId,
  subscribeDemoCity,
  trailUpTo,
} from './demoWalk';
import { postDemoCity } from '../lib/bff';

export function useDemoWalk({ autoPlay = false } = {}) {
  const [city, setCityState] = useState(getActiveDemoCity);
  const [enabled, setEnabled] = useState(autoPlay);
  const [playing, setPlaying] = useState(autoPlay);
  const [speed, setSpeed] = useState(1);
  const [progress, setProgress] = useState(0);
  const lastTs = useRef(0);
  const progressRef = useRef(0);
  const playingRef = useRef(playing);
  const speedRef = useRef(speed);
  const enabledRef = useRef(enabled);
  const durationRef = useRef(city.durationMs);

  playingRef.current = playing;
  speedRef.current = speed;
  enabledRef.current = enabled;
  durationRef.current = city.durationMs;

  useEffect(() => subscribeDemoCity((next) => {
    setCityState(next);
    progressRef.current = 0;
    setProgress(0);
    lastTs.current = 0;
    setEnabled(true);
    setPlaying(true);
  }), []);

  useEffect(() => {
    let raf = 0;
    const tick = (ts) => {
      if (!lastTs.current) lastTs.current = ts;
      const dt = ts - lastTs.current;
      lastTs.current = ts;
      if (enabledRef.current && playingRef.current) {
        const dur = durationRef.current || 75000;
        const next = (progressRef.current + (dt * speedRef.current) / dur) % 1;
        progressRef.current = next;
        setProgress(next);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const sample = sampleDemoWalk(progress, city);
  const trail = trailUpTo(progress, city);
  const metrics = computeSpatialMetrics(sample, trail, city);

  const startDemo = useCallback(() => {
    setEnabled(true);
    setPlaying(true);
    lastTs.current = 0;
  }, []);

  const stopDemo = useCallback(() => {
    setEnabled(false);
    setPlaying(false);
    progressRef.current = 0;
    setProgress(0);
  }, []);

  const togglePlay = useCallback(() => {
    if (!enabledRef.current) {
      startDemo();
      return;
    }
    setPlaying((p) => !p);
  }, [startDemo]);

  const setCity = useCallback((id) => {
    postDemoCity(id);
    if (id === getActiveDemoCityId()) {
      progressRef.current = 0;
      setProgress(0);
      lastTs.current = 0;
      setEnabled(true);
      setPlaying(true);
      return;
    }
    setActiveDemoCityId(id);
  }, []);

  return {
    enabled,
    playing,
    speed,
    setSpeed,
    progress,
    sample,
    trail,
    metrics,
    home: city.home,
    city,
    cities: DEMO_CITIES,
    setCity,
    startDemo,
    stopDemo,
    togglePlay,
    durationSec: Math.round(city.durationMs / 1000),
  };
}
