// Individual time entry display component
// Renders a single time entry with edit and delete capabilities

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Edit, Save, X, Trash2 } from 'lucide-react';
import { TimeLog } from '@/types';
import { formatHours, parseHours } from '@/utils/timeUtils';
import { generateProjectColor, isColorCodedProjectsEnabled } from '@/lib/projectColors';

interface TimeEntryCardProps {
  timeLog: TimeLog;
  onUpdate: (logId: string, updates: Partial<TimeLog>) => void;
  onDelete: (logId: string) => void;
  showProjectInfo?: boolean;
}

const TimeEntryCard: React.FC<TimeEntryCardProps> = ({
  timeLog,
  onUpdate,
  onDelete,
  showProjectInfo = true
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState({
    duration: formatHours(timeLog.duration),
    description: timeLog.description,
    startTime: timeLog.startTime,
    endTime: timeLog.endTime
  });

  const colorCodedEnabled = isColorCodedProjectsEnabled();

  const handleSave = () => {
    const updates: Partial<TimeLog> = {
      duration: parseHours(editValues.duration),
      description: editValues.description,
      startTime: editValues.startTime,
      endTime: editValues.endTime
    };
    
    onUpdate(timeLog.id, updates);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValues({
      duration: formatHours(timeLog.duration),
      description: timeLog.description,
      startTime: timeLog.startTime,
      endTime: timeLog.endTime
    });
    setIsEditing(false);
  };

  const getCardStyle = () => {
    if (!colorCodedEnabled || !showProjectInfo) return {};
    return {
      backgroundColor: generateProjectColor(timeLog.projectName)
    };
  };

  return (
    <Card 
      className="hover:shadow-md transition-all duration-200"
      style={getCardStyle()}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            {showProjectInfo && (
              <>
                <p className="text-base font-medium text-foreground mb-1">
                  {timeLog.projectName}
                </p>
                <p className="text-sm text-muted-foreground mb-2">
                  {timeLog.subprojectName}
                </p>
              </>
            )}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{timeLog.startTime} - {timeLog.endTime}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {isEditing ? (
              <div className="flex items-center gap-1">
                <Input
                  value={editValues.duration}
                  onChange={(e) => setEditValues(prev => ({ ...prev, duration: e.target.value }))}
                  className="w-20 h-8 text-center"
                  type="number"
                  step="0.1"
                />
                <Button size="sm" onClick={handleSave} className="h-8 w-8 p-0">
                  <Save className="h-3 w-3" />
                </Button>
                <Button size="sm" variant="ghost" onClick={handleCancel} className="h-8 w-8 p-0">
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="text-lg font-bold text-accent bg-accent/10 px-3 py-1 rounded-lg">
                  {formatHours(timeLog.duration)}h
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsEditing(true)}
                  className="h-8 w-8 p-0"
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onDelete(timeLog.id)}
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        </div>
        
        {timeLog.description && (
          <div className="mt-3 p-3 bg-muted/40 rounded-lg border border-border/20">
            {isEditing ? (
              <Input
                value={editValues.description}
                onChange={(e) => setEditValues(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Description"
                className="w-full"
              />
            ) : (
              <p className="text-sm text-foreground italic">{timeLog.description}</p>
            )}
          </div>
        )}
        
        {isEditing && (
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-muted-foreground">Start Time</label>
              <Input
                value={editValues.startTime}
                onChange={(e) => setEditValues(prev => ({ ...prev, startTime: e.target.value }))}
                className="h-8"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">End Time</label>
              <Input
                value={editValues.endTime}
                onChange={(e) => setEditValues(prev => ({ ...prev, endTime: e.target.value }))}
                className="h-8"
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TimeEntryCard;