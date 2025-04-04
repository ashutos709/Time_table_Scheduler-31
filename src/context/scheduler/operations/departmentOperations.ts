
import { Department } from '../types';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const createDepartmentOperations = (
  departments: Department[],
  setDepartments: React.Dispatch<React.SetStateAction<Department[]>>,
  sections: { departmentId: string }[]
) => {
  const getDepartmentById = (id: string) => departments.find(d => d.id === id);
  
  const addDepartment = async (departmentData: Omit<Department, 'id'>) => {
    const newDepartment: Department = {
      ...departmentData,
      id: `department-${Date.now()}`
    };
    
    try {
      // Add to Supabase with properly mapped fields
      const { error } = await supabase
        .from('departments')
        .insert({
          id: newDepartment.id,
          name: newDepartment.name,
          courses: Array.isArray(newDepartment.courses) ? newDepartment.courses : []
        });
      
      if (error) {
        console.error('Error adding department to Supabase:', error);
        throw error;
      }
      
      setDepartments(prev => [...prev, newDepartment]);
      toast.success(`Department ${departmentData.name} added successfully`);
      return newDepartment;
    } catch (error) {
      console.error('Error saving department to Supabase:', error);
      // Still add to local state
      setDepartments(prev => [...prev, newDepartment]);
      toast.warning(`Department ${departmentData.name} added to local state only. Error: ${(error as Error).message}`);
      return newDepartment;
    }
  };
  
  const updateDepartment = async (updatedDepartment: Department) => {
    try {
      // Ensure courses is an array
      const coursesArray = Array.isArray(updatedDepartment.courses) ? updatedDepartment.courses : [];
      
      console.log('Updating department with courses:', coursesArray);
      
      // Update in Supabase with properly mapped fields
      const { error } = await supabase
        .from('departments')
        .update({
          name: updatedDepartment.name,
          courses: coursesArray
        })
        .eq('id', updatedDepartment.id);
      
      if (error) {
        console.error('Error updating department in Supabase:', error);
        throw error;
      }
      
      setDepartments(prev => 
        prev.map(department => 
          department.id === updatedDepartment.id ? updatedDepartment : department
        )
      );
      toast.success(`Department ${updatedDepartment.name} updated successfully`);
    } catch (error) {
      console.error('Error updating department in Supabase:', error);
      // Still update local state
      setDepartments(prev => 
        prev.map(department => 
          department.id === updatedDepartment.id ? updatedDepartment : department
        )
      );
      toast.warning(`Department ${updatedDepartment.name} updated in local state only. Error: ${(error as Error).message}`);
    }
  };
  
  const deleteDepartment = async (id: string) => {
    const isUsed = sections.some(section => section.departmentId === id);
    if (isUsed) {
      toast.error("Can't delete department as it has sections assigned");
      return;
    }
    
    try {
      // Delete from Supabase
      const { error } = await supabase
        .from('departments')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting department from Supabase:', error);
        throw error;
      }
      
      setDepartments(prev => prev.filter(department => department.id !== id));
      toast.success("Department deleted successfully");
    } catch (error) {
      console.error('Error deleting department from Supabase:', error);
      // Still delete from local state
      setDepartments(prev => prev.filter(department => department.id !== id));
      toast.warning("Department deleted from local state only");
    }
  };

  return {
    getDepartmentById,
    addDepartment,
    updateDepartment,
    deleteDepartment
  };
};
