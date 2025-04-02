
import { Course } from '../types';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

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
      // Add to Supabase
      const { data, error } = await supabase
        .from('courses')
        .insert([{
          id: newCourse.id,
          name: newCourse.name,
          code: newCourse.code,
          instructor_id: newCourse.instructorId,
          max_students: newCourse.maxStudents
        }]);
      
      if (error) throw error;
      
      setCourses(prev => [...prev, newCourse]);
      toast.success(`Course ${courseData.name} added successfully`);
    } catch (error) {
      console.error('Error saving course to Supabase:', error);
      // Still add it to local state
      setCourses(prev => [...prev, newCourse]);
      toast.success(`Course ${courseData.name} added to local state only`);
    }
  };
  
  const updateCourse = async (updatedCourse: Course) => {
    try {
      // Update in Supabase
      const { error } = await supabase
        .from('courses')
        .update({
          name: updatedCourse.name,
          code: updatedCourse.code,
          instructor_id: updatedCourse.instructorId,
          max_students: updatedCourse.maxStudents
        })
        .eq('id', updatedCourse.id);
      
      if (error) throw error;
      
      setCourses(prev => 
        prev.map(course => 
          course.id === updatedCourse.id ? updatedCourse : course
        )
      );
      toast.success(`Course ${updatedCourse.name} updated successfully`);
    } catch (error) {
      console.error('Error updating course in Supabase:', error);
      // Still update in local state
      setCourses(prev => 
        prev.map(course => 
          course.id === updatedCourse.id ? updatedCourse : course
        )
      );
      toast.success(`Course ${updatedCourse.name} updated in local state only`);
    }
  };
  
  const deleteCourse = async (id: string) => {
    const isUsed = departments.some(dept => dept.courses.includes(id));
    if (isUsed) {
      toast.error("Can't delete course as it's assigned to departments");
      return;
    }
    
    try {
      // Delete from Supabase
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setCourses(prev => prev.filter(course => course.id !== id));
      toast.success("Course deleted successfully");
    } catch (error) {
      console.error('Error deleting course from Supabase:', error);
      // Still delete from local state
      setCourses(prev => prev.filter(course => course.id !== id));
      toast.success("Course deleted from local state only");
    }
  };

  return {
    getCourseById,
    addCourse,
    updateCourse,
    deleteCourse
  };
};
