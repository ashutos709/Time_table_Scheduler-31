
import React, { useState } from 'react';
import { useScheduler } from '@/context/SchedulerContext';
import PageHeader from '@/components/ui/PageHeader';
import DataTable, { Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, X, Clock } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TimeSlot, DAYS, TIME_SLOTS } from '@/types';

const TimeSlotsPage: React.FC = () => {
  const { 
    timeSlots
  } = useScheduler();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  const columns: Column<TimeSlot>[] = [
    {
      header: 'Day',
      accessorKey: 'day' as keyof TimeSlot,
    },
    {
      header: 'Start Time',
      accessorKey: 'startTime' as keyof TimeSlot,
    },
    {
      header: 'End Time',
      accessorKey: 'endTime' as keyof TimeSlot,
    },
  ];
  
  return (
    <div className="space-y-6">
      <PageHeader
        title="Time Slots"
        description="View available time slots for scheduling."
      >
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button disabled>
              <Plus className="mr-2 h-4 w-4" />
              Add Time Slot
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Time Slots</DialogTitle>
              <DialogDescription>
                Time slots are pre-defined in the system. 
                They follow the standard academic scheduling periods.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label className="font-medium">Available Days</Label>
                <div className="grid grid-cols-5 gap-2">
                  {DAYS.map((day) => (
                    <div key={day} className="bg-secondary p-2 rounded text-center">
                      {day}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="font-medium">Available Time Slots</Label>
                <div className="grid grid-cols-1 gap-2">
                  {TIME_SLOTS.map((slot, index) => (
                    <div key={index} className="bg-secondary p-2 rounded text-center">
                      {slot.start} - {slot.end}
                    </div>
                  ))}
                </div>
              </div>
              
              <DialogFooter className="mt-6">
                <Button type="button" onClick={() => setIsAddDialogOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </div>
            
            <button
              onClick={() => setIsAddDialogOpen(false)}
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          </DialogContent>
        </Dialog>
      </PageHeader>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <DataTable
          data={timeSlots}
          columns={columns}
          emptyState={
            <div className="flex flex-col items-center justify-center space-y-3 py-6">
              <Clock className="h-12 w-12 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                No time slots found. This should not happen.
              </p>
            </div>
          }
        />
      
        <div className="space-y-6">
          <div className="bg-secondary/30 glass-effect rounded-lg p-6 space-y-4">
            <h3 className="text-xl font-medium">About Time Slots</h3>
            <p className="text-muted-foreground">
              Time slots are pre-defined periods during which classes can be scheduled. 
              Our system uses a standardized set of time slots to ensure consistency across 
              all schedules.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <h4 className="font-medium">Available Days</h4>
                <ul className="space-y-1">
                  {DAYS.map((day) => (
                    <li key={day} className="text-muted-foreground">• {day}</li>
                  ))}
                </ul>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Time Periods</h4>
                <ul className="space-y-1">
                  {TIME_SLOTS.map((slot, index) => (
                    <li key={index} className="text-muted-foreground">
                      • {slot.start} - {slot.end}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="border-t border-border pt-4 mt-4">
              <h4 className="font-medium mb-2">Weekly Scheduling</h4>
              <p className="text-muted-foreground text-sm">
                The system is designed to maintain a total of 24 hours of lectures per week,
                ensuring that no instructor is scheduled for multiple classes at the same time,
                and that workload is distributed according to instructor designation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeSlotsPage;
