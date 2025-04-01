
import React from 'react';
import { RefreshCw, FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ScheduleToolbarProps {
  selectedSection: string;
  onGenerateSchedule: () => void;
  onExportSchedule: () => void;
}

const ScheduleToolbar: React.FC<ScheduleToolbarProps> = ({
  selectedSection,
  onGenerateSchedule,
  onExportSchedule,
}) => {
  return (
    <div className="flex space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onGenerateSchedule}
        className="hidden sm:flex border-skyblue/30 text-skyblue hover:text-skyblue-600"
      >
        <RefreshCw className="mr-2 h-4 w-4" />
        Generate Schedule
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={onExportSchedule}
        disabled={!selectedSection}
        className="hidden sm:flex border-skyblue/30 text-skyblue hover:text-skyblue-600"
      >
        <FileDown className="mr-2 h-4 w-4" />
        Export CSV
      </Button>
    </div>
  );
};

export default ScheduleToolbar;
