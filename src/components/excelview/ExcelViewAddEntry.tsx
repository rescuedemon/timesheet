import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TimeLog } from '../TimeTracker';

interface ExcelViewAddEntryProps {
  isOpen: boolean;
  onClose: () => void;
}

const ExcelViewAddEntry: React.FC<ExcelViewAddEntryProps> = ({
  isOpen,
  onClose
}) => {
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('timesheet-projects');
    return saved ? JSON.parse(saved) : [];
  });

  const [addFormData, setAddFormData] = useState({
    projectId: '',
    subprojectId: '',
    date: new Date().toISOString().split('T')[0],
    duration: '',
    description: '',
    startTime: '',
    endTime: ''
  });

  const parseHours = (hours: string) => {
    return parseFloat(hours) * 3600;
  };

  const handleAddEntry = () => {
    if (addFormData.projectId && addFormData.subprojectId && addFormData.duration) {
      const selectedProject = projects.find((p: any) => p.id === addFormData.projectId);
      const selectedSubproject = selectedProject?.subprojects.find((s: any) => s.id === addFormData.subprojectId);
      
      const newLog: TimeLog = {
        id: Date.now().toString(),
        projectId: addFormData.projectId,
        subprojectId: addFormData.subprojectId,
        projectName: selectedProject?.name || '',
        subprojectName: selectedSubproject?.name || '',
        duration: parseHours(addFormData.duration),
        description: addFormData.description,
        date: addFormData.date,
        startTime: addFormData.startTime,
        endTime: addFormData.endTime
      };

      const savedTimeLogs = localStorage.getItem('timesheet-logs');
      const timeLogs = savedTimeLogs ? JSON.parse(savedTimeLogs) : [];
      const updatedLogs = [...timeLogs, newLog];
      localStorage.setItem('timesheet-logs', JSON.stringify(updatedLogs));
      
      setAddFormData({
        projectId: '',
        subprojectId: '',
        date: new Date().toISOString().split('T')[0],
        duration: '',
        description: '',
        startTime: '',
        endTime: ''
      });
      onClose();
      window.location.reload(); // Refresh to update the view
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Time Entry</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Project</Label>
            <Select 
              value={addFormData.projectId} 
              onValueChange={(value) => setAddFormData({...addFormData, projectId: value, subprojectId: ''})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select project" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project: any) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Subproject</Label>
            <Select 
              value={addFormData.subprojectId} 
              onValueChange={(value) => setAddFormData({...addFormData, subprojectId: value})}
              disabled={!addFormData.projectId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select subproject" />
              </SelectTrigger>
              <SelectContent>
                {projects
                  .find((p: any) => p.id === addFormData.projectId)
                  ?.subprojects.map((sub: any) => (
                    <SelectItem key={sub.id} value={sub.id}>
                      {sub.name}
                    </SelectItem>
                  )) || []}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Date</Label>
            <Input
              type="date"
              value={addFormData.date}
              onChange={(e) => setAddFormData({...addFormData, date: e.target.value})}
            />
          </div>
          <div>
            <Label>Duration (hours)</Label>
            <Input
              value={addFormData.duration}
              onChange={(e) => setAddFormData({...addFormData, duration: e.target.value})}
              placeholder="e.g., 2.5"
              type="number"
              step="0.1"
            />
          </div>
          <div>
            <Label>Start Time</Label>
            <Input
              value={addFormData.startTime}
              onChange={(e) => setAddFormData({...addFormData, startTime: e.target.value})}
              placeholder="e.g., 09:00:00"
            />
          </div>
          <div>
            <Label>End Time</Label>
            <Input
              value={addFormData.endTime}
              onChange={(e) => setAddFormData({...addFormData, endTime: e.target.value})}
              placeholder="e.g., 11:30:00"
            />
          </div>
          <div>
            <Label>Description (optional)</Label>
            <Textarea
              value={addFormData.description}
              onChange={(e) => setAddFormData({...addFormData, description: e.target.value})}
              placeholder="What did you work on?"
              rows={3}
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleAddEntry} className="flex-1">
              Add Entry
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExcelViewAddEntry;