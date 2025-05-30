
import React, { useState, useEffect } from 'react';
import { useScheduler } from '@/context/SchedulerContext';
import PageHeader from '@/components/ui/PageHeader';
import DataTable, { Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, Plus, Edit, X, School } from 'lucide-react';
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Department, Course } from '@/types';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const DepartmentsPage: React.FC = () => {
  const { 
    departments, 
    courses,
    addDepartment, 
    updateDepartment, 
    deleteDepartment,
    getCourseById
  } = useScheduler();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [isCoursesOpen, setIsCoursesOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    courses: [] as string[],
  });
  
  // Reset the course selection when the form is reset
  useEffect(() => {
    if (editingDepartment) {
      setSelectedCourses(editingDepartment.courses || []);
      setFormData({
        id: editingDepartment.id,
        name: editingDepartment.name,
        courses: editingDepartment.courses || [],
      });
    } else {
      setSelectedCourses([]);
    }
  }, [editingDepartment]);
  
  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      courses: [],
    });
    setEditingDepartment(null);
    setSearchQuery('');
    setSelectedCourses([]);
  };
  
  const handleOpenEditDialog = (department: Department) => {
    console.log("Editing department with courses:", department.courses);
    setEditingDepartment(department);
    setSelectedCourses(department.courses || []);
    setFormData({
      id: department.id,
      name: department.name,
      courses: department.courses || [],
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
  
  const handleCourseToggle = (courseId: string) => {
    setSelectedCourses(prev => {
      if (prev.includes(courseId)) {
        return prev.filter(id => id !== courseId);
      } else {
        return [...prev, courseId];
      }
    });
    
    setFormData(prev => {
      const existingCourses = [...prev.courses];
      if (existingCourses.includes(courseId)) {
        return {
          ...prev,
          courses: existingCourses.filter(id => id !== courseId),
        };
      } else {
        return {
          ...prev,
          courses: [...existingCourses, courseId],
        };
      }
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Ensure courses array is properly set
    const departmentToSave = {
      ...formData,
      courses: selectedCourses
    };
    
    console.log("Submitting department with courses:", departmentToSave.courses);
    
    if (editingDepartment) {
      updateDepartment({
        ...departmentToSave,
        id: editingDepartment.id,
      });
    } else {
      addDepartment({
        name: departmentToSave.name,
        courses: departmentToSave.courses,
      });
    }
    
    handleCloseDialog();
  };
  
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };
  
  // Filter courses based on search query
  const filteredCourses = searchQuery
    ? courses.filter(
        course => 
          course.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
          course.code.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : courses;
  
  const columns: Column<Department>[] = [
    {
      header: 'Department Name',
      accessorKey: 'name'
    },
    {
      header: 'Courses',
      cell: (row: Department) => (
        <div className="flex flex-wrap gap-1">
          {!row.courses || row.courses.length === 0 ? (
            <span className="text-muted-foreground text-sm">No courses assigned</span>
          ) : (
            row.courses.map(courseId => {
              const course = getCourseById(courseId);
              return course ? (
                <Badge key={courseId} variant="outline" className="text-xs">
                  {course.code}: {course.name}
                </Badge>
              ) : null;
            })
          )}
        </div>
      ),
    },
    {
      header: 'Actions',
      cell: (row: Department) => (
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
                <AlertDialogTitle>Delete Department</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete the {row.name} department. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={() => deleteDepartment(row.id)}
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
        title="Departments"
        description="Manage academic departments and their associated courses."
      >
        <Dialog open={isAddDialogOpen || !!editingDepartment} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Department
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{editingDepartment ? 'Edit' : 'Add'} Department</DialogTitle>
              <DialogDescription>
                {editingDepartment
                  ? "Update department details and assigned courses."
                  : "Add a new department to the system."}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="name">Department Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Computer Science"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="courses">Courses</Label>
                <Popover open={isCoursesOpen} onOpenChange={setIsCoursesOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={isCoursesOpen}
                      className="w-full justify-between"
                      type="button"
                    >
                      {selectedCourses.length > 0
                        ? `${selectedCourses.length} course${selectedCourses.length > 1 ? 's' : ''} selected`
                        : "Select courses"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[300px] p-0">
                    <Command>
                      <CommandInput 
                        placeholder="Search courses..." 
                        onValueChange={handleSearchChange}
                        value={searchQuery}
                        className="h-9"
                      />
                      <CommandList>
                        <CommandEmpty>No courses found.</CommandEmpty>
                        <CommandGroup>
                          {filteredCourses.length > 0 ? (
                            filteredCourses.map((course) => (
                              <CommandItem
                                key={course.id}
                                value={course.id}
                                onSelect={() => {
                                  handleCourseToggle(course.id);
                                }}
                              >
                                <div className="flex items-center w-full">
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      selectedCourses.includes(course.id)
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  <span>{course.code}: {course.name}</span>
                                </div>
                              </CommandItem>
                            ))
                          ) : (
                            <div className="py-6 text-center text-sm">
                              No courses available to select
                            </div>
                          )}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                
                {selectedCourses.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {selectedCourses.map(courseId => {
                      const course = getCourseById(courseId);
                      return course ? (
                        <Badge 
                          key={courseId} 
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {course.code}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                            onClick={() => handleCourseToggle(courseId)}
                            type="button"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ) : null;
                    })}
                  </div>
                )}
              </div>
              
              <DialogFooter className="mt-6">
                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingDepartment ? 'Update' : 'Add'} Department
                </Button>
              </DialogFooter>
            </form>
            
            <button
              onClick={handleCloseDialog}
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              type="button"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          </DialogContent>
        </Dialog>
      </PageHeader>
      
      <DataTable
        data={departments}
        columns={columns}
        emptyState={
          <div className="flex flex-col items-center justify-center space-y-3 py-6">
            <School className="h-12 w-12 text-muted-foreground/50" />
            <p className="text-lg font-medium">No departments found</p>
            <p className="text-sm text-muted-foreground">
              Add departments to organize courses and sections.
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Department
            </Button>
          </div>
        }
      />
    </div>
  );
};

export default DepartmentsPage;
