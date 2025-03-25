
// We'll reuse types from the main types file to maintain consistency
export type {
  Instructor,
  Course,
  Room,
  Department,
  Section,
  TimeSlot,
  Schedule,
  Day,
  TimeRange,
  ScheduleCell
} from '@/types';

// Re-export constants that are used in multiple files
export { DAYS, TIME_SLOTS } from '@/types';
