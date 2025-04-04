
import { Department } from '../types';
import { toast } from 'sonner';
import { saveToSupabase } from '../persistence/supabseUtils';

export const createDepartmentOperations = (
  departments: Department[],
  setDepartments: React.Dispatch<React.SetStateAction<Department[]>>,
  sections: { departmentId: string }[]
) => {
  const getDepartmentById = (id: string) => departments.find(d => d.id === id);
  
  const addDepartment = async (departmentData: Omit<Department, 'id'>) => {
    const newDepartment: Department = {
      ...departmentData,
      id: `department-${Date.now()}`,
      courses: Array.isArray(departmentData.courses) ? departmentData.courses : []
    };
    
    try {
      // First update local state
      setDepartments(prev => [...prev, newDepartment]);
      
      // Then save to Supabase
      const success = await saveToSupabase('departments', [newDepartment]);
      
      if (success) {
        toast.success(`Department ${departmentData.name} added successfully`);
      } else {
        toast.error('Error saving department to database');
      }
      
      return newDepartment;
    } catch (error) {
      console.error('Error saving department:', error);
      toast.error(`Failed to save department: ${(error as Error).message}`);
      return newDepartment;
    }
  };
  
  const updateDepartment = async (updatedDepartment: Department) => {
    try {
      // Ensure courses is an array
      const departmentToUpdate = {
        ...updatedDepartment,
        courses: Array.isArray(updatedDepartment.courses) ? updatedDepartment.courses : []
      };
      
      console.log('Updating department with courses:', departmentToUpdate.courses);
      
      // First update local state
      setDepartments(prev => 
        prev.map(department => 
          department.id === departmentToUpdate.id ? departmentToUpdate : department
        )
      );
      
      // Then save to Supabase
      const success = await saveToSupabase('departments', [departmentToUpdate]);
      
      if (success) {
        toast.success(`Department ${updatedDepartment.name} updated successfully`);
      } else {
        toast.error('Error updating department in database');
      }
    } catch (error) {
      console.error('Error updating department:', error);
      toast.error(`Failed to update department: ${(error as Error).message}`);
    }
  };
  
  const deleteDepartment = async (id: string) => {
    const isUsed = sections.some(section => section.departmentId === id);
    if (isUsed) {
      toast.error("Can't delete department as it has sections assigned");
      return;
    }
    
    try {
      // First update local state
      setDepartments(prev => prev.filter(department => department.id !== id));
      
      // Get all departments from local state, excluding the deleted one
      const remainingDepartments = departments.filter(department => department.id !== id);
      
      // Then save to Supabase
      const success = await saveToSupabase('departments', remainingDepartments);
      
      if (success) {
        toast.success("Department deleted successfully");
      } else {
        toast.error("Error deleting department from database");
      }
    } catch (error) {
      console.error('Error deleting department:', error);
      toast.error(`Failed to delete department: ${(error as Error).message}`);
    }
  };

  return {
    getDepartmentById,
    addDepartment,
    updateDepartment,
    deleteDepartment
  };
};
