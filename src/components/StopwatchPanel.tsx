import React, { useState, useEffect, useRef } from 'react';
import StopwatchControls from './timesheet/StopwatchControls';
import ProjectInfo from './timesheet/ProjectInfo';
import TimeLogDialog from './timesheet/TimeLogDialog';
import { Project, Subproject } from './TimeTracker';
import { QueuedProject } from './QueuedProjects';
import { formatTime } from '@/utils/timeUtils';
import { storageService } from '@/services/storageService';

interface StopwatchPanelProps {
  selectedProject: Project | undefined;
  selectedSubproject: Subproject | undefined;
  onLogTime: (duration: number, description: string, startTime: Date, endTime: Date, projectId?: string, subprojectId?: string) => void;
  onPauseProject: (queuedProject: QueuedProject) => void;
  resumedProject?: QueuedProject;
  onResumedProjectHandled: () => void;
}

// More vibrant colors for aurora effect
const AURORA_COLORS = [
  'rgba(100, 200, 255, 0.5)',   // Vibrant Blue
  'rgba(255, 100, 200, 0.5)',   // Vibrant Pink
  'rgba(100, 255, 150, 0.5)',   // Vibrant Green
  'rgba(200, 100, 255, 0.5)',   // Vibrant Purple
  'rgba(255, 200, 100, 0.5)',   // Vibrant Yellow
  'rgba(100, 240, 255, 0.5)',   // Vibrant Cyan
  'rgba(255, 120, 100, 0.5)',   // Vibrant Coral
  'rgba(220, 150, 255, 0.5)',   // Vibrant Lavender
  'rgba(150, 255, 180, 0.5)',   // Vibrant Mint
  'rgba(255, 180, 100, 0.5)',   // Vibrant Peach
  'rgba(255, 100, 150, 0.5)',   // Vibrant Rose
  'rgba(100, 200, 255, 0.5)',   // Vibrant Sky Blue
  'rgba(255, 220, 100, 0.5)',   // Vibrant Gold
  'rgba(200, 200, 255, 0.5)',   // Vibrant Lilac
  'rgba(255, 150, 100, 0.5)',   // Vibrant Orange
  'rgba(100, 255, 220, 0.5)',   // Vibrant Aqua
  'rgba(255, 100, 255, 0.5)',   // Vibrant Magenta
  'rgba(220, 255, 100, 0.5)',   // Vibrant Lime
  'rgba(255, 140, 200, 0.5)',   // Vibrant Bubblegum
  'rgba(180, 100, 255, 0.5)',   // Vibrant Violet
];

// Custom StopwatchDisplay component with aurora effect
const StopwatchDisplay: React.FC<{
  isRunning: boolean;
  elapsedTime: number;
  displayTime: number;
}> = ({ isRunning, elapsedTime, displayTime }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const auroraElementsRef = useRef<HTMLDivElement[]>([]);
  const auroraTimeRef = useRef(0);
  
  // Initialize aurora elements
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Clear previous elements
    auroraElementsRef.current.forEach(el => el.remove());
    auroraElementsRef.current = [];
    
    const fragment = document.createDocumentFragment();
    
    // Create 20 aurora elements
    for (let i = 0; i < 20; i++) {
      const element = document.createElement('div');
      element.className = 'aurora-element absolute rounded-full blur-[60px]';
      
      // Random size
      const size = 60 + Math.random() * 120;
      element.style.width = `${size}px`;
      element.style.height = `${size}px`;
      
      // Random position
      element.style.left = `${Math.random() * 100}%`;
      element.style.top = `${Math.random() * 100}%`;
      
      // Random color
      element.style.backgroundColor = AURORA_COLORS[Math.floor(Math.random() * AURORA_COLORS.length)];
      
      fragment.appendChild(element);
      auroraElementsRef.current.push(element);
    }
    
    containerRef.current.appendChild(fragment);
    
    return () => {
      auroraElementsRef.current.forEach(el => el.remove());
    };
  }, []);

  // Animate aurora effect
  useEffect(() => {
    const animateAurora = (timestamp: number) => {
      if (!auroraTimeRef.current) auroraTimeRef.current = timestamp;
      const timeDelta = (timestamp - auroraTimeRef.current) / 1000;
      auroraTimeRef.current = timestamp;
      
      auroraElementsRef.current.forEach((el, index) => {
        if (!el) return;
        
        // Different movement patterns based on index
        let dx = 0, dy = 0;
        const speed = 0.5 + (index % 3) * 0.3;
        
        switch(index % 4) {
          case 0: // Circular movement
            dx = Math.cos(timestamp / 2000 + index) * speed;
            dy = Math.sin(timestamp / 2000 + index) * speed;
            break;
          case 1: // Diagonal movement
            dx = Math.sin(timestamp / 1500 + index) * speed;
            dy = Math.cos(timestamp / 1800 + index) * speed;
            break;
          case 2: // Swirling movement
            dx = Math.cos(timestamp / 2500 + index) * speed;
            dy = Math.sin(timestamp / 2200 + index) * speed;
            break;
          default: // Random drift
            dx = Math.sin(timestamp / 3000 + index) * speed;
            dy = Math.cos(timestamp / 2800 + index * 0.7) * speed;
        }
        
        // Get current position
        const left = parseFloat(el.style.left || '0');
        const top = parseFloat(el.style.top || '0');
        
        // Update position with wrapping
        el.style.left = `${(left + dx + 100) % 100}%`;
        el.style.top = `${(top + dy + 100) % 100}%`;
        
        // Pulsating opacity
        const pulse = 0.4 + 0.3 * Math.sin(timestamp / 800 + index);
        el.style.opacity = `${pulse}`;
        
        // Color shifting
        if (timestamp % 5000 < 50) {
          el.style.backgroundColor = AURORA_COLORS[Math.floor(Math.random() * AURORA_COLORS.length)];
        }
      });
      
      animationRef.current = requestAnimationFrame(animateAurora);
    };
    
    if (isRunning) {
      animationRef.current = requestAnimationFrame(animateAurora);
    }
    
    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [isRunning]);

  const formattedTime = formatTime(Math.floor(displayTime));
  
  return (
    <div className="relative flex items-center justify-center w-64 h-64 rounded-full border-2 border-gray-200 shadow-lg overflow-hidden">
      {/* Aurora container */}
      <div ref={containerRef} className="absolute inset-0 pointer-events-none" />
      
      {/* Timer display - only visible when running */}
      <div className={`relative z-10 text-4xl font-mono font-bold text-gray-800 transition-opacity duration-300 ${isRunning ? 'opacity-100' : 'opacity-0'}`}>
        {formattedTime}
      </div>
    </div>
  );
};

const StopwatchPanel: React.FC<StopwatchPanelProps> = ({
  selectedProject,
  selectedSubproject,
  onLogTime,
  onPauseProject,
  resumedProject,
  onResumedProjectHandled
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [displayTime, setDisplayTime] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [showDescriptionDialog, setShowDescriptionDialog] = useState(false);
  const [description, setDescription] = useState('');
  const [pendingLogData, setPendingLogData] = useState<{duration: number, startTime: Date, endTime: Date} | null>(null);
  const lastUpdateRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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
    if (!selectedProject || !selectedSubproject) return;
    
    const now = new Date();
    setStartTime(now);
    setIsRunning(true);
    setElapsedTime(0);
    setDisplayTime(0);
  };

  const handlePause = () => {
    if (!selectedProject || !selectedSubproject || !startTime) return;
    
    setIsRunning(false);
    
    const queuedProject: QueuedProject = {
      id: Date.now().toString(),
      projectId: selectedProject.id,
      subprojectId: selectedSubproject.id,
      projectName: selectedProject.name,
      subprojectName: selectedSubproject.name,
      elapsedTime,
      startTime
    };
    
    onPauseProject(queuedProject);
    storageService.clearStopwatchState();
  };

  const handleStop = () => {
    if (!selectedProject || !selectedSubproject || !startTime) return;
    
    const endTime = new Date();
    const finalDuration = elapsedTime;
    
    if (finalDuration > 0) {
      setPendingLogData({
        duration: finalDuration,
        startTime,
        endTime
      });
      setShowDescriptionDialog(true);
    }
    
    setIsRunning(false);
    setElapsedTime(0);
    setDisplayTime(0);
    setStartTime(null);
    storageService.clearStopwatchState();
  };

  const handleConfirmLog = () => {
    if (pendingLogData) {
      onLogTime(pendingLogData.duration, description, pendingLogData.startTime, pendingLogData.endTime);
    }
    setShowDescriptionDialog(false);
    setDescription('');
    setPendingLogData(null);
  };

  const handleCancelLog = () => {
    setShowDescriptionDialog(false);
    setDescription('');
    setPendingLogData(null);
  };

  const canStart = selectedProject && selectedSubproject && !isRunning;
  const canPauseOrStop = isRunning && startTime;

  return (
    <div 
      ref={containerRef}
      className="flex flex-col items-center justify-center w-full h-full relative overflow-hidden"
    >
      <ProjectInfo 
        selectedProject={selectedProject}
        selectedSubproject={selectedSubproject}
      />
      
      {/* Timer Section */}
      <div className="flex flex-col items-center justify-center space-y-10 px-6 z-10 w-full">
        <StopwatchDisplay
          isRunning={isRunning}
          elapsedTime={elapsedTime}
          displayTime={displayTime}
        />
        
        <StopwatchControls
          isRunning={isRunning}
          canStart={canStart}
          canPauseOrStop={canPauseOrStop}
          onStart={handleStart}
          onPause={handlePause}
          onStop={handleStop}
        />
      </div>

      <TimeLogDialog
        open={showDescriptionDialog}
        selectedProject={selectedProject}
        selectedSubproject={selectedSubproject}
        duration={pendingLogData?.duration || 0}
        description={description}
        onDescriptionChange={setDescription}
        onConfirm={handleConfirmLog}
        onCancel={handleCancelLog}
      />
    </div>
  );
};

export default StopwatchPanel;