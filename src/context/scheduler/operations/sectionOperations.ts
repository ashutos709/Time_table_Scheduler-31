
import { Section } from '../types';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const createSectionOperations = (
  sections: Section[],
  setSections: React.Dispatch<React.SetStateAction<Section[]>>,
  setSchedules: React.Dispatch<React.SetStateAction<any[]>>
) => {
  const getSectionById = (id: string) => sections.find(s => s.id === id);
  
  const addSection = async (sectionData: Omit<Section, 'id'>) => {
    const newSection: Section = {
      ...sectionData,
      id: `section-${Date.now()}`
    };
    
    try {
      console.log('Attempting to save section to Supabase:', newSection);
      
      // Add to Supabase with correct column mapping
      const { error } = await supabase
        .from('sections')
        .insert({
          id: newSection.id,
          name: newSection.name,
          department_id: newSection.departmentId
        });
      
      if (error) {
        console.error('Supabase insert error details:', error);
        throw error;
      }
      
      setSections(prev => [...prev, newSection]);
      toast.success(`Section ${sectionData.name} added successfully`);
      return newSection;
    } catch (error) {
      console.error('Error saving section to Supabase:', error);
      // Still add it to local state
      setSections(prev => [...prev, newSection]);
      toast.warning(`Section ${sectionData.name} added to local state only. Error: ${(error as Error).message}`);
      return newSection;
    }
  };
  
  const updateSection = async (updatedSection: Section) => {
    try {
      console.log('Attempting to update section in Supabase:', updatedSection);
      
      // Update in Supabase with correct column mapping
      const { error } = await supabase
        .from('sections')
        .update({
          name: updatedSection.name,
          department_id: updatedSection.departmentId
        })
        .eq('id', updatedSection.id);
      
      if (error) {
        console.error('Supabase update error details:', error);
        throw error;
      }
      
      setSections(prev => 
        prev.map(section => 
          section.id === updatedSection.id ? updatedSection : section
        )
      );
      toast.success(`Section ${updatedSection.name} updated successfully`);
    } catch (error) {
      console.error('Error updating section in Supabase:', error);
      // Still update in local state
      setSections(prev => 
        prev.map(section => 
          section.id === updatedSection.id ? updatedSection : section
        )
      );
      toast.warning(`Section ${updatedSection.name} updated in local state only. Error: ${(error as Error).message}`);
    }
  };
  
  const deleteSection = async (id: string) => {
    try {
      console.log('Attempting to delete section from Supabase:', id);
      
      // Delete from Supabase
      const { error } = await supabase
        .from('sections')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Supabase delete error details:', error);
        throw error;
      }
      
      setSections(prev => prev.filter(section => section.id !== id));
      setSchedules(prev => prev.filter(schedule => schedule.sectionId !== id));
      toast.success("Section deleted successfully");
    } catch (error) {
      console.error('Error deleting section from Supabase:', error);
      // Still delete from local state
      setSections(prev => prev.filter(section => section.id !== id));
      setSchedules(prev => prev.filter(schedule => schedule.sectionId !== id));
      toast.warning(`Section deleted from local state only. Error: ${(error as Error).message}`);
    }
  };

  return {
    getSectionById,
    addSection,
    updateSection,
    deleteSection
  };
};
