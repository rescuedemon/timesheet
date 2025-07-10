// Export functionality component
// Handles CSV export with customizable options

import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { TimeLog, DateRange } from '@/types';
import { generateTimesheetCSV, generateDetailedTimesheetCSV, downloadCSV, generateFilename } from '@/utils/exportUtils';

interface ExportButtonProps {
  timeLogs: TimeLog[];
  dateRange?: DateRange;
  selectedProjects?: Set<string>;
  expandedProjects?: Set<string>;
  uniqueProjects?: Array<{ projectName: string; subprojects: Set<string> }>;
  exportType?: 'summary' | 'detailed';
  filename?: string;
  className?: string;
}

const ExportButton: React.FC<ExportButtonProps> = ({
  timeLogs,
  dateRange,
  selectedProjects,
  expandedProjects,
  uniqueProjects,
  exportType = 'detailed',
  filename,
  className
}) => {
  const handleExport = () => {
    if (timeLogs.length === 0) {
      alert('No data to export');
      return;
    }

    let csvContent: string;
    let defaultFilename: string;

    if (exportType === 'summary' && dateRange && selectedProjects && expandedProjects && uniqueProjects) {
      csvContent = generateTimesheetCSV(
        timeLogs,
        dateRange,
        selectedProjects,
        expandedProjects,
        uniqueProjects
      );
      defaultFilename = generateFilename('timesheet-summary', dateRange);
    } else {
      csvContent = generateDetailedTimesheetCSV(timeLogs);
      defaultFilename = generateFilename('timesheet-detailed');
    }

    downloadCSV(csvContent, filename || defaultFilename);
  };

  return (
    <Button 
      onClick={handleExport}
      variant="outline" 
      size="sm"
      className={className || "btn-modern shadow-lg hover:shadow-xl rounded-xl"}
    >
      <Download className="h-4 w-4 mr-2" />
      Export CSV
    </Button>
  );
};

export default ExportButton;