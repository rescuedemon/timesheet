import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Play, Square, Save } from 'lucide-react';
import { generateProjectColor, isColorCodedProjectsEnabled } from '@/lib/projectColors';

export interface QueuedProject {
  id: string;
  projectId: string;
  subprojectId: string;
  projectName: string;
  subprojectName: string;
  elapsedTime: number;
  startTime: Date;
}

interface QueuedProjectsProps {
  queuedProjects: QueuedProject[];
  onResumeProject: (queuedProject: QueuedProject) => void;
  onStopProject: (queuedProjectId: string) => void;
  onLogTime?: (duration: number, description: string, startTime: Date, endTime: Date, projectId: string, subprojectId: string) => void;
}

const QueuedProjects: React.FC<QueuedProjectsProps> = ({
  queuedProjects,
  onResumeProject,
  onStopProject,
  onLogTime
}) => {
  const [stoppingProject, setStoppingProject] = useState<QueuedProject | null>(null);
  const [description, setDescription] = useState('');
  const [colorCodedEnabled, setColorCodedEnabled] = useState(false);

  useEffect(() => {
    setColorCodedEnabled(isColorCodedProjectsEnabled());
    
    const handleStorageChange = () => {
      setColorCodedEnabled(isColorCodedProjectsEnabled());
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('settings-changed', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('settings-changed', handleStorageChange);
    };
  }, []);

  const getProjectBackgroundStyle = (projectName: string) => {
    if (!colorCodedEnabled) return {};
    return {
      backgroundColor: generateProjectColor(projectName)
    };
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatRoundoffTime = (seconds: number) => {
    return (seconds / 3600).toFixed(2);
  };

  const handleStopClick = (project: QueuedProject) => {
    setStoppingProject(project);
  };

  const handleConfirmStop = () => {
    if (stoppingProject && onLogTime) {
      const endTime = new Date();
      onLogTime(
        stoppingProject.elapsedTime,
        description,
        stoppingProject.startTime,
        endTime,
        stoppingProject.projectId,
        stoppingProject.subprojectId
      );
      onStopProject(stoppingProject.id);
    } else {
      if (stoppingProject) {
        onStopProject(stoppingProject.id);
      }
    }
    setStoppingProject(null);
    setDescription('');
  };

  const handleCancelStop = () => {
    setStoppingProject(null);
    setDescription('');
  };

  if (queuedProjects.length === 0) {
    return null;
  }

  return (
    <>
      <Card className="mt-8 bg-white dark:bg-gray-850 rounded-2xl shadow-lg border-0 overflow-hidden">
        <CardHeader className="pb-5 px-7 pt-7 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800 border-b border-gray-100 dark:border-gray-700">
          <CardTitle className="text-xl font-semibold text-gray-800 dark:text-white tracking-tight">
            Paused Projects
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-9 px-7 pt-7">
          <div className="space-y-7">
            {queuedProjects.map(project => (
              <div 
                key={project.id} 
                className="flex items-stretch p-0 rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300 overflow-hidden transform hover:-translate-y-0.5 group"
                style={getProjectBackgroundStyle(project.projectName)}
              >
                {/* Project name container (left 15%) */}
                <div className="w-[15%] min-w-[120px] bg-gray-900 dark:bg-gray-900 flex flex-col items-center justify-center text-white p-7 rounded-l-xl">
                  <div className="font-bold text-center text-base">
                    {project.projectName}
                  </div>
                  {project.subprojectName && (
                    <div className="text-xs text-center mt-2.5 text-gray-300">
                      {project.subprojectName}
                    </div>
                  )}
                </div>
                
                {/* Main content area */}
                <div className="flex-1 flex flex-col md:flex-row items-start md:items-center justify-between p-7">
                  <div className="flex flex-col items-center mb-3 md:mb-0">
                    <div className="text-sm font-mono text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-750 px-4 py-3.5 rounded-lg mb-4">
                      Paused at: {formatTime(project.elapsedTime)}
                    </div>
                    
                    {/* Round-off time circle - centered below the time container */}
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-900 dark:bg-gray-900 text-white font-bold text-sm shadow-inner border border-gray-700">
                      {formatRoundoffTime(project.elapsedTime)}
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button
                      size="sm"
                      onClick={() => onResumeProject(project)}
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-3.5 transition-all duration-200 shadow-md hover:shadow-lg transform active:scale-[0.98]"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Resume
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStopClick(project)}
                      className="text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors shadow-sm transform active:scale-[0.98]"
                    >
                      <Square className="h-4 w-4 mr-2" />
                      Stop
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Stop Confirmation Dialog */}
      <Dialog open={!!stoppingProject} onOpenChange={(open) => !open && handleCancelStop()}>
        <DialogContent className="max-w-md rounded-2xl bg-white dark:bg-gray-850 border border-gray-200 dark:border-gray-700 shadow-xl">
          <DialogHeader className="px-6 pt-6">
            <DialogTitle className="text-xl font-semibold text-gray-800 dark:text-white tracking-tight">
              Log Time Entry
            </DialogTitle>
          </DialogHeader>
          {stoppingProject && (
            <div className="space-y-6 px-6 pb-6">
              <div className="p-5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                <div className="font-medium text-base text-gray-800 dark:text-gray-100">
                  {stoppingProject.projectName}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {stoppingProject.subprojectName}
                </div>
                
                <div className="flex flex-col items-center mt-4">
                  <div className="text-sm font-mono text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-750 px-4 py-3 rounded-lg mb-3">
                    Duration: {formatTime(stoppingProject.elapsedTime)}
                  </div>
                  
                  {/* Round-off circle in dialog */}
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-900 dark:bg-gray-900 text-white font-bold text-sm shadow-inner border border-gray-700">
                    {formatRoundoffTime(stoppingProject.elapsedTime)}
                  </div>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Description (optional)
                </Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What did you work on?"
                  rows={3}
                  className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 rounded-xl"
                />
              </div>
              
              <div className="flex gap-3 pt-2">
                <Button 
                  onClick={handleConfirmStop} 
                  className="flex-1 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save & Stop
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleCancelStop}
                  className="py-3.5 rounded-xl text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors shadow-sm"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default QueuedProjects;