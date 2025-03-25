
import React, { useState } from 'react';
import { useScheduler } from '@/context/SchedulerContext';
import PageHeader from '@/components/ui/PageHeader';
import DataTable from '@/components/ui/DataTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, Plus, Edit, X, Building2 } from 'lucide-react';
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
import { Room } from '@/types';

const RoomsPage: React.FC = () => {
  const { 
    rooms, 
    addRoom, 
    updateRoom, 
    deleteRoom,
  } = useScheduler();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  
  const [formData, setFormData] = useState({
    id: '',
    number: '',
    capacity: 60,
  });
  
  const resetForm = () => {
    setFormData({
      id: '',
      number: '',
      capacity: 60,
    });
    setEditingRoom(null);
  };
  
  const handleOpenEditDialog = (room: Room) => {
    setEditingRoom(room);
    setFormData({
      id: room.id,
      number: room.number,
      capacity: room.capacity,
    });
  };
  
  const handleCloseDialog = () => {
    resetForm();
    setIsAddDialogOpen(false);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'capacity' ? parseInt(value) || 0 : value,
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingRoom) {
      updateRoom({
        ...formData,
        id: editingRoom.id,
      });
    } else {
      addRoom({
        number: formData.number,
        capacity: formData.capacity,
      });
    }
    
    handleCloseDialog();
  };
  
  const columns = [
    {
      header: 'Room Number',
      accessorKey: 'number',
    },
    {
      header: 'Capacity',
      accessorKey: 'capacity',
    },
    {
      header: 'Actions',
      cell: (row: Room) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              handleOpenEditDialog(row);
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive hover:text-destructive/90"
                onClick={(e) => e.stopPropagation()}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Room</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete Room {row.number}. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={() => deleteRoom(row.id)}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ),
    },
  ];
  
  return (
    <div className="space-y-6">
      <PageHeader
        title="Rooms"
        description="Manage classroom rooms and their capacities."
      >
        <Dialog open={isAddDialogOpen || !!editingRoom} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Room
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{editingRoom ? 'Edit' : 'Add'} Room</DialogTitle>
              <DialogDescription>
                {editingRoom
                  ? "Update room details and capacity."
                  : "Add a new room to the system."}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="number">Room Number</Label>
                <Input
                  id="number"
                  name="number"
                  value={formData.number}
                  onChange={handleInputChange}
                  placeholder="e.g., A101"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity</Label>
                <Input
                  id="capacity"
                  name="capacity"
                  type="number"
                  min={1}
                  max={300}
                  value={formData.capacity}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <DialogFooter className="mt-6">
                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingRoom ? 'Update' : 'Add'} Room
                </Button>
              </DialogFooter>
            </form>
            
            <button
              onClick={handleCloseDialog}
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          </DialogContent>
        </Dialog>
      </PageHeader>
      
      <DataTable
        data={rooms}
        columns={columns}
        emptyState={
          <div className="flex flex-col items-center justify-center space-y-3 py-6">
            <Building2 className="h-12 w-12 text-muted-foreground/50" />
            <p className="text-lg font-medium">No rooms found</p>
            <p className="text-sm text-muted-foreground">
              Add rooms to start creating schedules.
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Room
            </Button>
          </div>
        }
      />
    </div>
  );
};

export default RoomsPage;
