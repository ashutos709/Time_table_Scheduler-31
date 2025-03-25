
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface ClearScheduleDialogProps {
  triggerRef: React.RefObject<HTMLButtonElement>;
  onConfirmClear: () => void;
}

const ClearScheduleDialog: React.FC<ClearScheduleDialogProps> = ({
  triggerRef,
  onConfirmClear,
}) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger ref={triggerRef} className="hidden" />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Clear All Schedules</AlertDialogTitle>
          <AlertDialogDescription>
            This will delete all generated schedules. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={onConfirmClear}
          >
            Delete All Schedules
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ClearScheduleDialog;
