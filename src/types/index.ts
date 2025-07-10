// Central type definitions for the entire application
// This file consolidates all TypeScript interfaces and types used across components

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

export interface QueuedProject {
  id: string;
  projectId: string;
  subprojectId: string;
  projectName: string;
  subprojectName: string;
  elapsedTime: number;
  startTime: Date;
}

export interface Holiday {
  id: string;
  name: string;
  date: string;
}

export interface DateRange {
  start: Date;
  end: Date;
}

export interface ProgressBarSettings {
  enabled: boolean;
  color: string;
  targetHours: number;
}

export interface ProjectColorSettings {
  enabled: boolean;
  colors: Record<string, string>;
}

export interface AppSettings {
  progressBar: ProgressBarSettings;
  colorCodedProjects: boolean;
  frequentSubprojects: boolean;
  darkMode: boolean;
}