
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
  fromDb?: (dbData: any) => T;
}

// Transform functions for converting between app models and database schema
const timeSlotToDb = (slot: TimeSlot) => ({
  id: slot.id,
  day: slot.day,
  start_time: slot.startTime,
  end_time: slot.endTime
});

const timeSlotFromDb = (dbSlot: any): TimeSlot => ({
  id: dbSlot.id,
  day: dbSlot.day,
  startTime: dbSlot.start_time,
  endTime: dbSlot.end_time
});

const scheduleToDb = (schedule: Schedule) => ({
  id: schedule.id,
  course_id: schedule.courseId,
  instructor_id: schedule.instructorId,
  room_id: schedule.roomId,
  time_slot_id: schedule.timeSlotId,
  section_id: schedule.sectionId
});

const scheduleFromDb = (dbSchedule: any): Schedule => ({
  id: dbSchedule.id,
  courseId: dbSchedule.course_id,
  instructorId: dbSchedule.instructor_id,
  roomId: dbSchedule.room_id,
  timeSlotId: dbSchedule.time_slot_id,
  sectionId: dbSchedule.section_id
});

const sectionToDb = (section: Section) => ({
  id: section.id,
  name: section.name,
  department_id: section.departmentId
});

const sectionFromDb = (dbSection: any): Section => ({
  id: dbSection.id,
  name: dbSection.name,
  departmentId: dbSection.department_id
});

export const tableMapping: {
  instructors: TableConfig<Instructor>;
  courses: TableConfig<Course>;
  rooms: TableConfig<Room>;
  departments: TableConfig<Department>;
  sections: TableConfig<Section>;
  schedules: TableConfig<Schedule>;
  timeSlots: TableConfig<TimeSlot>;
} = {
  instructors: { 
    table: 'instructors'
  },
  courses: { 
    table: 'courses'
  },
  rooms: { 
    table: 'rooms'
  },
  departments: { 
    table: 'departments'
  },
  sections: { 
    table: 'sections',
    transform: sectionToDb,
    fromDb: sectionFromDb
  },
  schedules: { 
    table: 'schedules',
    transform: scheduleToDb,
    fromDb: scheduleFromDb
  },
  timeSlots: { 
    table: 'time_slots',
    transform: timeSlotToDb,
    fromDb: timeSlotFromDb
  }
};
