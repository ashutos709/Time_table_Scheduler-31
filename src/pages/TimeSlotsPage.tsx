
// Fix the TypeScript error by correctly accessing the properties
import React, { useState } from 'react';
import { useScheduler } from '@/context/SchedulerContext';
import PageHeader from '@/components/ui/PageHeader';
import DataTable from '@/components/ui/DataTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, Plus, Clock, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TimeSlot, Day, DAYS } from '@/context/scheduler/types';
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

// Type for data with delete action
interface TimeSlotWithDelete extends TimeSlot {
  deleteAction: JSX.Element;
}

const TimeSlotsPage: React.FC = () => {
  const { timeSlots, addTimeSlot, deleteTimeSlot, clearTimeSlots } = useScheduler();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    day: 'Monday' as Day,
    startTime: '08:00',
    endTime: '09:00',
  });

  // Format the data for the table
  const tableData: TimeSlotWithDelete[] = timeSlots.map((slot) => ({
    ...slot,
    deleteAction: (
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
              This will permanently delete this time slot.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteTimeSlot(slot.id)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    ),
  }));

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTimeSlot({
      day: formData.day,
      startTime: formData.startTime,
      endTime: formData.endTime,
    });
    setIsAddDialogOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      day: 'Monday',
      startTime: '08:00',
      endTime: '09:00',
    });
  };

  const columns = [
    {
      header: 'Day',
      accessorKey: 'day',
    },
    {
      header: 'Start Time',
      accessorKey: 'startTime',
    },
    {
      header: 'End Time',
      accessorKey: 'endTime',
    },
    {
      header: 'Actions',
      cell: (timeSlot: TimeSlotWithDelete) => timeSlot.deleteAction,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Time Slots"
        description="Manage time slots for the schedule."
      >
        <div className="flex items-center gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Clear All
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear All Time Slots</AlertDialogTitle>
                <AlertDialogDescription>
                  This will delete all time slots. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={clearTimeSlots}
                >
                  Clear All
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Time Slot
            </Button>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Time Slot</DialogTitle>
                <DialogDescription>
                  Add a new time slot for scheduling classes.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="day">Day</Label>
                  <Select
                    value={formData.day}
                    onValueChange={(value) => handleInputChange('day', value)}
                  >
                    <SelectTrigger id="day">
                      <SelectValue placeholder="Select a day" />
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
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => handleInputChange('startTime', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => handleInputChange('endTime', e.target.value)}
                  />
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Add Time Slot</Button>
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
        </div>
      </PageHeader>

      <DataTable
        data={tableData}
        columns={columns}
        emptyState={
          <div className="flex flex-col items-center justify-center space-y-3 py-6">
            <Clock className="h-12 w-12 text-muted-foreground/50" />
            <p className="text-lg font-medium">No time slots found</p>
            <p className="text-sm text-muted-foreground">
              Add time slots to start creating schedules.
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
