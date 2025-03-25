
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  Instructor,
  Course,
  Room,
  Department,
  Section,
  TimeSlot,
  Schedule,
  DAYS,
  TIME_SLOTS,
  ScheduleCell
} from '@/types';

interface SchedulerContextType {
  instructors: Instructor[];
  courses: Course[];
  rooms: Room[];
  departments: Department[];
  sections: Section[];
  timeSlots: TimeSlot[];
  schedules: Schedule[];
  
  // Methods for instructors
  addInstructor: (instructor: Omit<Instructor, 'id'>) => void;
  updateInstructor: (instructor: Instructor) => void;
  deleteInstructor: (id: string) => void;
  
  // Methods for courses
  addCourse: (course: Omit<Course, 'id'>) => void;
  updateCourse: (course: Course) => void;
  deleteCourse: (id: string) => void;
  
  // Methods for rooms
  addRoom: (room: Omit<Room, 'id'>) => void;
  updateRoom: (room: Room) => void;
  deleteRoom: (id: string) => void;
  
  // Methods for departments
  addDepartment: (department: Omit<Department, 'id'>) => void;
  updateDepartment: (department: Department) => void;
  deleteDepartment: (id: string) => void;
  
  // Methods for sections
  addSection: (section: Omit<Section, 'id'>) => void;
  updateSection: (section: Section) => void;
  deleteSection: (id: string) => void;
  
  // Methods for scheduling
  generateSchedule: () => void;
  getScheduleForSection: (sectionId: string) => ScheduleCell[][];
  clearSchedules: () => void;
  
  // Helper methods
  getInstructorById: (id: string) => Instructor | undefined;
  getCourseById: (id: string) => Course | undefined;
  getRoomById: (id: string) => Room | undefined;
  getDepartmentById: (id: string) => Department | undefined;
  getSectionById: (id: string) => Section | undefined;
  getTimeSlotById: (id: string) => TimeSlot | undefined;
}

const SchedulerContext = createContext<SchedulerContextType | undefined>(undefined);

// Create initial time slots based on the predefined arrays
const createInitialTimeSlots = (): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  
  DAYS.forEach(day => {
    TIME_SLOTS.forEach(timeRange => {
      slots.push({
        id: `${day}-${timeRange.start}-${timeRange.end}`,
        startTime: timeRange.start,
        endTime: timeRange.end,
        day
      });
    });
  });
  
  return slots;
};

export const SchedulerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State for all entities
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [timeSlots] = useState<TimeSlot[]>(createInitialTimeSlots());
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  
  // Load data from localStorage on mount
  useEffect(() => {
    const loadData = () => {
      const storedInstructors = localStorage.getItem('instructors');
      const storedCourses = localStorage.getItem('courses');
      const storedRooms = localStorage.getItem('rooms');
      const storedDepartments = localStorage.getItem('departments');
      const storedSections = localStorage.getItem('sections');
      const storedSchedules = localStorage.getItem('schedules');
      
      if (storedInstructors) setInstructors(JSON.parse(storedInstructors));
      if (storedCourses) setCourses(JSON.parse(storedCourses));
      if (storedRooms) setRooms(JSON.parse(storedRooms));
      if (storedDepartments) setDepartments(JSON.parse(storedDepartments));
      if (storedSections) setSections(JSON.parse(storedSections));
      if (storedSchedules) setSchedules(JSON.parse(storedSchedules));
    };
    
    loadData();
  }, []);
  
  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('instructors', JSON.stringify(instructors));
  }, [instructors]);
  
  useEffect(() => {
    localStorage.setItem('courses', JSON.stringify(courses));
  }, [courses]);
  
  useEffect(() => {
    localStorage.setItem('rooms', JSON.stringify(rooms));
  }, [rooms]);
  
  useEffect(() => {
    localStorage.setItem('departments', JSON.stringify(departments));
  }, [departments]);
  
  useEffect(() => {
    localStorage.setItem('sections', JSON.stringify(sections));
  }, [sections]);
  
  useEffect(() => {
    localStorage.setItem('schedules', JSON.stringify(schedules));
  }, [schedules]);
  
  // Helper methods to get entities by ID
  const getInstructorById = (id: string) => instructors.find(i => i.id === id);
  const getCourseById = (id: string) => courses.find(c => c.id === id);
  const getRoomById = (id: string) => rooms.find(r => r.id === id);
  const getDepartmentById = (id: string) => departments.find(d => d.id === id);
  const getSectionById = (id: string) => sections.find(s => s.id === id);
  const getTimeSlotById = (id: string) => timeSlots.find(t => t.id === id);
  
  // Methods for instructors
  const addInstructor = (instructorData: Omit<Instructor, 'id'>) => {
    const newInstructor: Instructor = {
      ...instructorData,
      id: `instructor-${Date.now()}`,
      currentHours: 0
    };
    
    setInstructors(prev => [...prev, newInstructor]);
    toast.success(`Instructor ${instructorData.name} added successfully`);
  };
  
  const updateInstructor = (updatedInstructor: Instructor) => {
    setInstructors(prev => 
      prev.map(instructor => 
        instructor.id === updatedInstructor.id ? updatedInstructor : instructor
      )
    );
    toast.success(`Instructor ${updatedInstructor.name} updated successfully`);
  };
  
  const deleteInstructor = (id: string) => {
    // Check if instructor is used in any course
    const isUsed = courses.some(course => course.instructorId === id);
    if (isUsed) {
      toast.error("Can't delete instructor as they are assigned to courses");
      return;
    }
    
    setInstructors(prev => prev.filter(instructor => instructor.id !== id));
    toast.success("Instructor deleted successfully");
  };
  
  // Methods for courses
  const addCourse = (courseData: Omit<Course, 'id'>) => {
    const newCourse: Course = {
      ...courseData,
      id: `course-${Date.now()}`
    };
    
    setCourses(prev => [...prev, newCourse]);
    toast.success(`Course ${courseData.name} added successfully`);
  };
  
  const updateCourse = (updatedCourse: Course) => {
    setCourses(prev => 
      prev.map(course => 
        course.id === updatedCourse.id ? updatedCourse : course
      )
    );
    toast.success(`Course ${updatedCourse.name} updated successfully`);
  };
  
  const deleteCourse = (id: string) => {
    // Check if course is used in any department
    const isUsed = departments.some(dept => dept.courses.includes(id));
    if (isUsed) {
      toast.error("Can't delete course as it's assigned to departments");
      return;
    }
    
    setCourses(prev => prev.filter(course => course.id !== id));
    toast.success("Course deleted successfully");
  };
  
  // Methods for rooms
  const addRoom = (roomData: Omit<Room, 'id'>) => {
    const newRoom: Room = {
      ...roomData,
      id: `room-${Date.now()}`
    };
    
    setRooms(prev => [...prev, newRoom]);
    toast.success(`Room ${roomData.number} added successfully`);
  };
  
  const updateRoom = (updatedRoom: Room) => {
    setRooms(prev => 
      prev.map(room => 
        room.id === updatedRoom.id ? updatedRoom : room
      )
    );
    toast.success(`Room ${updatedRoom.number} updated successfully`);
  };
  
  const deleteRoom = (id: string) => {
    setRooms(prev => prev.filter(room => room.id !== id));
    toast.success("Room deleted successfully");
  };
  
  // Methods for departments
  const addDepartment = (departmentData: Omit<Department, 'id'>) => {
    const newDepartment: Department = {
      ...departmentData,
      id: `department-${Date.now()}`
    };
    
    setDepartments(prev => [...prev, newDepartment]);
    toast.success(`Department ${departmentData.name} added successfully`);
  };
  
  const updateDepartment = (updatedDepartment: Department) => {
    setDepartments(prev => 
      prev.map(department => 
        department.id === updatedDepartment.id ? updatedDepartment : department
      )
    );
    toast.success(`Department ${updatedDepartment.name} updated successfully`);
  };
  
  const deleteDepartment = (id: string) => {
    // Check if department is used in any section
    const isUsed = sections.some(section => section.departmentId === id);
    if (isUsed) {
      toast.error("Can't delete department as it has sections assigned");
      return;
    }
    
    setDepartments(prev => prev.filter(department => department.id !== id));
    toast.success("Department deleted successfully");
  };
  
  // Methods for sections
  const addSection = (sectionData: Omit<Section, 'id'>) => {
    const newSection: Section = {
      ...sectionData,
      id: `section-${Date.now()}`
    };
    
    setSections(prev => [...prev, newSection]);
    toast.success(`Section ${sectionData.name} added successfully`);
  };
  
  const updateSection = (updatedSection: Section) => {
    setSections(prev => 
      prev.map(section => 
        section.id === updatedSection.id ? updatedSection : section
      )
    );
    toast.success(`Section ${updatedSection.name} updated successfully`);
  };
  
  const deleteSection = (id: string) => {
    setSections(prev => prev.filter(section => section.id !== id));
    
    // Also remove any schedules for this section
    setSchedules(prev => prev.filter(schedule => schedule.sectionId !== id));
    
    toast.success("Section deleted successfully");
  };
  
  // Generate a schedule based on constraints
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
    
    // Clear existing schedules
    setSchedules([]);
    
    // Reset instructor hours
    const resetInstructors = instructors.map(instructor => ({
      ...instructor,
      currentHours: 0
    }));
    setInstructors(resetInstructors);
    
    const newSchedules: Schedule[] = [];
    
    // For each section, create a schedule
    sections.forEach(section => {
      // Get the department for this section
      const department = departments.find(d => d.id === section.departmentId);
      if (!department) return;
      
      // Get all courses for this department
      const departmentCourses = courses.filter(c => 
        department.courses.includes(c.id)
      );
      
      if (departmentCourses.length === 0) {
        toast.error(`No courses found for department ${department.name}`);
        return;
      }
      
      // Track instructor assignments to prevent conflicts
      const instructorAssignments: Record<string, Set<string>> = {};
      
      // Track room assignments to prevent conflicts
      const roomAssignments: Record<string, Set<string>> = {};
      
      // For each course, find a suitable time slot and room
      departmentCourses.forEach(course => {
        // Get the instructor for this course
        const instructor = instructors.find(i => i.id === course.instructorId);
        if (!instructor) return;
        
        // Check if instructor has reached their max hours
        const currentHours = instructor.currentHours || 0;
        if (currentHours >= instructor.maxHours) {
          toast.error(`Instructor ${instructor.name} has reached their maximum hours`);
          return;
        }
        
        // Initialize assignment tracking if needed
        if (!instructorAssignments[instructor.id]) {
          instructorAssignments[instructor.id] = new Set();
        }
        
        // Try to find a suitable time slot
        for (const timeSlot of timeSlots) {
          // Skip if instructor is already assigned to this time slot
          if (instructorAssignments[instructor.id].has(timeSlot.id)) {
            continue;
          }
          
          // Try to find a suitable room for this time slot
          for (const room of rooms) {
            // Initialize room assignments if needed
            if (!roomAssignments[room.id]) {
              roomAssignments[room.id] = new Set();
            }
            
            // Check if room is already assigned for this time slot
            if (roomAssignments[room.id].has(timeSlot.id)) {
              continue;
            }
            
            // Check if room capacity is sufficient
            if (room.capacity < course.maxStudents) {
              continue;
            }
            
            // We found a suitable time slot and room!
            const newSchedule: Schedule = {
              id: `schedule-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
              courseId: course.id,
              instructorId: instructor.id,
              roomId: room.id,
              timeSlotId: timeSlot.id,
              sectionId: section.id
            };
            
            newSchedules.push(newSchedule);
            
            // Mark instructor as assigned for this time slot
            instructorAssignments[instructor.id].add(timeSlot.id);
            
            // Mark room as assigned for this time slot
            roomAssignments[room.id].add(timeSlot.id);
            
            // Update instructor hours
            const updatedInstructor = {
              ...instructor,
              currentHours: (instructor.currentHours || 0) + 1
            };
            
            setInstructors(prev => 
              prev.map(i => i.id === instructor.id ? updatedInstructor : i)
            );
            
            // Break the room loop as we've found a suitable time slot and room
            break;
          }
          
          // Check if we've already scheduled this course
          if (newSchedules.some(s => s.courseId === course.id && s.sectionId === section.id)) {
            break;
          }
        }
      });
    });
    
    if (newSchedules.length === 0) {
      toast.error("Unable to generate a valid schedule. Please check your constraints.");
      return;
    }
    
    setSchedules(newSchedules);
    toast.success("Schedule generated successfully");
  };
  
  // Get a 2D array representation of the schedule for a section
  const getScheduleForSection = (sectionId: string): ScheduleCell[][] => {
    // Filter schedules for the given section
    const sectionSchedules = schedules.filter(s => s.sectionId === sectionId);
    
    // Create a 2D array for the schedule (days x time slots)
    const scheduleGrid: ScheduleCell[][] = DAYS.map(() => 
      TIME_SLOTS.map(() => ({ isEmpty: true }))
    );
    
    // Fill in the schedule grid
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
  
  // Clear all schedules
  const clearSchedules = () => {
    setSchedules([]);
    
    // Reset instructor hours
    const resetInstructors = instructors.map(instructor => ({
      ...instructor,
      currentHours: 0
    }));
    setInstructors(resetInstructors);
    
    toast.success("Schedules cleared");
  };
  
  const contextValue: SchedulerContextType = {
    instructors,
    courses,
    rooms,
    departments,
    sections,
    timeSlots,
    schedules,
    
    addInstructor,
    updateInstructor,
    deleteInstructor,
    
    addCourse,
    updateCourse,
    deleteCourse,
    
    addRoom,
    updateRoom,
    deleteRoom,
    
    addDepartment,
    updateDepartment,
    deleteDepartment,
    
    addSection,
    updateSection,
    deleteSection,
    
    generateSchedule,
    getScheduleForSection,
    clearSchedules,
    
    getInstructorById,
    getCourseById,
    getRoomById,
    getDepartmentById,
    getSectionById,
    getTimeSlotById
  };
  
  return (
    <SchedulerContext.Provider value={contextValue}>
      {children}
    </SchedulerContext.Provider>
  );
};

export const useScheduler = () => {
  const context = useContext(SchedulerContext);
  if (context === undefined) {
    throw new Error('useScheduler must be used within a SchedulerProvider');
  }
  return context;
};
