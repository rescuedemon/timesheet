import React from 'react';
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar } from 'lucide-react';

interface Holiday {
  id: string;
  name: string;
  date: string;
}

interface HolidayOverviewProps {
  holidays: Holiday[];
  getHolidaysForMonth: (month: Date) => Holiday[];
  setSelectedHolidayMonth: React.Dispatch<React.SetStateAction<Date | null>>;
  setHolidayOverviewMode: React.Dispatch<React.SetStateAction<'overview' | 'detail'>>;
}

const HolidayOverview: React.FC<HolidayOverviewProps> = ({
  holidays,
  getHolidaysForMonth,
  setSelectedHolidayMonth,
  setHolidayOverviewMode
}) => {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const currentYear = new Date().getFullYear();

  const handleMonthClick = (monthIndex: number) => {
    const selectedMonth = new Date(currentYear, monthIndex, 1);
    setSelectedHolidayMonth(selectedMonth);
    setHolidayOverviewMode('detail');
  };

  return (
    <DialogContent className="sm:max-w-4xl bg-white text-black rounded-3xl shadow-2xl p-0 max-h-[90vh] overflow-hidden animate-scale-in">
      <div className="gradient-bg p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
        <div className="relative z-10">
          <DialogTitle className="text-2xl font-bold flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/20 rounded-full">
              <Calendar size={24} className="text-white" />
            </div>
            Holiday Overview {currentYear}
          </DialogTitle>
          <p className="text-white/80 text-sm">
            View holidays by month and plan your year
          </p>
        </div>
      </div>

      <div className="p-8 overflow-y-auto max-h-[60vh]">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {months.map((month, index) => {
            const monthDate = new Date(currentYear, index, 1);
            const holidaysInMonth = getHolidaysForMonth(monthDate);
            const holidayCount = holidaysInMonth.length;
            
            return (
              <button
                key={month}
                onClick={() => handleMonthClick(index)}
                className="group p-6 bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 hover:border-gray-400 rounded-2xl transition-all duration-500 ease-out hover:scale-105 hover:shadow-xl"
              >
                <div className="text-center">
                  <h3 className="font-bold text-gray-800 mb-2 group-hover:text-gray-900 transition-colors">{month}</h3>
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <span className="text-2xl font-bold text-gray-600 group-hover:text-blue-600 transition-colors">{holidayCount}</span>
                    <span className="text-sm text-gray-500">
                      {holidayCount === 1 ? 'holiday' : 'holidays'}
                    </span>
                  </div>
                  {holidayCount > 0 && (
                    <div className="flex flex-wrap justify-center gap-1 mb-2">
                       {holidaysInMonth.map(holiday => {
                         const day = new Date(holiday.date).getDate();
                         return (
                           <div 
                             key={holiday.id} 
                             className="w-6 h-6 bg-red-500 text-white rounded-full shadow-lg hover:scale-125 transition-transform duration-200 flex items-center justify-center text-xs font-bold"
                             title={`${holiday.name} - ${day}`}
                           >
                             {day}
                           </div>
                         );
                       })}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </DialogContent>
  );
};

export default HolidayOverview;