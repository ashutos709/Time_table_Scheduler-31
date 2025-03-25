
export interface Instructor {
  id: string;
  name: string;
  designation: string;
  maxHours: number;
  currentHours?: number;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  maxStudents: number;
  instructorId: string;
}

export interface Room {
  id: string;
  number: string;
  capacity: number;
}

export interface Department {
  id: string;
  name: string;
  courses: string[]; // course ids
}

export interface Section {
  id: string;
  name: string;
  departmentId: string;
}

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  day: string;
}

export interface Schedule {
  id: string;
  courseId: string;
  instructorId: string;
  roomId: string;
  timeSlotId: string;
  sectionId: string;
}

export type Day = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';

export type TimeRange = {
  start: string;
  end: string;
};

export const DAYS: Day[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export const TIME_SLOTS: TimeRange[] = [
  { start: '8:45', end: '9:45' },
  { start: '10:00', end: '11:00' },
  { start: '11:00', end: '12:00' },
  { start: '1:00', end: '2:00' },
  { start: '2:15', end: '3:15' },
];

export interface ScheduleCell {
  course?: Course;
  instructor?: Instructor;
  room?: Room;
  isEmpty: boolean;
}
