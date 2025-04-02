
import { Instructor, Course, Room, Department, Section, Schedule, TimeSlot } from '../types';

export interface StoredData {
  instructors: Instructor[];
  courses: Course[];
  rooms: Room[];
  departments: Department[];
  sections: Section[];
  schedules: Schedule[];
  timeSlots: TimeSlot[];
  examplesAdded: boolean;
}

// Define proper table mappings with explicitly typed transforms
export interface TableConfig<T> {
  table: 'instructors' | 'courses' | 'rooms' | 'departments' | 'sections' | 'schedules' | 'time_slots';
  transform?: (data: T) => any;
}

export const tableMapping: {
  instructors: TableConfig<Instructor>;
  courses: TableConfig<Course>;
  rooms: TableConfig<Room>;
  departments: TableConfig<Department>;
  sections: TableConfig<Section>;
  schedules: TableConfig<Schedule>;
  timeSlots: TableConfig<TimeSlot>;
} = {
  instructors: { table: 'instructors' },
  courses: { table: 'courses' },
  rooms: { table: 'rooms' },
  departments: { table: 'departments' },
  sections: { table: 'sections' },
  schedules: { table: 'schedules' },
  timeSlots: { 
    table: 'time_slots',
    transform: (slot: TimeSlot) => ({
      id: slot.id,
      day: slot.day,
      start_time: slot.startTime,
      end_time: slot.endTime
    })
  }
};
