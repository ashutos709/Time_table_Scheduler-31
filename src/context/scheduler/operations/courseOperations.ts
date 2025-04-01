
import { Course } from '../types';
import { toast } from 'sonner';

export const createCourseOperations = (
  courses: Course[],
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>,
  departments: { courses: string[] }[]
) => {
  const getCourseById = (id: string) => courses.find(c => c.id === id);
  
  const addCourse = (courseData: Omit<Course, 'id'>) => {
    const newCourse: Course = {
      ...courseData,
      id: `course-${Date.now()}`
    };
    
    setCourses(prev => [...prev, newCourse]);
    toast.success(`Course ${courseData.name} added successfully`);
  };
  
  const updateCourse = (updatedCourse: Course) => {
    setCourses(prev => 
      prev.map(course => 
        course.id === updatedCourse.id ? updatedCourse : course
      )
    );
    toast.success(`Course ${updatedCourse.name} updated successfully`);
  };
  
  const deleteCourse = (id: string) => {
    const isUsed = departments.some(dept => dept.courses.includes(id));
    if (isUsed) {
      toast.error("Can't delete course as it's assigned to departments");
      return;
    }
    
    setCourses(prev => prev.filter(course => course.id !== id));
    toast.success("Course deleted successfully");
  };

  return {
    getCourseById,
    addCourse,
    updateCourse,
    deleteCourse
  };
};
