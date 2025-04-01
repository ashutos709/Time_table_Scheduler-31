
import { Instructor } from '../types';
import { toast } from 'sonner';

export const createInstructorOperations = (
  instructors: Instructor[],
  setInstructors: React.Dispatch<React.SetStateAction<Instructor[]>>,
  courses: { instructorId: string }[]
) => {
  const getInstructorById = (id: string) => instructors.find(i => i.id === id);
  
  const addInstructor = (instructorData: Omit<Instructor, 'id'>) => {
    const newInstructor: Instructor = {
      ...instructorData,
      id: `instructor-${Date.now()}`,
      currentHours: 0
    };
    
    setInstructors(prev => [...prev, newInstructor]);
    toast.success(`Instructor ${instructorData.name} added successfully`);
  };
  
  const updateInstructor = (updatedInstructor: Instructor) => {
    setInstructors(prev => 
      prev.map(instructor => 
        instructor.id === updatedInstructor.id ? updatedInstructor : instructor
      )
    );
    toast.success(`Instructor ${updatedInstructor.name} updated successfully`);
  };
  
  const deleteInstructor = (id: string) => {
    const isUsed = courses.some(course => course.instructorId === id);
    if (isUsed) {
      toast.error("Can't delete instructor as they are assigned to courses");
      return;
    }
    
    setInstructors(prev => prev.filter(instructor => instructor.id !== id));
    toast.success("Instructor deleted successfully");
  };

  return {
    getInstructorById,
    addInstructor,
    updateInstructor,
    deleteInstructor
  };
};
