
import React from 'react';
import { Check } from 'lucide-react';

const SchedulingConstraints: React.FC = () => {
  return (
    <div className="hidden md:block bg-secondary/30 glass-effect rounded-lg p-6 space-y-4">
      <h3 className="text-xl font-medium">Scheduling Constraints</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <div className="flex items-center">
            <Check className="mr-2 h-4 w-4 text-teal-500" />
            <h4 className="font-medium">Weekly Hours</h4>
          </div>
          <p className="text-sm text-muted-foreground">
            Total of 24 hours of lecture time per week.
          </p>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center">
            <Check className="mr-2 h-4 w-4 text-teal-500" />
            <h4 className="font-medium">Instructor Conflicts</h4>
          </div>
          <p className="text-sm text-muted-foreground">
            No instructor teaches two classes at the same time.
          </p>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center">
            <Check className="mr-2 h-4 w-4 text-teal-500" />
            <h4 className="font-medium">Workload by Designation</h4>
          </div>
          <p className="text-sm text-muted-foreground">
            Teaching hours distributed based on instructor designation.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SchedulingConstraints;
