import React from 'react';
import { Trash2 } from 'lucide-react';

interface Holiday {
  id: string;
  name: string;
  date: string;
}

interface HolidaySectionProps {
  holidays: Holiday[];
  containerBgColor: string;
  containerTextColor: string;
  handleRemoveHoliday: (holidayId: string) => void;
}

const HolidaySection: React.FC<HolidaySectionProps> = ({
  holidays,
  containerBgColor,
  containerTextColor,
  handleRemoveHoliday
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="px-6 py-4 border-b" style={{ backgroundColor: containerBgColor }}>
        <h3 className="text-lg font-bold" style={{ color: containerTextColor }}>Public Holidays</h3>
      </div>
      <div className="p-6">
        {holidays.map(holiday => (
          <div key={holiday.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
            <div>
              <h4 className="font-bold text-gray-900">{holiday.name}</h4>
              <p className="text-sm font-medium text-gray-600">
                {new Date(holiday.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </p>
            </div>
            <button
              className="text-red-500 hover:text-red-700 p-1 rounded transition-colors"
              onClick={() => handleRemoveHoliday(holiday.id)}
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HolidaySection;