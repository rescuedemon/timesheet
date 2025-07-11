import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { Holiday } from '../Holidays';

interface HolidayCalendarProps {
  holidays: Holiday[];
}

const HolidayCalendar: React.FC<HolidayCalendarProps> = ({ holidays }) => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const isHoliday = (day: number) => {
    const dateString = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    return holidays.some(holiday => holiday.date === dateString);
  };
  
  const getHolidayName = (day: number) => {
    const dateString = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    const holiday = holidays.find(holiday => holiday.date === dateString);
    return holiday?.name || '';
  };
  
  const renderCalendarDays = () => {
    const days = [];
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-12 border border-border/20"></div>
      );
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = day === currentDate.getDate();
      const isHolidayDay = isHoliday(day);
      const holidayName = getHolidayName(day);
      
      days.push(
        <div
          key={day}
          className={`h-12 border border-border/20 p-1 relative transition-all duration-200 ${
            isToday 
              ? 'bg-primary/20 border-primary/50' 
              : isHolidayDay 
                ? 'bg-accent/30 border-accent/50' 
                : 'hover:bg-accent/10'
          }`}
          title={isHolidayDay ? holidayName : ''}
        >
          <div className="text-sm font-medium text-foreground">{day}</div>
          {isHolidayDay && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-accent rounded-b"></div>
          )}
        </div>
      );
    }
    
    return days;
  };

  return (
    <Card className="bg-gradient-secondary-modern border-border/20 shadow-2xl backdrop-blur-xl hover:border-border/40 transition-all duration-500">
      <CardHeader className="border-b border-border/10">
        <CardTitle className="flex items-center gap-3 text-foreground">
          <Calendar className="h-5 w-5 text-primary" />
          <span className="text-lg tracking-tight">
            {monthNames[currentMonth]} {currentYear}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-7 gap-0 border border-border/30 rounded-xl overflow-hidden">
          {/* Day headers */}
          {dayNames.map(day => (
            <div 
              key={day} 
              className="h-10 bg-muted/50 border-b border-border/20 flex items-center justify-center text-sm font-semibold text-muted-foreground"
            >
              {day}
            </div>
          ))}
          
          {/* Calendar days */}
          {renderCalendarDays()}
        </div>
        
        {holidays.length > 0 && (
          <div className="mt-6 p-4 bg-accent/10 rounded-xl border border-accent/20">
            <h4 className="text-sm font-semibold text-foreground mb-2">Legend</h4>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-4 h-4 bg-accent/30 border border-accent/50 rounded"></div>
              <span>Holiday</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HolidayCalendar;