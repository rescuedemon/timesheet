import React, { useState, useEffect, useRef } from 'react';
import StopwatchControls from './timesheet/StopwatchControls';
import StopwatchDisplay from './timesheet/StopwatchDisplay';
import ProjectInfo from './timesheet/ProjectInfo';
import TimeLogDialog from './timesheet/TimeLogDialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Play, Pause, Square } from 'lucide-react';
import { Project, Subproject } from './TimeTracker';
import { QueuedProject } from './QueuedProjects';
import { generateProjectColor } from '@/lib/projectColors';
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
  const auroraTimeRef = useRef(0);
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

  // Aurora and gradient animation
  useEffect(() => {
    let animationFrameId: number;
    
    const updateAuroraAndGradient = (timestamp: number) => {
      auroraTimeRef.current = timestamp / 1000;
      
      if (containerRef.current) {
        // Update gradient position based on time
        const gradientPos = Math.sin(auroraTimeRef.current * 0.5) * 0.1 + 0.5;
        containerRef.current.style.setProperty('--gradient-pos', `${gradientPos}`);
      }
      
      animationFrameId = requestAnimationFrame(updateAuroraAndGradient);
    };
    
    animationFrameId = requestAnimationFrame(updateAuroraAndGradient);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Smooth animation loop
  useEffect(() => {
    if (isRunning && startTime) {
      const updateAnimation = (timestamp: number) => {
        if (!lastUpdateRef.current) lastUpdateRef.current = timestamp;
        const delta = timestamp - lastUpdateRef.current;
        
        // Update display time for smooth animation
        if (delta > 16) { // ~60fps
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
      style={{
        background: `
          radial-gradient(
            circle at 50% var(--gradient-pos, 0.5),
            rgba(255, 255, 255, 0.03) 0%,
            transparent 70%
          ),
          var(--background-color, transparent)
        `,
        '--gradient-pos': '0.5'
      } as React.CSSProperties}
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
          auroraTimeRef={auroraTimeRef}
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