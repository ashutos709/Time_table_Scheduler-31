
import React from 'react';
import { 
  ChevronDown,
  RefreshCw, 
  FileDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ScheduleActionsProps {
  selectedSection: string;
  onGenerateSchedule: () => void;
  onExportSchedule: () => void;
}

const ScheduleActions: React.FC<ScheduleActionsProps> = ({
  selectedSection,
  onGenerateSchedule,
  onExportSchedule
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="border-skyblue/30 text-skyblue hover:text-skyblue-600">
          Actions
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Schedule Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onGenerateSchedule}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Generate Schedule
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={onExportSchedule}
          disabled={!selectedSection}
        >
          <FileDown className="mr-2 h-4 w-4" />
          Export as CSV
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ScheduleActions;
