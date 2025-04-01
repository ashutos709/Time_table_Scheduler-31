
import {
  Instructor,
  Course,
  Room,
  Department,
  Section,
  TimeSlot,
  Schedule,
  ScheduleCell
} from '../types';

export interface SchedulerContextType {
  instructors: Instructor[];
  courses: Course[];
  rooms: Room[];
  departments: Department[];
  sections: Section[];
  timeSlots: TimeSlot[];
  schedules: Schedule[];
  
  addInstructor: (instructor: Omit<Instructor, 'id'>) => void;
  updateInstructor: (instructor: Instructor) => void;
  deleteInstructor: (id: string) => void;
  
  addCourse: (course: Omit<Course, 'id'>) => void;
  updateCourse: (course: Course) => void;
  deleteCourse: (id: string) => void;
  
  addRoom: (room: Omit<Room, 'id'>) => void;
  updateRoom: (room: Room) => void;
  deleteRoom: (id: string) => void;
  
  addDepartment: (department: Omit<Department, 'id'>) => void;
  updateDepartment: (department: Department) => void;
  deleteDepartment: (id: string) => void;
  
  addSection: (section: Omit<Section, 'id'>) => void;
  updateSection: (section: Section) => void;
  deleteSection: (id: string) => void;
  
  generateSchedule: () => void;
  getScheduleForSection: (sectionId: string) => ScheduleCell[][];
  clearSchedules: () => void;
  addManualSchedule: (scheduleData: Omit<Schedule, 'id'>) => void;
  
  getInstructorById: (id: string) => Instructor | undefined;
  getCourseById: (id: string) => Course | undefined;
  getRoomById: (id: string) => Room | undefined;
  getDepartmentById: (id: string) => Department | undefined;
  getSectionById: (id: string) => Section | undefined;
  getTimeSlotById: (id: string) => TimeSlot | undefined;
}
