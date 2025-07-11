import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, FileSpreadsheet } from 'lucide-react';
import WeeklyTimesheet from '../WeeklyTimesheet';
import ExcelViewDetailed from './ExcelViewDetailed';
import { TimeLog } from '../TimeTracker';

interface ExcelViewTabsProps {
  filteredTimeLogs: TimeLog[];
  onUpdateTime: (logId: string, newDuration: number) => void;
}

const ExcelViewTabs: React.FC<ExcelViewTabsProps> = ({
  filteredTimeLogs,
  onUpdateTime
}) => {
  return (
    <Tabs defaultValue="weekly" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-6 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900">
        <TabsTrigger value="weekly" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">
          <Calendar className="h-4 w-4" />
          Weekly View
        </TabsTrigger>
        <TabsTrigger value="detailed" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">
          <FileSpreadsheet className="h-4 w-4" />
          Daily View
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="weekly">
        <WeeklyTimesheet timeLogs={filteredTimeLogs} onUpdateTime={onUpdateTime} />
      </TabsContent>
      
      <TabsContent value="detailed">
        <ExcelViewDetailed timeLogs={filteredTimeLogs} onUpdateTime={onUpdateTime} />
      </TabsContent>
    </Tabs>
  );
};

export default ExcelViewTabs;