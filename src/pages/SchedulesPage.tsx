import React, { useState } from 'react';
import { useScheduler } from '@/context/SchedulerContext';
import PageHeader from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Trash2, 
  RefreshCw, 
  Check, 
  X, 
  AlertTriangle, 
  FileDown,
  ChevronDown
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { DAYS, TIME_SLOTS } from '@/types';
import { toast } from 'sonner';
import AddManualScheduleForm from '@/components/schedules/AddManualScheduleForm';

const SchedulesPage: React.FC = () => {
  const { 
    sections, 
    schedules,
    generateSchedule,
    clearSchedules,
    getScheduleForSection
  } = useScheduler();
  
  const [selectedSection, setSelectedSection] = useState<string>('');
  
  const handleGenerateSchedule = () => {
    generateSchedule();
  };
  
  const handleClearSchedules = () => {
    clearSchedules();
    setSelectedSection('');
  };
  
  const handleExportSchedule = () => {
    if (!selectedSection) {
      toast.error("Please select a section first");
      return;
    }
    
    const section = sections.find(s => s.id === selectedSection);
    if (!section) return;
    
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += `Schedule for ${section.name}\r\n\r\n`;
    csvContent += `Time,${DAYS.join(",")}\r\n`;
    
    const scheduleGrid = getScheduleForSection(selectedSection);
    
    TIME_SLOTS.forEach((timeSlot, timeIndex) => {
      let row = `${timeSlot.start} - ${timeSlot.end}`;
      
      DAYS.forEach((_, dayIndex) => {
        const cell = scheduleGrid[dayIndex][timeIndex];
        let cellContent = "";
        
        if (!cell.isEmpty && cell.course && cell.instructor && cell.room) {
          cellContent = `${cell.course.name} (${cell.instructor.name}) - Room ${cell.room.number}`;
        }
        
        row += `,${cellContent}`;
      });
      
      csvContent += row + "\r\n";
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `schedule_${section.name}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Schedule exported to CSV");
  };
  
  const renderScheduleGrid = () => {
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
    
    const section = sections.find(s => s.id === selectedSection);
    if (!section) return null;
    
    const scheduleGrid = getScheduleForSection(selectedSection);
    const hasSchedule = scheduleGrid.some(row => row.some(cell => !cell.isEmpty));
    
    if (!hasSchedule) {
      return (
        <div className="flex flex-col items-center justify-center h-72 space-y-4 glass-effect rounded-lg p-8">
          <Calendar className="h-12 w-12 text-muted-foreground/50" />
          <h3 className="text-lg font-medium">No Schedule Available</h3>
          <p className="text-muted-foreground text-center max-w-md">
            There is no schedule generated for this section yet. Click the "Generate Schedule" button to create one.
          </p>
          <Button onClick={handleGenerateSchedule}>
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
  
  return (
    <div className="space-y-8">
      <PageHeader
        title="Schedules"
        description="Generate and view class schedules."
      >
        <div className="flex space-x-2">
          <AddManualScheduleForm />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Actions
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Schedule Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleGenerateSchedule}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Generate Schedule
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleExportSchedule}
                disabled={!selectedSection}
              >
                <FileDown className="mr-2 h-4 w-4" />
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => document.getElementById('clear-schedule-dialog')?.click()}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Clear All Schedules
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <AlertDialog>
          <AlertDialogTrigger id="clear-schedule-dialog" className="hidden" />
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Clear All Schedules</AlertDialogTitle>
              <AlertDialogDescription>
                This will delete all generated schedules. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={handleClearSchedules}
              >
                Delete All Schedules
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </PageHeader>
      
      <div className="flex justify-between items-center space-x-4">
        <div className="flex-1 max-w-xs">
          <Select
            value={selectedSection}
            onValueChange={setSelectedSection}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a section" />
            </SelectTrigger>
            <SelectContent>
              {sections.length === 0 ? (
                <div className="py-2 px-2 text-sm text-muted-foreground">
                  No sections available
                </div>
              ) : (
                sections.map(section => (
                  <SelectItem key={section.id} value={section.id}>
                    {section.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleGenerateSchedule}
            className="hidden sm:flex"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Generate Schedule
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportSchedule}
            disabled={!selectedSection}
            className="hidden sm:flex"
          >
            <FileDown className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>
      
      <div className="relative">
        {schedules.length > 0 && (
          <div className="absolute -top-4 right-0 flex space-x-2 items-center text-sm">
            <span className="text-muted-foreground">Total Scheduled Classes:</span>
            <Badge variant="outline" className="text-xs">
              {schedules.length}
            </Badge>
          </div>
        )}
        
        {renderScheduleGrid()}
      </div>
      
      <div className="hidden md:block bg-secondary/30 glass-effect rounded-lg p-6 space-y-4">
        <h3 className="text-xl font-medium">Scheduling Constraints</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="flex items-center">
              <Check className="mr-2 h-4 w-4 text-teal-500" />
              <h4 className="font-medium">Weekly Hours</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Total of 24 hours of lecture time per week.
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center">
              <Check className="mr-2 h-4 w-4 text-teal-500" />
              <h4 className="font-medium">Instructor Conflicts</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              No instructor teaches two classes at the same time.
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center">
              <Check className="mr-2 h-4 w-4 text-teal-500" />
              <h4 className="font-medium">Workload by Designation</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Teaching hours distributed based on instructor designation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchedulesPage;
