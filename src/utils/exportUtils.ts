// Utility functions for data export operations
// Handles CSV generation and file download functionality

import { TimeLog } from '@/types';
import { formatTime, formatHours } from './timeUtils';
import { format } from 'date-fns';

export interface ExportData {
  headers: string[];
  rows: string[][];
}

export const generateTimesheetCSV = (
  timeLogs: TimeLog[],
  dateRange: { start: Date; end: Date },
  selectedProjects: Set<string>,
  expandedProjects: Set<string>,
  uniqueProjects: Array<{ projectName: string; subprojects: Set<string> }>
): string => {
  const headers = ['Project', 'Subproject', 'Date', 'Hours'];
  const csvRows = [headers.join(',')];
  
  const workingDays = getWorkingDaysInRange(dateRange.start, dateRange.end);
  
  uniqueProjects.forEach(project => {
    if (!selectedProjects.has(project.projectName)) return;
    
    workingDays.forEach(date => {
      const hours = getProjectDayTime(timeLogs, project.projectName, date);
      if (hours > 0) {
        csvRows.push([
          `"${project.projectName}"`,
          '',
          format(date, 'yyyy-MM-dd'),
          formatHours(hours)
        ].join(','));
      }
    });
    
    if (expandedProjects.has(project.projectName)) {
      project.subprojects.forEach(subproject => {
        workingDays.forEach(date => {
          const hours = getSubprojectDayTime(timeLogs, project.projectName, subproject, date);
          if (hours > 0) {
            csvRows.push([
              `"${project.projectName}"`,
              `"${subproject}"`,
              format(date, 'yyyy-MM-dd'),
              formatHours(hours)
            ].join(','));
          }
        });
      });
    }
  });
  
  return csvRows.join('\n');
};

export const generateDetailedTimesheetCSV = (timeLogs: TimeLog[]): string => {
  const headers = ['Date', 'Project', 'Subproject', 'Start Time', 'End Time', 'Duration', 'Description'];
  const csvData = [
    headers.join(','),
    ...timeLogs.map(log => [
      log.date,
      `"${log.projectName}"`,
      `"${log.subprojectName}"`,
      log.startTime,
      log.endTime,
      formatTime(log.duration),
      `"${log.description}"`
    ].join(','))
  ].join('\n');
  
  return csvData;
};

export const downloadCSV = (csvContent: string, filename: string): void => {
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

export const generateFilename = (prefix: string, dateRange?: { start: Date; end: Date }): string => {
  const timestamp = new Date().toISOString().split('T')[0];
  if (dateRange) {
    const startDate = format(dateRange.start, 'yyyyMMdd');
    const endDate = format(dateRange.end, 'yyyyMMdd');
    return `${prefix}_${startDate}_to_${endDate}.csv`;
  }
  return `${prefix}_${timestamp}.csv`;
};

// Helper functions for time calculations
const getWorkingDaysInRange = (start: Date, end: Date): Date[] => {
  const days = [];
  const current = new Date(start);
  while (current <= end) {
    if (current.getDay() !== 0 && current.getDay() !== 6) {
      days.push(new Date(current));
    }
    current.setDate(current.getDate() + 1);
  }
  return days;
};

const getProjectDayTime = (timeLogs: TimeLog[], projectName: string, date: Date): number => {
  return timeLogs
    .filter(log => 
      log.projectName === projectName && 
      new Date(log.date).toDateString() === date.toDateString()
    )
    .reduce((total, log) => total + log.duration, 0);
};

const getSubprojectDayTime = (timeLogs: TimeLog[], projectName: string, subprojectName: string, date: Date): number => {
  return timeLogs
    .filter(log => 
      log.projectName === projectName && 
      log.subprojectName === subprojectName && 
      new Date(log.date).toDateString() === date.toDateString()
    )
    .reduce((total, log) => total + log.duration, 0);
};