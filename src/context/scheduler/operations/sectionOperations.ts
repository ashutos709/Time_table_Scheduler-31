
import { Section } from '../types';
import { toast } from 'sonner';

export const createSectionOperations = (
  sections: Section[],
  setSections: React.Dispatch<React.SetStateAction<Section[]>>,
  setSchedules: React.Dispatch<React.SetStateAction<any[]>>
) => {
  const getSectionById = (id: string) => sections.find(s => s.id === id);
  
  const addSection = (sectionData: Omit<Section, 'id'>) => {
    const newSection: Section = {
      ...sectionData,
      id: `section-${Date.now()}`
    };
    
    setSections(prev => [...prev, newSection]);
    toast.success(`Section ${sectionData.name} added successfully`);
  };
  
  const updateSection = (updatedSection: Section) => {
    setSections(prev => 
      prev.map(section => 
        section.id === updatedSection.id ? updatedSection : section
      )
    );
    toast.success(`Section ${updatedSection.name} updated successfully`);
  };
  
  const deleteSection = (id: string) => {
    setSections(prev => prev.filter(section => section.id !== id));
    setSchedules(prev => prev.filter(schedule => schedule.sectionId !== id));
    toast.success("Section deleted successfully");
  };

  return {
    getSectionById,
    addSection,
    updateSection,
    deleteSection
  };
};
