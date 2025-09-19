import { useEffect, useState, useRef } from "react";

interface UseAutoLockOptions {
  timeout?: number;
  persistKey?: string;
  onLock?: () => void;
}

export function useAutoLockPersisted({
  timeout = 5 * 60 * 1000,
  persistKey = "autoLockTimestamp",
  onLock,
}: UseAutoLockOptions = {}) {
  const [locked, setLocked] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const lock = () => {
    setLocked(true);
    localStorage.setItem(persistKey, Date.now().toString());
    onLock?.();
  };

  const resetTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => lock(), timeout);
  };

  const unlock = (password: string, correctPassword: string) => {
    if (password === correctPassword) {
      setLocked(false);
      localStorage.removeItem(persistKey);
      resetTimer();
      return true;
    }
    return false;
  };

  useEffect(() => {
    const savedTimestamp = localStorage.getItem(persistKey);
    if (savedTimestamp) {
      const elapsed = Date.now() - parseInt(savedTimestamp, 10);
      if (elapsed >= timeout) {
        setLocked(true);
      } else {
        timerRef.current = setTimeout(() => lock(), timeout - elapsed);
      }
    } else {
      resetTimer();
    }

    const events = ["mousemove", "keydown", "scroll", "touchstart"];
    events.forEach((event) => document.addEventListener(event, resetTimer));

    const handleVisibilityChange = () => {
      if (document.hidden) lock();
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      events.forEach((event) => document.removeEventListener(event, resetTimer));
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return { locked, unlock };
}