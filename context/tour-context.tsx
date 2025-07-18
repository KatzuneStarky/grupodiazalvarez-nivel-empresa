"use client"

import { createContext, useContext, useRef } from 'react';
import type { Tour } from 'shepherd.js';
import Shepherd from 'shepherd.js';

type TourContextType = {
  tour: Tour | null;
  initTour: (tourId: string) => Tour | undefined;
  startTour: () => void;
  completeTour: () => void;
  cancelTour: () => void;
};

const TourContext = createContext<TourContextType | undefined>(undefined)

export const TourProvider = ({ children }: { children: React.ReactNode }) => {
  const tourRef = useRef<Tour | null>(null)
  const currentTourIdRef = useRef<string | null>(null);

  const initTour = (tourId: string) => {
    if (localStorage.getItem(`tourSeen_${tourId}`)) return

    currentTourIdRef.current = tourId

    const tour = new Shepherd.Tour({
      defaultStepOptions: {
        scrollTo: true,
        cancelIcon: { enabled: true },
      },
    });

    tour.on('complete', () => {
      if (currentTourIdRef.current) {
        localStorage.setItem(`tourSeen_${currentTourIdRef.current}`, 'true');
      }
    });

    tour.on('cancel', () => {
      if (currentTourIdRef.current) {
        localStorage.setItem(`tourSeen_${currentTourIdRef.current}`, 'true');
      }
    });

    tourRef.current = tour;
    return tour;
  };

  const startTour = () => {
    if (localStorage.getItem('tourSeen')) return

    tourRef.current?.start();
  };

  const completeTour = () => {
    tourRef.current?.complete();
  };

  const cancelTour = () => {
    tourRef.current?.cancel();
  };

  return (
    <TourContext.Provider value={{ tour: tourRef.current, initTour, startTour, completeTour, cancelTour }}>
      {children}
    </TourContext.Provider>
  );
}

export const useTour = () => {
  const context = useContext(TourContext);
  if (!context) throw new Error('useTour must be used within TourProvider');
  return context;
};