import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';

interface HolidayFormProps {
  newHoliday: { name: string; date: string };
  onHolidayChange: (holiday: { name: string; date: string }) => void;
  onAddHoliday: () => void;
}

const HolidayForm: React.FC<HolidayFormProps> = ({
  newHoliday,
  onHolidayChange,
  onAddHoliday
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="holiday-name" className="text-sm font-medium text-foreground">
            Holiday Name
          </Label>
          <Input
            id="holiday-name"
            value={newHoliday.name}
            onChange={(e) => onHolidayChange({ ...newHoliday, name: e.target.value })}
            placeholder="Enter holiday name..."
            className="border-border/60 bg-input/50 focus:bg-background rounded-xl transition-all duration-300"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="holiday-date" className="text-sm font-medium text-foreground">
            Date
          </Label>
          <Input
            id="holiday-date"
            type="date"
            value={newHoliday.date}
            onChange={(e) => onHolidayChange({ ...newHoliday, date: e.target.value })}
            className="border-border/60 bg-input/50 focus:bg-background rounded-xl transition-all duration-300"
          />
        </div>
      </div>
      <Button 
        onClick={onAddHoliday}
        disabled={!newHoliday.name || !newHoliday.date}
        className="w-full py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Holiday
      </Button>
    </div>
  );
};

export default HolidayForm;