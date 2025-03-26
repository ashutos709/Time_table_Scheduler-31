import React, { useState } from 'react';
import { useScheduler } from '@/context/SchedulerContext';
import PageHeader from '@/components/ui/PageHeader';
import DataTable, { Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, Plus, Edit, X, Layers } from 'lucide-react';
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
import { Section } from '@/types';

const SectionsPage: React.FC = () => {
  const { 
    sections, 
    departments,
    addSection, 
    updateSection, 
    deleteSection,
    getDepartmentById
  } = useScheduler();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [isDeleteAllDialogOpen, setIsDeleteAllDialogOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    departmentId: '',
  });
  
  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      departmentId: '',
    });
    setEditingSection(null);
  };
  
  const handleOpenEditDialog = (section: Section) => {
    setEditingSection(section);
    setFormData({
      id: section.id,
      name: section.name,
      departmentId: section.departmentId,
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
      [name]: value,
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingSection) {
      updateSection({
        ...formData,
        id: editingSection.id,
      });
    } else {
      addSection({
        name: formData.name,
        departmentId: formData.departmentId,
      });
    }
    
    handleCloseDialog();
  };
  
  const handleDeleteAllSections = () => {
    sections.forEach(section => {
      deleteSection(section.id);
    });
    setIsDeleteAllDialogOpen(false);
  };
  
  const columns: Column<Section>[] = [
    {
      header: 'Section Name',
      accessorKey: 'name' as keyof Section,
    },
    {
      header: 'Department',
      cell: (row: Section) => {
        const department = getDepartmentById(row.departmentId);
        return department?.name || '-';
      },
    },
    {
      header: 'Actions',
      cell: (row: Section) => (
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
                <AlertDialogTitle>Delete Section</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete the {row.name} section. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={() => deleteSection(row.id)}
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
        title="Sections"
        description="Manage class sections within departments."
      >
        <div className="flex space-x-2">
          <Dialog open={isAddDialogOpen || !!editingSection} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Section
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{editingSection ? 'Edit' : 'Add'} Section</DialogTitle>
                <DialogDescription>
                  {editingSection
                    ? "Update section details and department."
                    : "Add a new section to the system."}
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Section Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., CS-1A"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="departmentId">Department</Label>
                  <Select
                    value={formData.departmentId}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, departmentId: value }))}
                  >
                    <SelectTrigger id="departmentId">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map(department => (
                        <SelectItem key={department.id} value={department.id}>
                          {department.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <DialogFooter className="mt-6">
                  <Button type="button" variant="outline" onClick={handleCloseDialog}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingSection ? 'Update' : 'Add'} Section
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

          <AlertDialog open={isDeleteAllDialogOpen} onOpenChange={setIsDeleteAllDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={sections.length === 0}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete All Sections
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete All Sections</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete all {sections.length} sections. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={handleDeleteAllSections}
                >
                  Delete All
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </PageHeader>
      
      <DataTable
        data={sections}
        columns={columns}
        emptyState={
          <div className="flex flex-col items-center justify-center space-y-3 py-6">
            <Layers className="h-12 w-12 text-muted-foreground/50" />
            <p className="text-lg font-medium">No sections found</p>
            <p className="text-sm text-muted-foreground">
              Add sections to start creating schedules.
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Section
            </Button>
          </div>
        }
      />
    </div>
  );
};

export default SectionsPage;
