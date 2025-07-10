import React, { useState, useEffect } from 'react';
import { useProjectManagement } from '@/hooks/useProjectManagement';
import { useTimeLogging } from '@/hooks/useTimeLogging';
import { storageService } from '@/services/storageService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ProjectSelector from './ProjectSelector';
import StopwatchPanel from './StopwatchPanel';
import QueuedProjects, { QueuedProject } from './QueuedProjects';

export interface Project {
  id: string;
  name: string;
  subprojects: Subproject[];
  totalTime: number;
}

export interface Subproject {
  id: string;
  name: string;
  totalTime: number;
}

export interface TimeLog {
  id: string;
  projectId: string;
  subprojectId: string;
  projectName: string;
  subprojectName: string;
  duration: number;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
}

const TimeTracker = () => {
  const {
    projects,
    addProject,
    updateProjectTimes
  } = useProjectManagement();
  const { timeLogs, logTime } = useTimeLogging();
  const [selectedProjectId, setSelectedProjectId] = useState<string>(() => {
    return storageService.getSelectedProjectId();
  });
  const [selectedSubprojectId, setSelectedSubprojectId] = useState<string>(() => {
    return storageService.getSelectedSubprojectId();
  });
  const [queuedProjects, setQueuedProjects] = useState<QueuedProject[]>(() => {
    return storageService.getQueuedProjects();
  });
  const [resumedProject, setResumedProject] = useState<QueuedProject | undefined>();

  // Update project times when time logs change
  useEffect(() => {
    updateProjectTimes(timeLogs);
  }, [timeLogs, updateProjectTimes]);

  useEffect(() => {
    storageService.saveSelectedProjectId(selectedProjectId);
  }, [selectedProjectId]);

  useEffect(() => {
    storageService.saveSelectedSubprojectId(selectedSubprojectId);
  }, [selectedSubprojectId]);

  useEffect(() => {
    storageService.saveQueuedProjects(queuedProjects);
  }, [queuedProjects]);

  useEffect(() => {
    const handleUpdateSubproject = (event: any) => {
      const { projectId, subprojectId, newName } = event.detail;
      // This will be handled by the project management hook
      window.location.reload(); // Temporary solution to refresh data
    };

    const handleDeleteSubproject = (event: any) => {
      const { projectId, subprojectId } = event.detail;
      // This will be handled by the project management hook
      
      if (selectedSubprojectId === subprojectId) {
        setSelectedSubprojectId('');
      }
      window.location.reload(); // Temporary solution to refresh data
    };

    window.addEventListener('update-subproject', handleUpdateSubproject);
    window.addEventListener('delete-subproject', handleDeleteSubproject);

    return () => {
      window.removeEventListener('update-subproject', handleUpdateSubproject);
      window.removeEventListener('delete-subproject', handleDeleteSubproject);
    };
  }, [projects, selectedSubprojectId]);

  const addSubproject = (projectId: string, subprojectName: string) => {
    setProjects(projects.map(project => 
      project.id === projectId 
        ? {
            ...project,
            subprojects: [...project.subprojects, {
              id: `${Date.now()}-sub`,
              name: subprojectName,
              totalTime: 0
            }]
          }
        : project
    ));
  };

  const handleLogTime = (duration: number, description: string, startTime: Date, endTime: Date, projectId?: string, subprojectId?: string) => {
    const targetProjectId = projectId || selectedProjectId;
    const targetSubprojectId = subprojectId || selectedSubprojectId;
    
    const project = projects.find(p => p.id === targetProjectId);
    const subproject = project?.subprojects.find(s => s.id === targetSubprojectId);
    
    if (!project || !subproject) return;

    logTime(duration, description, startTime, endTime, targetProjectId, targetSubprojectId, project.name, subproject.name);
  };

  const switchToExcelView = () => {
    window.dispatchEvent(new CustomEvent('switchToExcelView'));
  };

  const handlePauseProject = (queuedProject: QueuedProject) => {
    setQueuedProjects([...queuedProjects, queuedProject]);
  };

  const handleResumeProject = (queuedProject: QueuedProject) => {
    const currentStopwatchState = storageService.getStopwatchState();
    if (currentStopwatchState) {
      if (currentStopwatchState.isRunning && currentStopwatchState.startTime) {
        const currentProject = projects.find(p => p.id === selectedProjectId);
        const currentSubproject = currentProject?.subprojects.find(s => s.id === selectedSubprojectId);
        
        if (currentProject && currentSubproject) {
          const currentElapsedTime = Math.floor((new Date().getTime() - new Date(currentStopwatchState.startTime).getTime()) / 1000);
          const currentQueuedProject: QueuedProject = {
            id: Date.now().toString(),
            projectId: selectedProjectId,
            subprojectId: selectedSubprojectId,
            projectName: currentProject.name,
            subprojectName: currentSubproject.name,
            elapsedTime: currentStopwatchState.elapsedTime + currentElapsedTime,
            startTime: new Date(currentStopwatchState.startTime)
          };
          
          setQueuedProjects([...queuedProjects.filter(p => p.id !== queuedProject.id), currentQueuedProject]);
        }
      }
    }
    
    setQueuedProjects(queuedProjects.filter(p => p.id !== queuedProject.id));
    setSelectedProjectId(queuedProject.projectId);
    setSelectedSubprojectId(queuedProject.subprojectId);
    setResumedProject(queuedProject);
  };

  const handleStopQueuedProject = (queuedProjectId: string) => {
    setQueuedProjects(queuedProjects.filter(p => p.id !== queuedProjectId));
  };

  const handleResumedProjectHandled = () => {
    setResumedProject(undefined);
  };

  const selectedProject = projects.find(p => p.id === selectedProjectId);
  const selectedSubproject = selectedProject?.subprojects.find(s => s.id === selectedSubprojectId);

  return (
    <div className="relative font-sans bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[650px]">
          {/* Left Panel - Project Selection */}
          <Card className="h-full rounded-[22px] bg-white/90 backdrop-blur-2xl border border-white/80 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="px-6 py-5 border-b border-gray-100/50">
              <CardTitle className="text-[22px] font-medium text-gray-800 tracking-[-0.01em]">
                Select Project
              </CardTitle>
            </CardHeader>
            <CardContent className="h-full pt-0 px-5 pb-6">
              <ProjectSelector
                projects={projects}
                selectedProjectId={selectedProjectId}
                selectedSubprojectId={selectedSubprojectId}
                onProjectSelect={setSelectedProjectId}
                onSubprojectSelect={setSelectedSubprojectId}
                onAddProject={addProject}
                onAddSubproject={addSubproject}
              />
            </CardContent>
          </Card>

          {/* Right Panel - Stopwatch */}
          <Card className="h-full rounded-[22px] bg-white/90 backdrop-blur-2xl border border-white/80 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="px-6 py-5 border-b border-gray-100/50">
              <CardTitle className="text-[22px] font-medium text-gray-800 tracking-[-0.01em]">
                Time Tracker
              </CardTitle>
            </CardHeader>
            <CardContent className="h-full pt-0 px-5 pb-6">
              <StopwatchPanel
                selectedProject={selectedProject}
                selectedSubproject={selectedSubproject}
                onLogTime={handleLogTime}
                onSwitchToExcelView={switchToExcelView}
                onPauseProject={handlePauseProject}
                resumedProject={resumedProject}
                onResumedProjectHandled={handleResumedProjectHandled}
              />
            </CardContent>
          </Card>
        </div>

        {/* Queued Projects */}
        <div className="mt-6">
          <QueuedProjects
            queuedProjects={queuedProjects}
            onResumeProject={handleResumeProject}
            onStopProject={handleStopQueuedProject}
            onLogTime={handleLogTime}
          />
        </div>
      </div>
    </div>
  );
};

export default TimeTracker;