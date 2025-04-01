
import { Department } from '../types';
import { toast } from 'sonner';

export const createDepartmentOperations = (
  departments: Department[],
  setDepartments: React.Dispatch<React.SetStateAction<Department[]>>,
  sections: { departmentId: string }[]
) => {
  const getDepartmentById = (id: string) => departments.find(d => d.id === id);
  
  const addDepartment = (departmentData: Omit<Department, 'id'>) => {
    const newDepartment: Department = {
      ...departmentData,
      id: `department-${Date.now()}`
    };
    
    setDepartments(prev => [...prev, newDepartment]);
    toast.success(`Department ${departmentData.name} added successfully`);
  };
  
  const updateDepartment = (updatedDepartment: Department) => {
    setDepartments(prev => 
      prev.map(department => 
        department.id === updatedDepartment.id ? updatedDepartment : department
      )
    );
    toast.success(`Department ${updatedDepartment.name} updated successfully`);
  };
  
  const deleteDepartment = (id: string) => {
    const isUsed = sections.some(section => section.departmentId === id);
    if (isUsed) {
      toast.error("Can't delete department as it has sections assigned");
      return;
    }
    
    setDepartments(prev => prev.filter(department => department.id !== id));
    toast.success("Department deleted successfully");
  };

  return {
    getDepartmentById,
    addDepartment,
    updateDepartment,
    deleteDepartment
  };
};
