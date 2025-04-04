
import { Instructor, Course, Room, Department, Section, Schedule, TimeSlot } from '../types';

export interface StoredData {
  instructors: Instructor[];
  courses: Course[];
  rooms: Room[];
  departments: Department[];
  sections: Section[];
  schedules: Schedule[];
  timeSlots: TimeSlot[];
  examplesAdded?: boolean;
}

export interface TableConfig {
  table: string;
  transform?: (data: any) => any;
  fromDb?: (data: any) => any;
}

export const tableMapping: Record<string, TableConfig> = {
  instructors: {
    table: 'instructors',
    transform: (instructor: Instructor) => ({
      id: instructor.id,
      name: instructor.name,
      designation: instructor.designation,
      max_hours: instructor.maxHours,
      current_hours: instructor.currentHours || 0
    }),
    fromDb: (data: any) => ({
      id: data.id,
      name: data.name,
      designation: data.designation,
      maxHours: data.max_hours,
      currentHours: data.current_hours || 0
    })
  },
  courses: {
    table: 'courses',
    transform: (course: Course) => ({
      id: course.id,
      code: course.code,
      name: course.name,
      max_students: course.maxStudents,
      instructor_id: course.instructorId || null // Handle null case
    }),
    fromDb: (data: any) => ({
      id: data.id,
      code: data.code,
      name: data.name,
      maxStudents: data.max_students,
      instructorId: data.instructor_id
    })
  },
  rooms: {
    table: 'rooms',
    transform: (room: Room) => room,
    fromDb: (data: any) => data
  },
  departments: {
    table: 'departments',
    transform: (department: Department) => ({
      id: department.id,
      name: department.name,
      courses: department.courses || []
    }),
    fromDb: (data: any) => ({
      id: data.id,
      name: data.name,
      courses: data.courses || []
    })
  },
  sections: {
    table: 'sections',
    transform: (section: Section) => ({
      id: section.id,
      name: section.name,
      department_id: section.departmentId
    }),
    fromDb: (data: any) => ({
      id: data.id,
      name: data.name,
      departmentId: data.department_id
    })
  },
  schedules: {
    table: 'schedules',
    transform: (schedule: Schedule) => ({
      id: schedule.id,
      course_id: schedule.courseId,
      instructor_id: schedule.instructorId,
      room_id: schedule.roomId,
      time_slot_id: schedule.timeSlotId,
      section_id: schedule.sectionId
    }),
    fromDb: (data: any) => ({
      id: data.id,
      courseId: data.course_id,
      instructorId: data.instructor_id,
      roomId: data.room_id,
      timeSlotId: data.time_slot_id,
      sectionId: data.section_id
    })
  },
  timeSlots: {
    table: 'time_slots',
    transform: (timeSlot: TimeSlot) => ({
      id: timeSlot.id,
      day: timeSlot.day,
      start_time: timeSlot.startTime,
      end_time: timeSlot.endTime
    }),
    fromDb: (data: any) => ({
      id: data.id,
      day: data.day,
      startTime: data.start_time,
      endTime: data.end_time
    })
  }
};
