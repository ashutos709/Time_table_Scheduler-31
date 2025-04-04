
import { Course } from '../types';
import { toast } from 'sonner';
import { saveToSupabase, loadFromSupabase } from '../persistence/supabseUtils';

export const createCourseOperations = (
  courses: Course[],
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>,
  departments: { courses: string[] }[]
) => {
  const getCourseById = (id: string) => courses.find(c => c.id === id);
  
  const addCourse = async (courseData: Omit<Course, 'id'>) => {
    const newCourse: Course = {
      ...courseData,
      id: `course-${Date.now()}`
    };
    
    try {
      console.log('Adding course to local state:', newCourse);
      setCourses(prev => [...prev, newCourse]);
      
      console.log('Saving course to Supabase:', newCourse);
      const success = await saveToSupabase('courses', [newCourse]);
      
      if (success) {
        toast.success(`Course ${courseData.name} added successfully`);
      } else {
        toast.error(`Error saving course to database`);
      }
      
      return newCourse;
    } catch (error) {
      console.error('Error saving course:', error);
      toast.error(`Failed to save course: ${(error as Error).message}`);
      return newCourse;
    }
  };
  
  const updateCourse = async (updatedCourse: Course) => {
    try {
      console.log('Updating course in local state:', updatedCourse);
      setCourses(prev => 
        prev.map(course => 
          course.id === updatedCourse.id ? updatedCourse : course
        )
      );
      
      console.log('Saving updated course to Supabase:', updatedCourse);
      const success = await saveToSupabase('courses', [updatedCourse]);
      
      if (success) {
        toast.success(`Course ${updatedCourse.name} updated successfully`);
      } else {
        toast.error(`Error updating course in database`);
      }
    } catch (error) {
      console.error('Error updating course:', error);
      toast.error(`Failed to update course: ${(error as Error).message}`);
    }
  };
  
  const deleteCourse = async (id: string) => {
    const isUsed = departments.some(dept => dept.courses && dept.courses.includes(id));
    if (isUsed) {
      toast.error("Can't delete course as it's assigned to departments");
      return;
    }
    
    try {
      // First update local state
      setCourses(prev => prev.filter(course => course.id !== id));
      
      // Then try to update Supabase
      // We need to first get all courses, remove the one to delete, then save back
      const allCourses = await loadFromSupabase('courses');
      const remainingCourses = allCourses.filter(course => course.id !== id);
      
      console.log('Saving remaining courses after deletion:', remainingCourses);
      const success = await saveToSupabase('courses', remainingCourses);
      
      if (success) {
        toast.success("Course deleted successfully");
      } else {
        toast.error("Error deleting course from database");
      }
    } catch (error) {
      console.error('Error deleting course:', error);
      toast.error(`Failed to delete course: ${(error as Error).message}`);
    }
  };

  return {
    getCourseById,
    addCourse,
    updateCourse,
    deleteCourse
  };
};
