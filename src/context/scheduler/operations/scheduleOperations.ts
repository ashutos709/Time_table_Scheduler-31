
import { Schedule, Instructor, Course, Room, TimeSlot, Section } from '../types';
import { toast } from 'sonner';
import { generateScheduleForAllSections, getScheduleGridForSection } from '../schedulingLogic';

export const createScheduleOperations = (
  schedules: Schedule[],
  setSchedules: React.Dispatch<React.SetStateAction<Schedule[]>>,
  instructors: Instructor[],
  setInstructors: React.Dispatch<React.SetStateAction<Instructor[]>>,
  courses: Course[],
  rooms: Room[],
  departments: any[],
  sections: Section[],
  timeSlots: TimeSlot[],
  getInstructorById: (id: string) => Instructor | undefined,
  getCourseById: (id: string) => Course | undefined,
  getRoomById: (id: string) => Room | undefined,
  getSectionById: (id: string) => Section | undefined,
  getTimeSlotById: (id: string) => TimeSlot | undefined
) => {
  
  const addManualSchedule = (scheduleData: Omit<Schedule, 'id'>) => {
    const newSchedule: Schedule = {
      ...scheduleData,
      id: `schedule-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    };
    
    const course = getCourseById(scheduleData.courseId);
    const instructor = getInstructorById(scheduleData.instructorId);
    const room = getRoomById(scheduleData.roomId);
    const timeSlot = getTimeSlotById(scheduleData.timeSlotId);
    const section = getSectionById(scheduleData.sectionId);
    
    if (!course || !instructor || !room || !timeSlot || !section) {
      toast.error("Please select valid course, instructor, room, time slot, and section");
      return;
    }
    
    const existingSchedules = schedules.filter(s => 
      s.timeSlotId === scheduleData.timeSlotId
    );
    
    const hasInstructorConflict = existingSchedules.some(s => 
      s.instructorId === scheduleData.instructorId
    );
    
    if (hasInstructorConflict) {
      toast.error(`The instructor ${instructor.name} is already scheduled at this time`);
      return;
    }
    
    const hasRoomConflict = existingSchedules.some(s => 
      s.roomId === scheduleData.roomId
    );
    
    if (hasRoomConflict) {
      toast.error(`Room ${room.number} is already in use at this time`);
      return;
    }
    
    const updatedInstructor = {
      ...instructor,
      currentHours: (instructor.currentHours || 0) + 1
    };
    
    setInstructors(prev => 
      prev.map(i => i.id === instructor.id ? updatedInstructor : i)
    );
    
    setSchedules(prev => [...prev, newSchedule]);
    toast.success(`Schedule added for ${course.name} with ${instructor.name} in Room ${room.number}`);
  };
  
  const generateSchedule = () => {
    if (sections.length === 0) {
      toast.error("Please add at least one section");
      return;
    }
    
    if (rooms.length === 0) {
      toast.error("Please add at least one room");
      return;
    }
    
    if (instructors.length === 0) {
      toast.error("Please add at least one instructor");
      return;
    }
    
    if (courses.length === 0) {
      toast.error("Please add at least one course");
      return;
    }
    
    setSchedules([]);
    
    const resetInstructors = instructors.map(instructor => ({
      ...instructor,
      currentHours: 0
    }));
    setInstructors(resetInstructors);
    
    const newSchedules = generateScheduleForAllSections(
      sections,
      departments,
      resetInstructors,
      courses,
      rooms,
      timeSlots
    );
    
    if (newSchedules.length === 0) {
      toast.error("Unable to generate a valid schedule. Please check your constraints.");
      return;
    }
    
    const updatedInstructors = [...resetInstructors];
    newSchedules.forEach(schedule => {
      const instructorIndex = updatedInstructors.findIndex(i => i.id === schedule.instructorId);
      if (instructorIndex !== -1) {
        updatedInstructors[instructorIndex].currentHours = 
          (updatedInstructors[instructorIndex].currentHours || 0) + 1;
      }
    });
    
    setInstructors(updatedInstructors);
    setSchedules(newSchedules);
    toast.success("Schedule generated successfully");
  };
  
  const getScheduleForSection = (sectionId: string) => {
    return getScheduleGridForSection(
      sectionId,
      schedules,
      timeSlots,
      getTimeSlotById,
      getCourseById,
      getInstructorById,
      getRoomById
    );
  };
  
  const clearSchedules = () => {
    setSchedules([]);
    
    const resetInstructors = instructors.map(instructor => ({
      ...instructor,
      currentHours: 0
    }));
    setInstructors(resetInstructors);
    
    toast.success("Schedules cleared");
  };

  return {
    addManualSchedule,
    generateSchedule,
    getScheduleForSection,
    clearSchedules
  };
};
