import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings as SettingsIcon } from 'lucide-react';
import SettingsProjects from './settings/SettingsProjects';
import SettingsHolidays from './settings/SettingsHolidays';
import SettingsUserAccess from './settings/SettingsUserAccess';
import SettingsManagerAccess from './settings/SettingsManagerAccess';

const Settings: React.FC = () => {
  // Progress bar settings
  const [progressBarEnabled, setProgressBarEnabled] = useState(() => {
    const saved = localStorage.getItem('progressbar-enabled');
    return saved ? JSON.parse(saved) : false;
  });
  
  const [progressBarColor, setProgressBarColor] = useState(() => {
    const saved = localStorage.getItem('progressbar-color');
    return saved || '#10b981';
  });

  // Color-coded projects settings
  const [colorCodedProjectsEnabled, setColorCodedProjectsEnabled] = useState(() => {
    const saved = localStorage.getItem('color-coded-projects-enabled');
    return saved ? JSON.parse(saved) : false;
  });

  // Frequent subprojects settings
  const [frequentSubprojectsEnabled, setFrequentSubprojectsEnabled] = useState(() => {
    const saved = localStorage.getItem('frequent-subprojects-enabled');
    return saved ? JSON.parse(saved) : false;
  });

  // Get projects from localStorage
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('timesheet-projects');
    return saved ? JSON.parse(saved) : [];
  });

  // Get holidays from localStorage
  const [holidays, setHolidays] = useState(() => {
    const saved = localStorage.getItem('timesheet-holidays');
    return saved ? JSON.parse(saved) : [];
  });

  const handleProgressBarToggle = (enabled: boolean) => {
    setProgressBarEnabled(enabled);
    localStorage.setItem('progressbar-enabled', JSON.stringify(enabled));
  };

  const handleProgressBarColorChange = (color: string) => {
    setProgressBarColor(color);
    localStorage.setItem('progressbar-color', color);
  };

  const handleColorCodedProjectsToggle = (enabled: boolean) => {
    setColorCodedProjectsEnabled(enabled);
    localStorage.setItem('color-coded-projects-enabled', JSON.stringify(enabled));
    window.dispatchEvent(new CustomEvent('settings-changed'));
  };

  const handleFrequentSubprojectsToggle = (enabled: boolean) => {
    setFrequentSubprojectsEnabled(enabled);
    localStorage.setItem('frequent-subprojects-enabled', JSON.stringify(enabled));
    window.dispatchEvent(new CustomEvent('settings-changed'));
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="p-4 rounded-2xl shadow-2xl hover:shadow-2xl bg-card/90 backdrop-blur-xl border border-border/30 hover:border-border/50 transition-all duration-300">
          <SettingsIcon className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="projects" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="holidays">Holidays</TabsTrigger>
            <TabsTrigger value="user">User Access</TabsTrigger>
            <TabsTrigger value="manager">Manager Access</TabsTrigger>
          </TabsList>
          
          <TabsContent value="projects" className="space-y-4">
            <SettingsProjects projects={projects} setProjects={setProjects} />
          </TabsContent>

          <TabsContent value="holidays" className="space-y-4">
            <SettingsHolidays holidays={holidays} setHolidays={setHolidays} />
          </TabsContent>
          
          <TabsContent value="user" className="space-y-4">
            <SettingsUserAccess
              progressBarEnabled={progressBarEnabled}
              progressBarColor={progressBarColor}
              colorCodedProjectsEnabled={colorCodedProjectsEnabled}
              frequentSubprojectsEnabled={frequentSubprojectsEnabled}
              onProgressBarToggle={handleProgressBarToggle}
              onProgressBarColorChange={handleProgressBarColorChange}
              onColorCodedProjectsToggle={handleColorCodedProjectsToggle}
              onFrequentSubprojectsToggle={handleFrequentSubprojectsToggle}
            />
          </TabsContent>
          
          <TabsContent value="manager" className="space-y-4">
            <SettingsManagerAccess holidays={holidays} setHolidays={setHolidays} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default Settings;