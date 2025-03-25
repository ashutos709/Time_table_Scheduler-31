
import React, { useState, useRef } from 'react';
import { useScheduler } from '@/context/SchedulerContext';
import PageHeader from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import AddManualScheduleForm from '@/components/schedules/AddManualScheduleForm';
import ScheduleGrid from '@/components/schedules/ScheduleGrid';
import ScheduleActions from '@/components/schedules/ScheduleActions';
import SectionSelector from '@/components/schedules/SectionSelector';
import SchedulingConstraints from '@/components/schedules/SchedulingConstraints';
import ClearScheduleDialog from '@/components/schedules/ClearScheduleDialog';
import ScheduleToolbar from '@/components/schedules/ScheduleToolbar';

const SchedulesPage: React.FC = () => {
  const { 
    sections, 
    schedules,
    generateSchedule,
    clearSchedules,
    getScheduleForSection
  } = useScheduler();
  
  const [selectedSection, setSelectedSection] = useState<string>('');
  const clearDialogTriggerRef = useRef<HTMLButtonElement>(null);
  
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
  
  const openClearDialog = () => {
    if (clearDialogTriggerRef.current) {
      clearDialogTriggerRef.current.click();
    }
  };
  
  const scheduleGrid = selectedSection ? getScheduleForSection(selectedSection) : [];
  
  return (
    <div className="space-y-8">
      <PageHeader
        title="Schedules"
        description="Generate and view class schedules."
      >
        <div className="flex space-x-2">
          <AddManualScheduleForm />
          
          <ScheduleActions
            selectedSection={selectedSection}
            onGenerateSchedule={handleGenerateSchedule}
            onExportSchedule={handleExportSchedule}
            onOpenClearDialog={openClearDialog}
          />
        </div>
        
        <ClearScheduleDialog
          triggerRef={clearDialogTriggerRef}
          onConfirmClear={handleClearSchedules}
        />
      </PageHeader>
      
      <div className="flex justify-between items-center space-x-4">
        <SectionSelector
          sections={sections}
          selectedSection={selectedSection}
          onSectionChange={setSelectedSection}
        />
        
        <ScheduleToolbar
          selectedSection={selectedSection}
          onGenerateSchedule={handleGenerateSchedule}
          onExportSchedule={handleExportSchedule}
        />
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
        
        <ScheduleGrid
          selectedSection={selectedSection}
          scheduleGrid={scheduleGrid}
          onGenerateSchedule={handleGenerateSchedule}
        />
      </div>
      
      <SchedulingConstraints />
    </div>
  );
};

import { DAYS, TIME_SLOTS } from '@/types';

export default SchedulesPage;
