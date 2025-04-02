
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
      // Add to Supabase
      const { error } = await supabase
        .from('departments')
        .insert([{
          id: newDepartment.id,
          name: newDepartment.name,
          courses: newDepartment.courses
        }]);
      
      if (error) throw error;
      
      setDepartments(prev => [...prev, newDepartment]);
      toast.success(`Department ${departmentData.name} added successfully`);
    } catch (error) {
      console.error('Error saving department to Supabase:', error);
      // Still add to local state
      setDepartments(prev => [...prev, newDepartment]);
      toast.warning(`Department ${departmentData.name} added to local state only`);
    }
  };
  
  const updateDepartment = async (updatedDepartment: Department) => {
    try {
      // Update in Supabase
      const { error } = await supabase
        .from('departments')
        .update({
          name: updatedDepartment.name,
          courses: updatedDepartment.courses
        })
        .eq('id', updatedDepartment.id);
      
      if (error) throw error;
      
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
      toast.warning(`Department ${updatedDepartment.name} updated in local state only`);
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
      
      if (error) throw error;
      
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
