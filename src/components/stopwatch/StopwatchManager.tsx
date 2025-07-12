import React, { useState, useEffect, useRef } from 'react';
import { storageService } from '@/services/storageService';
import { QueuedProject } from '@/components/QueuedProjects';

interface StopwatchManagerProps {
  resumedProject?: QueuedProject;
  onResumedProjectHandled: () => void;
  children: (state: StopwatchState, actions: StopwatchActions) => React.ReactNode;
}

interface StopwatchState {
  isRunning: boolean;
  elapsedTime: number;
  displayTime: number;
  startTime: Date | null;
}

interface StopwatchActions {
  handleStart: () => void;
  handlePause: () => void;
  handleStop: () => void;
}

const StopwatchManager: React.FC<StopwatchManagerProps> = ({
  resumedProject,
  onResumedProjectHandled,
  children
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [displayTime, setDisplayTime] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const lastUpdateRef = useRef<number | null>(null);

  // Load stopwatch state from localStorage
  useEffect(() => {
    const savedState = storageService.getStopwatchState();
    if (savedState) {
      setIsRunning(savedState.isRunning);
      setElapsedTime(savedState.elapsedTime);
      setDisplayTime(savedState.elapsedTime);
      if (savedState.startTime) {
        setStartTime(new Date(savedState.startTime));
      }
    }
  }, []);

  // Handle resumed project
  useEffect(() => {
    if (resumedProject) {
      setElapsedTime(resumedProject.elapsedTime);
      setDisplayTime(resumedProject.elapsedTime);
      setStartTime(resumedProject.startTime);
      setIsRunning(true);
      onResumedProjectHandled();
    }
  }, [resumedProject, onResumedProjectHandled]);

  // Save stopwatch state to localStorage
  useEffect(() => {
    const state = {
      isRunning,
      elapsedTime,
      startTime: startTime?.toISOString()
    };
    storageService.saveStopwatchState(state);
  }, [isRunning, elapsedTime, startTime]);

  // Smooth animation loop
  useEffect(() => {
    if (isRunning && startTime) {
      const updateAnimation = (timestamp: number) => {
        if (!lastUpdateRef.current) lastUpdateRef.current = timestamp;
        const delta = timestamp - lastUpdateRef.current;
        
        // Update display time for smooth animation
        if (delta > 16) {
          const now = new Date();
          const exactElapsed = (now.getTime() - startTime.getTime()) / 1000;
          setDisplayTime(exactElapsed);
          lastUpdateRef.current = timestamp;
        }
        
        requestAnimationFrame(updateAnimation);
      };
      
      requestAnimationFrame(updateAnimation);
    }
    
    return () => {
      lastUpdateRef.current = null;
    };
  }, [isRunning, startTime]);

  // Timer effect for actual seconds counting
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && startTime) {
      interval = setInterval(() => {
        const now = new Date();
        const newElapsedTime = Math.floor((now.getTime() - startTime.getTime()) / 1000);
        setElapsedTime(newElapsedTime);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, startTime]);

  const handleStart = () => {
    const now = new Date();
    setStartTime(now);
    setIsRunning(true);
    setElapsedTime(0);
    setDisplayTime(0);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleStop = () => {
    setIsRunning(false);
    setElapsedTime(0);
    setDisplayTime(0);
    setStartTime(null);
    storageService.clearStopwatchState();
  };

  const state: StopwatchState = {
    isRunning,
    elapsedTime,
    displayTime,
    startTime
  };

  const actions: StopwatchActions = {
    handleStart,
    handlePause,
    handleStop
  };

  return <>{children(state, actions)}</>;
};

export default StopwatchManager;