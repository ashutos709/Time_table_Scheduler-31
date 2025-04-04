
import { TimeSlot, Instructor, Course, Room, Department, Section, Schedule } from '../types';

export interface StoredData {
  instructors: Instructor[];
  courses: Course[];
  rooms: Room[];
  departments: Department[];
  sections: Section[];
  timeSlots: TimeSlot[];
  schedules: Schedule[];
  examplesAdded?: boolean;
}

// Database mapping between our frontend types and Supabase tables
export const tableMapping = {
  instructors: {
    table: 'instructors',
    transform: (instructor: Instructor) => ({
      id: instructor.id,
      name: instructor.name,
      designation: instructor.designation,
      max_hours: instructor.maxHours,
      current_hours: instructor.currentHours || 0,
    }),
    fromDb: (dbInstructor: any): Instructor => ({
      id: dbInstructor.id,
      name: dbInstructor.name,
      designation: dbInstructor.designation,
      maxHours: dbInstructor.max_hours,
      currentHours: dbInstructor.current_hours || 0,
    }),
  },
  courses: {
    table: 'courses',
    transform: (course: Course) => ({
      id: course.id,
      code: course.code,
      name: course.name,
      max_students: course.maxStudents,
      instructor_id: course.instructorId || null,
    }),
    fromDb: (dbCourse: any): Course => ({
      id: dbCourse.id,
      code: dbCourse.code,
      name: dbCourse.name,
      maxStudents: dbCourse.max_students,
      instructorId: dbCourse.instructor_id || '',
    }),
  },
  rooms: {
    table: 'rooms',
    transform: (room: Room) => ({
      id: room.id,
      number: room.number,
      capacity: room.capacity,
    }),
    fromDb: (dbRoom: any): Room => ({
      id: dbRoom.id,
      number: dbRoom.number,
      capacity: dbRoom.capacity,
    }),
  },
  departments: {
    table: 'departments',
    transform: (department: Department) => ({
      id: department.id,
      name: department.name,
      courses: Array.isArray(department.courses) ? department.courses : [],
    }),
    fromDb: (dbDepartment: any): Department => ({
      id: dbDepartment.id,
      name: dbDepartment.name,
      courses: Array.isArray(dbDepartment.courses) ? dbDepartment.courses : [],
    }),
  },
  sections: {
    table: 'sections',
    transform: (section: Section) => ({
      id: section.id,
      name: section.name,
      department_id: section.departmentId,
    }),
    fromDb: (dbSection: any): Section => ({
      id: dbSection.id,
      name: dbSection.name,
      departmentId: dbSection.department_id,
    }),
  },
  schedules: {
    table: 'schedules',
    transform: (schedule: Schedule) => ({
      id: schedule.id,
      course_id: schedule.courseId,
      instructor_id: schedule.instructorId,
      room_id: schedule.roomId,
      section_id: schedule.sectionId,
      time_slot_id: schedule.timeSlotId,
    }),
    fromDb: (dbSchedule: any): Schedule => ({
      id: dbSchedule.id,
      courseId: dbSchedule.course_id,
      instructorId: dbSchedule.instructor_id,
      roomId: dbSchedule.room_id,
      sectionId: dbSchedule.section_id,
      timeSlotId: dbSchedule.time_slot_id,
    }),
  },
  timeSlots: {
    table: 'time_slots',
    transform: (timeSlot: TimeSlot) => ({
      id: timeSlot.id,
      day: timeSlot.day,
      start_time: timeSlot.startTime,
      end_time: timeSlot.endTime,
    }),
    fromDb: (dbTimeSlot: any): TimeSlot => ({
      id: dbTimeSlot.id,
      day: dbTimeSlot.day,
      startTime: dbTimeSlot.start_time,
      endTime: dbTimeSlot.end_time,
    }),
  },
} as const;

export type TableConfig = typeof tableMapping;
