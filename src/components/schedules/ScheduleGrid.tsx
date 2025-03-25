
import React from 'react';
import { Calendar, AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { DAYS, TIME_SLOTS, ScheduleCell } from '@/types';

interface ScheduleGridProps {
  selectedSection: string;
  scheduleGrid: ScheduleCell[][];
  onGenerateSchedule: () => void;
}

const ScheduleGrid: React.FC<ScheduleGridProps> = ({
  selectedSection,
  scheduleGrid,
  onGenerateSchedule,
}) => {
  if (!selectedSection) {
    return (
      <div className="flex flex-col items-center justify-center h-72 space-y-4 glass-effect rounded-lg p-8">
        <AlertTriangle className="h-12 w-12 text-muted-foreground/50" />
        <h3 className="text-lg font-medium">No Section Selected</h3>
        <p className="text-muted-foreground text-center max-w-md">
          Please select a section from the dropdown above to view its schedule.
        </p>
      </div>
    );
  }

  const hasSchedule = scheduleGrid.some(row => row.some(cell => !cell.isEmpty));

  if (!hasSchedule) {
    return (
      <div className="flex flex-col items-center justify-center h-72 space-y-4 glass-effect rounded-lg p-8">
        <Calendar className="h-12 w-12 text-muted-foreground/50" />
        <h3 className="text-lg font-medium">No Schedule Available</h3>
        <p className="text-muted-foreground text-center max-w-md">
          There is no schedule generated for this section yet. Click the "Generate Schedule" button to create one.
        </p>
        <Button onClick={onGenerateSchedule}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Generate Schedule
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-md border glass-effect animate-fade-in overflow-hidden">
      <Table>
        <TableHeader className="bg-secondary/50">
          <TableRow>
            <TableHead className="font-medium text-foreground w-24">Time</TableHead>
            {DAYS.map((day) => (
              <TableHead key={day} className="font-medium text-foreground">
                {day}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {TIME_SLOTS.map((timeSlot, timeIndex) => (
            <TableRow key={timeIndex}>
              <TableCell className="font-medium bg-secondary/30">
                {timeSlot.start} - {timeSlot.end}
              </TableCell>
              {DAYS.map((_, dayIndex) => {
                const cell = scheduleGrid[dayIndex][timeIndex];
                return (
                  <TableCell
                    key={dayIndex}
                    className={`table-cell-shine ${!cell.isEmpty ? 'bg-secondary/20' : ''}`}
                  >
                    {!cell.isEmpty && cell.course && cell.instructor && cell.room ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="space-y-1">
                              <div className="font-medium">{cell.course.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {cell.instructor.name}
                              </div>
                              <Badge variant="outline" className="text-xs">
                                Room {cell.room.number}
                              </Badge>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="bottom">
                            <div className="space-y-1 text-left">
                              <div className="font-bold">{cell.course.code}: {cell.course.name}</div>
                              <div>Instructor: {cell.instructor.name} ({cell.instructor.designation})</div>
                              <div>Room: {cell.room.number} (Capacity: {cell.room.capacity})</div>
                              <div>Max Students: {cell.course.maxStudents}</div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : null}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ScheduleGrid;
