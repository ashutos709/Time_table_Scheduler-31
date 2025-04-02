
import React, { useState } from 'react';
import { useScheduler } from '@/context/SchedulerContext';
import PageHeader from '@/components/ui/PageHeader';
import DataTable, { Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, X, Clock, Trash2 } from 'lucide-react';
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
import { TimeSlot, DAYS } from '@/types';
import { toast } from 'sonner';

const TimeSlotsPage: React.FC = () => {
  const { 
    timeSlots,
    addTimeSlot,
    deleteTimeSlot,
    clearTimeSlots
  } = useScheduler();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isCustomDialogOpen, setIsCustomDialogOpen] = useState(false);
  const [customTimeSlot, setCustomTimeSlot] = useState({
    day: DAYS[0],
    startTime: '',
    endTime: ''
  });
  
  const handleCustomInputChange = (field: string, value: string) => {
    setCustomTimeSlot(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddCustomTimeSlot = () => {
    const { day, startTime, endTime } = customTimeSlot;
    
    if (!day || !startTime || !endTime) {
      toast.error('Please fill in all fields');
      return;
    }
    
    if (startTime >= endTime) {
      toast.error('Start time must be before end time');
      return;
    }
    
    addTimeSlot({
      day,
      startTime,
      endTime
    });
    
    toast.success('Time slot added successfully!');
    setCustomTimeSlot({
      day: DAYS[0],
      startTime: '',
      endTime: ''
    });
    setIsCustomDialogOpen(false);
  };

  const handleClearAllTimeSlots = () => {
    if (confirm('Are you sure you want to delete all time slots? This action cannot be undone.')) {
      clearTimeSlots();
      toast.success('All time slots have been deleted');
    }
  };
  
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
    {
      header: 'Actions',
      cell: ({ row }) => (
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => deleteTimeSlot(row.original.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      ),
    }
  ];
  
  return (
    <div className="space-y-6">
      <PageHeader
        title="Time Slots"
        description="Manage custom time slots for scheduling."
      >
        <div className="flex space-x-2">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                About Time Slots
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Time Slots</DialogTitle>
                <DialogDescription>
                  Time slots define when classes can be scheduled throughout the week.
                  You can create custom time slots based on your institution's schedule.
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

          <Dialog open={isCustomDialogOpen} onOpenChange={setIsCustomDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Clock className="mr-2 h-4 w-4" />
                Add Custom Time Slot
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Custom Time Slot</DialogTitle>
                <DialogDescription>
                  Create a custom time slot for your scheduling needs.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label htmlFor="day">Day</Label>
                  <Select 
                    value={customTimeSlot.day}
                    onValueChange={(value) => handleCustomInputChange('day', value)}
                  >
                    <SelectTrigger id="day">
                      <SelectValue placeholder="Select day" />
                    </SelectTrigger>
                    <SelectContent>
                      {DAYS.map(day => (
                        <SelectItem key={day} value={day}>
                          {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={customTimeSlot.startTime}
                    onChange={(e) => handleCustomInputChange('startTime', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={customTimeSlot.endTime}
                    onChange={(e) => handleCustomInputChange('endTime', e.target.value)}
                  />
                </div>
                
                <DialogFooter className="mt-6">
                  <Button type="button" variant="outline" onClick={() => setIsCustomDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddCustomTimeSlot}
                  >
                    Add Time Slot
                  </Button>
                </DialogFooter>
              </div>
              
              <button
                onClick={() => setIsCustomDialogOpen(false)}
                className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </button>
            </DialogContent>
          </Dialog>

          <Button variant="destructive" onClick={handleClearAllTimeSlots}>
            <Trash2 className="mr-2 h-4 w-4" />
            Clear All Time Slots
          </Button>
        </div>
      </PageHeader>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <DataTable
          data={timeSlots}
          columns={columns}
          emptyState={
            <div className="flex flex-col items-center justify-center space-y-3 py-6">
              <Clock className="h-12 w-12 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                No time slots found. Add custom time slots using the button above.
              </p>
            </div>
          }
        />
      
        <div className="space-y-6">
          <div className="bg-secondary/30 glass-effect rounded-lg p-6 space-y-4">
            <h3 className="text-xl font-medium">About Time Slots</h3>
            <p className="text-muted-foreground">
              Time slots define when classes can be scheduled. You can create custom time slots
              based on your institution's schedule.
            </p>
            
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
