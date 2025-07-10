// Utility functions for date operations and formatting
// Handles all date-related calculations and formatting throughout the app

import { format, startOfWeek, endOfWeek, addDays, subDays, isSameDay, eachDayOfInterval } from 'date-fns';

export const getWeekRange = (date: Date = new Date()) => ({
  start: startOfWeek(date, { weekStartsOn: 1 }),
  end: endOfWeek(date, { weekStartsOn: 1 })
});

export const getWorkingDaysInRange = (startDate: Date, endDate: Date): Date[] => {
  const allDays = eachDayOfInterval({ start: startDate, end: endDate });
  return allDays.filter(day => day.getDay() !== 0 && day.getDay() !== 6); // Filter out weekends
};

export const formatDateRange = (start: Date, end: Date): string => {
  return `${format(start, 'MMM d, yyyy')} - ${format(end, 'MMM d, yyyy')}`;
};

export const formatDisplayDate = (date: Date): string => {
  const today = new Date();
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
  
  if (isSameDay(date, today)) {
    return `Today - ${format(date, 'EEEE, MMMM d, yyyy')}`;
  } else if (isSameDay(date, yesterday)) {
    return `Yesterday - ${format(date, 'EEEE, MMMM d, yyyy')}`;
  }
  
  return format(date, 'EEEE, MMMM d, yyyy');
};

export const navigateWeek = (currentRange: { start: Date; end: Date }, direction: 'prev' | 'next' | 'current') => {
  switch (direction) {
    case 'prev':
      return {
        start: subDays(currentRange.start, 7),
        end: subDays(currentRange.end, 7)
      };
    case 'next':
      return {
        start: addDays(currentRange.start, 7),
        end: addDays(currentRange.end, 7)
      };
    case 'current':
      return getWeekRange();
    default:
      return currentRange;
  }
};

export const navigateDay = (currentDate: Date, direction: 'prev' | 'next' | 'today') => {
  switch (direction) {
    case 'prev':
      return subDays(currentDate, 1);
    case 'next':
      return addDays(currentDate, 1);
    case 'today':
      return new Date();
    default:
      return currentDate;
  }
};