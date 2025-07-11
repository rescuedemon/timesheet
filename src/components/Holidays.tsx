import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, Plus, Trash2 } from 'lucide-react';
import HolidayForm from './holidays/HolidayForm';
import HolidayList from './holidays/HolidayList';
import HolidayCalendar from './holidays/HolidayCalendar';

export interface Holiday {
  id: string;
  name: string;
  date: string;
}

const Holidays: React.FC = () => {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [newHoliday, setNewHoliday] = useState({ name: '', date: '' });

  useEffect(() => {
    const savedHolidays = localStorage.getItem('timesheet-holidays');
    if (savedHolidays) {
      setHolidays(JSON.parse(savedHolidays));
    }
  }, []);

  const handleAddHoliday = () => {
    if (newHoliday.name && newHoliday.date) {
      const holiday: Holiday = {
        id: Date.now().toString(),
        ...newHoliday
      };
      const updatedHolidays = [...holidays, holiday];
      setHolidays(updatedHolidays);
      localStorage.setItem('timesheet-holidays', JSON.stringify(updatedHolidays));
      setNewHoliday({ name: '', date: '' });
    }
  };

  const handleDeleteHoliday = (holidayId: string) => {
    const updatedHolidays = holidays.filter(h => h.id !== holidayId);
    setHolidays(updatedHolidays);
    localStorage.setItem('timesheet-holidays', JSON.stringify(updatedHolidays));
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <Card className="bg-gradient-secondary-modern border-border/20 shadow-2xl backdrop-blur-xl hover:border-border/40 transition-all duration-500">
        <CardHeader className="pb-6 border-b border-border/10">
          <CardTitle className="flex items-center gap-3 text-foreground">
            <Calendar className="h-6 w-6 text-primary" />
            <span className="text-xl tracking-tight">Holiday Management</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <HolidayForm
            newHoliday={newHoliday}
            onHolidayChange={setNewHoliday}
            onAddHoliday={handleAddHoliday}
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <HolidayList
          holidays={holidays}
          onDeleteHoliday={handleDeleteHoliday}
        />
        <HolidayCalendar holidays={holidays} />
      </div>
    </div>
  );
};

export default Holidays;