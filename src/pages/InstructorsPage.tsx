
import React, { useState } from 'react';
import { useScheduler } from '@/context/SchedulerContext';
import PageHeader from '@/components/ui/PageHeader';
import DataTable from '@/components/ui/DataTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, Plus, Edit, X } from 'lucide-react';
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
import { Instructor } from '@/types';

const InstructorsPage: React.FC = () => {
  const { 
    instructors, 
    addInstructor, 
    updateInstructor, 
    deleteInstructor,
  } = useScheduler();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingInstructor, setEditingInstructor] = useState<Instructor | null>(null);
  
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    designation: 'Professor',
    maxHours: 10,
  });
  
  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      designation: 'Professor',
      maxHours: 10,
    });
    setEditingInstructor(null);
  };
  
  const handleOpenEditDialog = (instructor: Instructor) => {
    setEditingInstructor(instructor);
    setFormData({
      id: instructor.id,
      name: instructor.name,
      designation: instructor.designation,
      maxHours: instructor.maxHours,
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
      [name]: name === 'maxHours' ? parseInt(value) || 0 : value,
    }));
  };
  
  const handleDesignationChange = (value: string) => {
    let maxHours = formData.maxHours;
    
    // Set default max hours based on designation
    if (value === 'Professor') maxHours = 10;
    if (value === 'Associate Professor') maxHours = 12;
    if (value === 'Assistant Professor') maxHours = 14;
    if (value === 'Lecturer') maxHours = 16;
    
    setFormData(prev => ({
      ...prev,
      designation: value,
      maxHours,
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingInstructor) {
      updateInstructor({
        ...formData,
        id: editingInstructor.id,
        currentHours: editingInstructor.currentHours || 0,
      });
    } else {
      addInstructor({
        name: formData.name,
        designation: formData.designation,
        maxHours: formData.maxHours,
      });
    }
    
    handleCloseDialog();
  };
  
  const columns = [
    {
      header: 'Name',
      accessorKey: 'name',
    },
    {
      header: 'Designation',
      accessorKey: 'designation',
    },
    {
      header: 'Max Hours',
      accessorKey: 'maxHours',
    },
    {
      header: 'Current Hours',
      accessorKey: (row: Instructor) => row.currentHours || 0,
    },
    {
      header: 'Actions',
      cell: (row: Instructor) => (
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
                <AlertDialogTitle>Delete Instructor</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete {row.name}. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={() => deleteInstructor(row.id)}
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
        title="Instructors"
        description="Manage faculty members and their teaching workloads."
      >
        <Dialog open={isAddDialogOpen || !!editingInstructor} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Instructor
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{editingInstructor ? 'Edit' : 'Add'} Instructor</DialogTitle>
              <DialogDescription>
                {editingInstructor
                  ? "Update instructor details and workload."
                  : "Add a new instructor to the system."}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="name">Instructor Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter instructor name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="designation">Designation</Label>
                <Select
                  value={formData.designation}
                  onValueChange={handleDesignationChange}
                >
                  <SelectTrigger id="designation">
                    <SelectValue placeholder="Select designation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Professor">Professor</SelectItem>
                    <SelectItem value="Associate Professor">Associate Professor</SelectItem>
                    <SelectItem value="Assistant Professor">Assistant Professor</SelectItem>
                    <SelectItem value="Lecturer">Lecturer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="maxHours">Maximum Weekly Hours</Label>
                <Input
                  id="maxHours"
                  name="maxHours"
                  type="number"
                  min={1}
                  max={24}
                  value={formData.maxHours}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <DialogFooter className="mt-6">
                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingInstructor ? 'Update' : 'Add'} Instructor
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
        data={instructors}
        columns={columns}
        emptyState={
          <div className="flex flex-col items-center justify-center space-y-3 py-6">
            <Users className="h-12 w-12 text-muted-foreground/50" />
            <p className="text-lg font-medium">No instructors found</p>
            <p className="text-sm text-muted-foreground">
              Add instructors to start creating schedules.
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Instructor
            </Button>
          </div>
        }
      />
    </div>
  );
};

export default InstructorsPage;
