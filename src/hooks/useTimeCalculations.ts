// Custom hook for time-related calculations
// Provides reusable time calculation logic for components

import { useMemo } from 'react';
import { TimeLog } from '@/types';
import { isSameDay } from 'date-fns';

export const useTimeCalculations = (timeLogs: TimeLog[]) => {
  const calculations = useMemo(() => {
    const getDayTotal = (date: Date): number => {
      return timeLogs
        .filter(log => isSameDay(new Date(log.date), date))
        .reduce((total, log) => total + log.duration, 0);
    };

    const getProjectTotal = (projectName: string): number => {
      return timeLogs
        .filter(log => log.projectName === projectName)
        .reduce((total, log) => total + log.duration, 0);
    };

    const getSubprojectTotal = (projectName: string, subprojectName: string): number => {
      return timeLogs
        .filter(log => 
          log.projectName === projectName && 
          log.subprojectName === subprojectName
        )
        .reduce((total, log) => total + log.duration, 0);
    };

    const getProjectDayTime = (projectName: string, date: Date): number => {
      return timeLogs
        .filter(log => 
          log.projectName === projectName && 
          isSameDay(new Date(log.date), date)
        )
        .reduce((total, log) => total + log.duration, 0);
    };

    const getSubprojectDayTime = (projectName: string, subprojectName: string, date: Date): number => {
      return timeLogs
        .filter(log => 
          log.projectName === projectName && 
          log.subprojectName === subprojectName && 
          isSameDay(new Date(log.date), date)
        )
        .reduce((total, log) => total + log.duration, 0);
    };

    const getCurrentDayTotal = (): number => {
      const today = new Date();
      return getDayTotal(today);
    };

    const getWeekTotal = (startDate: Date, endDate: Date): number => {
      return timeLogs
        .filter(log => {
          const logDate = new Date(log.date);
          return logDate >= startDate && logDate <= endDate;
        })
        .reduce((total, log) => total + log.duration, 0);
    };

    const getUniqueProjects = () => {
      const projectMap = new Map<string, { 
        projectName: string; 
        subprojects: Set<string>;
      }>();
      
      timeLogs.forEach(log => {
        if (!projectMap.has(log.projectName)) {
          projectMap.set(log.projectName, {
            projectName: log.projectName,
            subprojects: new Set()
          });
        }
        
        if (log.subprojectName) {
          const project = projectMap.get(log.projectName)!;
          project.subprojects.add(log.subprojectName);
        }
      });
      
      return Array.from(projectMap.values());
    };

    return {
      getDayTotal,
      getProjectTotal,
      getSubprojectTotal,
      getProjectDayTime,
      getSubprojectDayTime,
      getCurrentDayTotal,
      getWeekTotal,
      getUniqueProjects
    };
  }, [timeLogs]);

  return calculations;
};