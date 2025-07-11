import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Edit, Save, X, Trash2 } from 'lucide-react';
import { TimeLog } from '../TimeTracker';
import { generateProjectColor } from '@/lib/projectColors';

interface ExcelViewTableProps {
  logs: TimeLog[];
  onUpdateTime: (logId: string, newDuration: number) => void;
  colorCodedEnabled: boolean;
  formatHours: (seconds: number) => string;
}

const ExcelViewTable: React.FC<ExcelViewTableProps> = ({
  logs,
  onUpdateTime,
  colorCodedEnabled,
  formatHours
}) => {
  const [editingLog, setEditingLog] = useState<TimeLog | null>(null);
  const [editFormData, setEditFormData] = useState({
    duration: '',
    description: '',
    startTime: '',
    endTime: ''
  });

  const parseHours = (hours: string) => {
    return parseFloat(hours) * 3600;
  };

  const getRowBackgroundStyle = (projectName: string) => {
    if (!colorCodedEnabled) return {};
    return {
      backgroundColor: generateProjectColor(projectName)
    };
  };

  const handleEditLog = (log: TimeLog) => {
    setEditingLog(log);
    setEditFormData({
      duration: formatHours(log.duration),
      description: log.description,
      startTime: log.startTime,
      endTime: log.endTime
    });
  };

  const handleSaveEdit = () => {
    if (editingLog && editFormData.duration) {
      const newDuration = parseHours(editFormData.duration);
      onUpdateTime(editingLog.id, newDuration);
      setEditingLog(null);
    }
  };

  const handleDeleteLog = (logId: string) => {
    const savedTimeLogs = localStorage.getItem('timesheet-logs');
    if (savedTimeLogs) {
      const timeLogs = JSON.parse(savedTimeLogs);
      const updatedLogs = timeLogs.filter((log: TimeLog) => log.id !== logId);
      localStorage.setItem('timesheet-logs', JSON.stringify(updatedLogs));
      window.location.reload(); // Refresh to update the view
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border-2 border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900">
            <th className="border-2 border-gray-300 dark:border-gray-600 px-3 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase">Project</th>
            <th className="border-2 border-gray-300 dark:border-gray-600 px-3 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase">Subproject</th>
            <th className="border-2 border-gray-300 dark:border-gray-600 px-3 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase">Start</th>
            <th className="border-2 border-gray-300 dark:border-gray-600 px-3 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase">End</th>
            <th className="border-2 border-gray-300 dark:border-gray-600 px-3 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase">Duration (hrs)</th>
            <th className="border-2 border-gray-300 dark:border-gray-600 px-3 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase">Description</th>
            <th className="border-2 border-gray-300 dark:border-gray-600 px-3 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody>
          {logs
            .sort((a, b) => a.startTime.localeCompare(b.startTime))
            .map(log => (
              <tr 
                key={log.id} 
                className="hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                style={getRowBackgroundStyle(log.projectName)}
              >
                <td className="border-2 border-gray-300 dark:border-gray-600 px-3 py-2 text-sm font-medium text-gray-900 dark:text-gray-100">{log.projectName}</td>
                <td className="border-2 border-gray-300 dark:border-gray-600 px-3 py-2 text-sm text-gray-700 dark:text-gray-300">{log.subprojectName}</td>
                <td className="border-2 border-gray-300 dark:border-gray-600 px-3 py-2 text-sm text-gray-700 dark:text-gray-300">{log.startTime}</td>
                <td className="border-2 border-gray-300 dark:border-gray-600 px-3 py-2 text-sm text-gray-700 dark:text-gray-300">{log.endTime}</td>
                <td className="border-2 border-gray-300 dark:border-gray-600 px-3 py-2 text-sm">
                  {editingLog?.id === log.id ? (
                    <Input
                      value={editFormData.duration}
                      onChange={(e) => setEditFormData({...editFormData, duration: e.target.value})}
                      className="w-20 h-8"
                      type="number"
                      step="0.1"
                    />
                  ) : (
                    <span className="font-mono font-bold text-green-700 dark:text-green-400">
                      {formatHours(log.duration)}
                    </span>
                  )}
                </td>
                <td className="border-2 border-gray-300 dark:border-gray-600 px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
                  {editingLog?.id === log.id ? (
                    <Input
                      value={editFormData.description}
                      onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                      className="w-full h-8"
                    />
                  ) : (
                    log.description || '-'
                  )}
                </td>
                <td className="border-2 border-gray-300 dark:border-gray-600 px-3 py-2 text-sm">
                  <div className="flex gap-1">
                    {editingLog?.id === log.id ? (
                      <>
                        <Button
                          onClick={handleSaveEdit}
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0 text-green-600"
                        >
                          <Save className="h-3 w-3" />
                        </Button>
                        <Button
                          onClick={() => setEditingLog(null)}
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          onClick={() => handleEditLog(log)}
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          onClick={() => handleDeleteLog(log.id)}
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0 text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExcelViewTable;