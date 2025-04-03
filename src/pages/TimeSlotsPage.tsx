import React from 'react';
import DataTable from '@/components/ui/DataTable';
import { TimeSlot } from '@/types';
import { useScheduler } from '@/context/SchedulerContext';
import { Button } from '@/components/ui/button';
import { Plus, Trash } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DAYS } from '@/types';
import { Column } from '@/components/ui/DataTable';

// Define the column type for TypeScript
type TimeSlotWithDelete = TimeSlot & { deleteHandler: () => void };

// Correctly typed columns for the DataTable component
const columns: Column<TimeSlotWithDelete>[] = [
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
    cell: ({ row }) => {
      const timeSlot = row.original;
      return (
        <Button variant="destructive" size="sm" onClick={() => timeSlot.deleteHandler()}>
          <Trash className="h-4 w-4 mr-2" />
          Delete
        </Button>
      );
    },
  }
];

const timeSlotSchema = z.object({
  day: z.string().min(1, 'Day is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
});

type TimeSlotFormValues = z.infer<typeof timeSlotSchema>;

function TimeSlotDialog({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) {
  const { addTimeSlot } = useScheduler();
  const form = useForm<TimeSlotFormValues>({
    resolver: zodResolver(timeSlotSchema),
    defaultValues: {
      day: 'Monday',
      startTime: '09:00',
      endTime: '10:00'
    }
  });

  const onSubmit = (values: TimeSlotFormValues) => {
    const timeSlotData: Omit<TimeSlot, 'id'> = {
      day: values.day,
      startTime: values.startTime,
      endTime: values.endTime
    };
    
    addTimeSlot(timeSlotData);
    form.reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Time Slot</DialogTitle>
          <DialogDescription>Create a new time slot for scheduling classes.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="day"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Day</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a day" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {DAYS.map((day) => (
                        <SelectItem key={day} value={day}>{day}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Time</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Time</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

const TimeSlotsPage = () => {
  const { timeSlots, deleteTimeSlot, clearTimeSlots } = useScheduler();
  const [open, setOpen] = React.useState(false);
  
  const handleClear = () => {
    clearTimeSlots();
  };
  
  const tableData: TimeSlotWithDelete[] = timeSlots.map(timeSlot => ({
    ...timeSlot,
    deleteHandler: () => deleteTimeSlot(timeSlot.id),
  }));
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Time Slots</h1>
        <div>
          <Button variant="destructive" onClick={handleClear} className="mr-2">
            <Trash className="h-4 w-4 mr-2" />
            Clear All
          </Button>
          <Button onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Time Slot
          </Button>
        </div>
      </div>
      <DataTable 
        columns={columns} 
        data={tableData} 
        emptyState={<div>No time slots added yet. Click "Add Time Slot" to create one.</div>}
      />
      <TimeSlotDialog open={open} setOpen={setOpen} />
    </div>
  );
};

export default TimeSlotsPage;
