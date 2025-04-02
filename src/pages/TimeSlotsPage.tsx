import React from 'react';
import { DataTable } from '@/components/ui/data-table';
import { TimeSlot } from '@/types';
import { useScheduler } from '@/context/SchedulerContext';
import { Button } from '@/components/ui/button';
import { PlusIcon, TrashIcon } from '@radix-ui/react-icons';
import { TimeSlotDialog } from '@/components/dialogs/TimeSlotDialog';

const columns = [
  {
    accessorKey: 'day',
    header: 'Day',
  },
  {
    accessorKey: 'startTime',
    header: 'Start Time',
  },
  {
    accessorKey: 'endTime',
    header: 'End Time',
  },
];

const TimeSlotsPage = () => {
  const { timeSlots, deleteTimeSlot, clearTimeSlots } = useScheduler();
  const [open, setOpen] = React.useState(false);
  
  const handleDelete = (id: string) => {
    deleteTimeSlot(id);
  };
  
  const handleClear = () => {
    clearTimeSlots();
  };
  
  const actions = (timeSlot: TimeSlot) => (
    <div className="flex items-center space-x-2">
      <Button variant="destructive" size="sm" onClick={() => handleDelete(timeSlot.id)}>
        <TrashIcon className="h-4 w-4 mr-2" />
        Delete
      </Button>
    </div>
  );
  
  const enhancedTimeSlots = timeSlots.map(timeSlot => ({
    ...timeSlot,
    actions: actions(timeSlot),
  }));
  
  const enhancedColumns = [
    ...columns,
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => row.actions,
    },
  ];
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Time Slots</h1>
        <div>
          <Button variant="destructive" onClick={handleClear}>
            <TrashIcon className="h-4 w-4 mr-2" />
            Clear All
          </Button>
          <Button onClick={() => setOpen(true)}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Time Slot
          </Button>
        </div>
      </div>
      <DataTable columns={enhancedColumns} data={enhancedTimeSlots} />
      <TimeSlotDialog open={open} setOpen={setOpen} />
    </div>
  );
};

export default TimeSlotsPage;
