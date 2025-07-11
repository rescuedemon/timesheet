import React from 'react';
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar, ArrowLeft, Trash2 } from 'lucide-react';

interface Holiday {
  id: string;
  name: string;
  date: string;
}

interface HolidayDetailProps {
  selectedHolidayMonth: Date | null;
  getHolidaysForMonth: (month: Date) => Holiday[];
  handleRemoveHoliday: (holidayId: string) => void;
  setHolidayOverviewMode: React.Dispatch<React.SetStateAction<'overview' | 'detail'>>;
}

const HolidayDetail: React.FC<HolidayDetailProps> = ({
  selectedHolidayMonth,
  getHolidaysForMonth,
  handleRemoveHoliday,
  setHolidayOverviewMode
}) => {
  if (!selectedHolidayMonth) return null;

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const holidaysInMonth = getHolidaysForMonth(selectedHolidayMonth);

  return (
    <DialogContent className="sm:max-w-3xl bg-white text-black rounded-3xl shadow-2xl p-0 max-h-[90vh] overflow-hidden animate-scale-in">
      <div className="gradient-bg p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-2">
            <button
              onClick={() => setHolidayOverviewMode('overview')}
              className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-all duration-200"
            >
              <ArrowLeft size={20} className="text-white" />
            </button>
            <DialogTitle className="text-2xl font-bold flex items-center gap-3">
              <Calendar size={24} className="text-white" />
              {months[selectedHolidayMonth.getMonth()]} {selectedHolidayMonth.getFullYear()}
            </DialogTitle>
          </div>
          <p className="text-white/80 text-sm">
            {holidaysInMonth.length} {holidaysInMonth.length === 1 ? 'holiday' : 'holidays'} this month
          </p>
        </div>
      </div>

      <div className="p-8 overflow-y-auto max-h-[60vh]">
        {holidaysInMonth.length > 0 ? (
          <div className="space-y-4">
            {holidaysInMonth.map((holiday, index) => (
              <div 
                key={holiday.id} 
                className="flex items-center justify-between p-6 border-2 border-gray-200 rounded-2xl hover:border-gray-400 transition-all duration-200 hover:shadow-lg"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-red-100 rounded-full">
                    <Calendar size={20} className="text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">{holiday.name}</h4>
                    <p className="text-sm text-gray-600">
                      {new Date(holiday.date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
                <button
                  className="text-red-500 hover:text-red-700 hover:bg-red-100 p-2 rounded-full transition-all duration-200 hover:scale-110"
                  onClick={() => handleRemoveHoliday(holiday.id)}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No holidays this month</h3>
            <p className="text-gray-500">This month is all work days!</p>
          </div>
        )}
      </div>
    </DialogContent>
  );
};

export default HolidayDetail;