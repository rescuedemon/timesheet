import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Calendar } from 'lucide-react';
import { Holiday } from '../Holidays';

interface HolidayListProps {
  holidays: Holiday[];
  onDeleteHoliday: (holidayId: string) => void;
}

const HolidayList: React.FC<HolidayListProps> = ({
  holidays,
  onDeleteHoliday
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <Card className="bg-gradient-secondary-modern border-border/20 shadow-2xl backdrop-blur-xl hover:border-border/40 transition-all duration-500">
      <CardHeader className="border-b border-border/10">
        <CardTitle className="flex items-center gap-3 text-foreground">
          <Calendar className="h-5 w-5 text-primary" />
          <span className="text-lg tracking-tight">Holidays List</span>
          <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full font-semibold">
            {holidays.length}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {holidays.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Calendar className="h-16 w-16 mx-auto mb-6 opacity-40" />
            <p className="text-lg font-medium">No holidays added yet</p>
            <p className="text-sm mt-2">Add holidays to track them in your timesheet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {holidays
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
              .map(holiday => (
                <div 
                  key={holiday.id} 
                  className="flex items-center justify-between p-4 border border-border/30 rounded-2xl bg-card/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:border-border/50"
                >
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground">{holiday.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{formatDate(holiday.date)}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDeleteHoliday(holiday.id)}
                    className="border-border/60 hover:bg-destructive/10 hover:border-destructive/50 hover:text-destructive px-4 py-2 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HolidayList;