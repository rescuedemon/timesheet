import React from 'react';

interface SimpleProgressBarProps {
  hours: string;
}

const SimpleProgressBar: React.FC<SimpleProgressBarProps> = ({ hours }) => {
  return (
    <div className="mb-6 p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">Total Time Today</div>
          <div className="text-4xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">{hours} hrs</div>
        </div>
        <div className="text-right">
          <div className="w-20 h-20 rounded-full bg-gray-900 flex items-center justify-center border border-gray-800 dark:border-gray-700">
            <div className="text-2xl font-bold text-white">{Math.round(parseFloat(hours))}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleProgressBar;