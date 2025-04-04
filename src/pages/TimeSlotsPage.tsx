import React, { useState } from 'react';
import { useScheduler } from '@/context/SchedulerContext';
import PageHeader from '@/components/ui/PageHeader';
import DataTable, { Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, Plus, Edit, X, Clock } from 'lucide-react';
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
import { TimeSlot, Day, DAYS } from '@/types';

// Add this helper type for the table
interface TimeSlotWithDelete extends TimeSlot {
  onDelete?: () => void;
}

const TimeSlotsPage: React.FC = () => {
  const { timeSlots, addTimeSlot, deleteTimeSlot, clearTimeSlots } = useScheduler();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    day: DAYS[0],
    startTime: '',
    endTime: '',
  });
  
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleDayChange = (day: Day) => {
    setFormData(prev => ({
      ...prev,
      day,
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.startTime || !formData.endTime) {
      alert('Please fill in all fields');
      return;
    }
    
    addTimeSlot({
      day: formData.day,
      startTime: formData.startTime,
      endTime: formData.endTime
    });
    
    setFormData({
      day: DAYS[0],
      startTime: '',
      endTime: '',
    });
    
    setIsAddDialogOpen(false);
  };
  
  const formatTime = (time: string) => {
    try {
      if (!time) return '';
      const [hours, minutes] = time.split(':');
      
      if (!hours || !minutes) return time;
      
      const hour = parseInt(hours, 10);
      const suffix = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
      
      return `${displayHour}:${minutes} ${suffix}`;
    } catch (error) {
      console.error('Error formatting time:', error);
      return time;
    }
  };
  
  const handleDeleteTimeSlot = (id: string) => {
    deleteTimeSlot(id);
  };
  
  const timeSlotData: TimeSlotWithDelete[] = timeSlots.map(slot => ({
    ...slot,
    onDelete: () => handleDeleteTimeSlot(slot.id)
  }));
  
  const columns: Column<TimeSlotWithDelete>[] = [
    {
      header: 'Day',
      accessorKey: 'day'
    },
    {
      header: 'Start Time',
      cell: (row) => formatTime(row.startTime)
    },
    {
      header: 'End Time',
      cell: (row) => formatTime(row.endTime)
    },
    {
      header: 'Actions',
      cell: (row) => (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-destructive hover:text-destructive/90"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Time Slot</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete this time slot. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={() => row.onDelete && row.onDelete()}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )
    },
  ];
  
  return (
    <div className="space-y-6">
      <PageHeader
        title="Time Slots"
        description="Define time slots for scheduling classes."
      >
        <div className="flex space-x-2">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Time Slot
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add Time Slot</DialogTitle>
                <DialogDescription>
                  Define a new time slot for scheduling.
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label htmlFor="day">Day</Label>
                  <Select
                    value={formData.day}
                    onValueChange={(value) => handleDayChange(value as Day)}
                  >
                    <SelectTrigger id="day">
                      <SelectValue placeholder="Select day" />
                    </SelectTrigger>
                    <SelectContent>
                      {DAYS.map((day) => (
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
                    name="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time</Label>
                  <Input
                    id="endTime"
                    name="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <DialogFooter className="mt-6">
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    Add Time Slot
                  </Button>
                </DialogFooter>
              </form>
              
              <button
                onClick={() => setIsAddDialogOpen(false)}
                className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </button>
            </DialogContent>
          </Dialog>
          
          {timeSlots.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="border-destructive text-destructive hover:bg-destructive/10">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear All
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear All Time Slots</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete all time slots. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={clearTimeSlots}
                  >
                    Delete All
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </PageHeader>
      
      <DataTable
        data={timeSlotData}
        columns={columns}
        emptyState={
          <div className="flex flex-col items-center justify-center space-y-3 py-6">
            <Clock className="h-12 w-12 text-muted-foreground/50" />
            <p className="text-lg font-medium">No time slots found</p>
            <p className="text-sm text-muted-foreground">
              Add time slots to define when classes can be scheduled.
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Time Slot
            </Button>
          </div>
        }
      />
    </div>
  );
};

export default TimeSlotsPage;
