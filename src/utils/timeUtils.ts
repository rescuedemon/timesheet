// Utility functions for time formatting and calculations
// Centralizes all time-related operations used throughout the application

export const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const formatHours = (seconds: number): string => {
  return (seconds / 3600).toFixed(1);
};

export const formatDuration = (seconds: number): string => {
  const hours = (seconds / 3600).toFixed(2);
  return `${hours}h`;
};

export const parseHours = (hours: string): number => {
  return parseFloat(hours) * 3600;
};

export const formatTimeDisplay = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
};

export const getCurrentTimeString = (): string => {
  return new Date().toLocaleTimeString();
};

export const formatDateString = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const isToday = (date: Date): boolean => {
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

export const isYesterday = (date: Date): boolean => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return date.toDateString() === yesterday.toDateString();
};