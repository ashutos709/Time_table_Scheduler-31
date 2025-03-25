
import React from 'react';
import { Section } from '@/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SectionSelectorProps {
  sections: Section[];
  selectedSection: string;
  onSectionChange: (value: string) => void;
}

const SectionSelector: React.FC<SectionSelectorProps> = ({
  sections,
  selectedSection,
  onSectionChange,
}) => {
  return (
    <div className="flex-1 max-w-xs">
      <Select
        value={selectedSection}
        onValueChange={onSectionChange}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a section" />
        </SelectTrigger>
        <SelectContent>
          {sections.length === 0 ? (
            <div className="py-2 px-2 text-sm text-muted-foreground">
              No sections available
            </div>
          ) : (
            sections.map(section => (
              <SelectItem key={section.id} value={section.id}>
                {section.name}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SectionSelector;
