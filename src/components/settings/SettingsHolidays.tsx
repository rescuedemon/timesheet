import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2 } from 'lucide-react';

interface Holiday {
  id: string;
  name: string;
  date: string;
}

interface SettingsHolidaysProps {
  holidays: Holiday[];
  setHolidays: (holidays: Holiday[]) => void;
}

const SettingsHolidays: React.FC<SettingsHolidaysProps> = ({ holidays, setHolidays }) => {
  const [newHoliday, setNewHoliday] = useState({ name: '', date: '' });

  const handleAddHoliday = () => {
    if (newHoliday.name && newHoliday.date) {
      const holiday = {
        id: Date.now().toString(),
        ...newHoliday
      };
      const updatedHolidays = [...holidays, holiday];
      setHolidays(updatedHolidays);
      localStorage.setItem('timesheet-holidays', JSON.stringify(updatedHolidays));
      setNewHoliday({ name: '', date: '' });
    }
  };

  const handleRemoveHoliday = (holidayId: string) => {
    const updatedHolidays = holidays.filter(h => h.id !== holidayId);
    setHolidays(updatedHolidays);
    localStorage.setItem('timesheet-holidays', JSON.stringify(updatedHolidays));
  };

  const handleDeleteHoliday = (holidayId: string) => {
    const updatedHolidays = holidays.filter(h => h.id !== holidayId);
    setHolidays(updatedHolidays);
    localStorage.setItem('timesheet-holidays', JSON.stringify(updatedHolidays));
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Add New Holiday</Label>
        <div className="flex gap-2">
          <Input
            value={newHoliday.name}
            onChange={(e) => setNewHoliday({...newHoliday, name: e.target.value})}
            placeholder="Holiday name..."
          />
          <Input
            type="date"
            value={newHoliday.date}
            onChange={(e) => setNewHoliday({...newHoliday, date: e.target.value})}
          />
          <Button onClick={handleAddHoliday}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>Existing Holidays</Label>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {holidays.map(holiday => (
            <div key={holiday.id} className="border rounded p-3 flex items-center justify-between">
              <div>
                <h4 className="font-medium">{holiday.name}</h4>
                <p className="text-sm text-muted-foreground">{holiday.date}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteHoliday(holiday.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SettingsHolidays;