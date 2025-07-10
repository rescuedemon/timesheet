// Date navigation component for timesheet views
// Provides consistent date navigation controls

import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface DateNavigationProps {
  currentDate?: Date;
  dateRange?: { start: Date; end: Date };
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
  title?: string;
  showDateInputs?: boolean;
  onDateChange?: (type: 'start' | 'end', date: Date) => void;
}

const DateNavigation: React.FC<DateNavigationProps> = ({
  currentDate,
  dateRange,
  onPrevious,
  onNext,
  onToday,
  title,
  showDateInputs = false,
  onDateChange
}) => {
  const displayTitle = title || (
    currentDate 
      ? format(currentDate, 'EEEE, MMMM d, yyyy')
      : dateRange 
        ? `${format(dateRange.start, 'MMM d, yyyy')} - ${format(dateRange.end, 'MMM d, yyyy')}`
        : ''
  );

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <Button onClick={onPrevious} variant="outline" size="sm" className="btn-modern shadow-lg hover:shadow-xl rounded-xl">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="text-xl font-bold text-foreground min-w-[300px] text-center bg-muted/30 px-6 py-3 rounded-xl border border-border/20 shadow-lg backdrop-blur-sm">
          {displayTitle}
        </div>
        
        <Button onClick={onNext} variant="outline" size="sm" className="btn-modern shadow-lg hover:shadow-xl rounded-xl">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      {showDateInputs && dateRange && onDateChange && (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-muted-foreground">From:</label>
            <input
              type="date"
              value={format(dateRange.start, 'yyyy-MM-dd')}
              onChange={(e) => onDateChange('start', new Date(e.target.value))}
              className="border border-border rounded px-2 py-1"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-muted-foreground">To:</label>
            <input
              type="date"
              value={format(dateRange.end, 'yyyy-MM-dd')}
              onChange={(e) => onDateChange('end', new Date(e.target.value))}
              className="border border-border rounded px-2 py-1"
            />
          </div>
        </div>
      )}
      
      <Button onClick={onToday} variant="secondary" size="sm" className="btn-modern shadow-lg hover:shadow-xl rounded-xl">
        <Calendar className="h-4 w-4 mr-2" />
        {currentDate ? 'Today' : 'This Week'}
      </Button>
    </div>
  );
};

export default DateNavigation;