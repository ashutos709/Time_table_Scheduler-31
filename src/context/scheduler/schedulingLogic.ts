
import { 
  Schedule, 
  Section, 
  Instructor, 
  Course, 
  Room, 
  TimeSlot, 
  ScheduleCell,
  DAYS, 
  TIME_SLOTS,
  Department
} from './types';

export const generateScheduleForAllSections = (
  sections: Section[],
  departments: Department[],
  instructors: Instructor[],
  courses: Course[],
  rooms: Room[],
  timeSlots: TimeSlot[]
): Schedule[] => {
  if (sections.length === 0 || rooms.length === 0 || instructors.length === 0 || courses.length === 0) {
    return [];
  }
  
  const newSchedules: Schedule[] = [];
  
  sections.forEach(section => {
    const department = departments.find(d => d.id === section.departmentId);
    if (!department) return;
    
    const departmentCourses = courses.filter(c => 
      department.courses.includes(c.id)
    );
    
    if (departmentCourses.length === 0) {
      return;
    }
    
    const instructorAssignments: Record<string, Set<string>> = {};
    const roomAssignments: Record<string, Set<string>> = {};
    
    departmentCourses.forEach(course => {
      const instructor = instructors.find(i => i.id === course.instructorId);
      if (!instructor) return;
      
      const currentHours = instructor.currentHours || 0;
      if (currentHours >= instructor.maxHours) {
        return;
      }
      
      if (!instructorAssignments[instructor.id]) {
        instructorAssignments[instructor.id] = new Set();
      }
      
      for (const timeSlot of timeSlots) {
        if (instructorAssignments[instructor.id].has(timeSlot.id)) {
          continue;
        }
        
        for (const room of rooms) {
          if (!roomAssignments[room.id]) {
            roomAssignments[room.id] = new Set();
          }
          
          if (roomAssignments[room.id].has(timeSlot.id)) {
            continue;
          }
          
          if (room.capacity < course.maxStudents) {
            continue;
          }
          
          const newSchedule: Schedule = {
            id: `schedule-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            courseId: course.id,
            instructorId: instructor.id,
            roomId: room.id,
            timeSlotId: timeSlot.id,
            sectionId: section.id
          };
          
          newSchedules.push(newSchedule);
          
          instructorAssignments[instructor.id].add(timeSlot.id);
          roomAssignments[room.id].add(timeSlot.id);
          
          break;
        }
        
        if (newSchedules.some(s => s.courseId === course.id && s.sectionId === section.id)) {
          break;
        }
      }
    });
  });
  
  return newSchedules;
};

export const getScheduleGridForSection = (
  sectionId: string,
  schedules: Schedule[],
  timeSlots: TimeSlot[],
  getTimeSlotById: (id: string) => TimeSlot | undefined,
  getCourseById: (id: string) => Course | undefined,
  getInstructorById: (id: string) => Instructor | undefined,
  getRoomById: (id: string) => Room | undefined
): ScheduleCell[][] => {
  const sectionSchedules = schedules.filter(s => s.sectionId === sectionId);
  
  const scheduleGrid: ScheduleCell[][] = DAYS.map(() => 
    TIME_SLOTS.map(() => ({ isEmpty: true }))
  );
  
  sectionSchedules.forEach(schedule => {
    const timeSlot = getTimeSlotById(schedule.timeSlotId);
    if (!timeSlot) return;
    
    const dayIndex = DAYS.indexOf(timeSlot.day as any);
    if (dayIndex === -1) return;
    
    const timeIndex = TIME_SLOTS.findIndex(
      t => t.start === timeSlot.startTime && t.end === timeSlot.endTime
    );
    if (timeIndex === -1) return;
    
    const course = getCourseById(schedule.courseId);
    const instructor = getInstructorById(schedule.instructorId);
    const room = getRoomById(schedule.roomId);
    
    if (course && instructor && room) {
      scheduleGrid[dayIndex][timeIndex] = {
        course,
        instructor,
        room,
        isEmpty: false
      };
    }
  });
  
  return scheduleGrid;
};
