
import React, { useState } from 'react';
import { useScheduler } from '@/context/SchedulerContext';
import PageHeader from '@/components/ui/PageHeader';
import DataTable from '@/components/ui/DataTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, Plus, Edit, X, BookOpen } from 'lucide-react';
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
import { Course } from '@/types';

const CoursesPage: React.FC = () => {
  const { 
    courses, 
    instructors,
    addCourse, 
    updateCourse, 
    deleteCourse,
    getInstructorById
  } = useScheduler();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  
  const [formData, setFormData] = useState({
    id: '',
    code: '',
    name: '',
    maxStudents: 60,
    instructorId: '',
  });
  
  const resetForm = () => {
    setFormData({
      id: '',
      code: '',
      name: '',
      maxStudents: 60,
      instructorId: '',
    });
    setEditingCourse(null);
  };
  
  const handleOpenEditDialog = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      id: course.id,
      code: course.code,
      name: course.name,
      maxStudents: course.maxStudents,
      instructorId: course.instructorId,
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
      [name]: name === 'maxStudents' ? parseInt(value) || 0 : value,
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingCourse) {
      updateCourse({
        ...formData,
        id: editingCourse.id,
      });
    } else {
      addCourse({
        code: formData.code,
        name: formData.name,
        maxStudents: formData.maxStudents,
        instructorId: formData.instructorId,
      });
    }
    
    handleCloseDialog();
  };
  
  const columns = [
    {
      header: 'Code',
      accessorKey: 'code',
    },
    {
      header: 'Name',
      accessorKey: 'name',
    },
    {
      header: 'Max Students',
      accessorKey: 'maxStudents',
    },
    {
      header: 'Instructor',
      cell: (row: Course) => {
        const instructor = getInstructorById(row.instructorId);
        return instructor?.name || '-';
      },
    },
    {
      header: 'Actions',
      cell: (row: Course) => (
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
                <AlertDialogTitle>Delete Course</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete {row.name}. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={() => deleteCourse(row.id)}
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
        title="Courses"
        description="Manage courses and assign instructors."
      >
        <Dialog open={isAddDialogOpen || !!editingCourse} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Course
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{editingCourse ? 'Edit' : 'Add'} Course</DialogTitle>
              <DialogDescription>
                {editingCourse
                  ? "Update course details and instructor."
                  : "Add a new course to the system."}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="code">Course Code</Label>
                <Input
                  id="code"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  placeholder="e.g., CS101"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="name">Course Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter course name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="maxStudents">Maximum Students</Label>
                <Input
                  id="maxStudents"
                  name="maxStudents"
                  type="number"
                  min={1}
                  max={200}
                  value={formData.maxStudents}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="instructorId">Instructor</Label>
                <Select
                  value={formData.instructorId}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, instructorId: value }))}
                >
                  <SelectTrigger id="instructorId">
                    <SelectValue placeholder="Select instructor" />
                  </SelectTrigger>
                  <SelectContent>
                    {instructors.map(instructor => (
                      <SelectItem key={instructor.id} value={instructor.id}>
                        {instructor.name} ({instructor.designation})
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
                  {editingCourse ? 'Update' : 'Add'} Course
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
        data={courses}
        columns={columns}
        emptyState={
          <div className="flex flex-col items-center justify-center space-y-3 py-6">
            <BookOpen className="h-12 w-12 text-muted-foreground/50" />
            <p className="text-lg font-medium">No courses found</p>
            <p className="text-sm text-muted-foreground">
              Add courses to start creating schedules.
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Course
            </Button>
          </div>
        }
      />
    </div>
  );
};

export default CoursesPage;
