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
  ScheduleCell
} from './types';
import { createInitialTimeSlots } from './utils';
import {
  generateScheduleForAllSections,
  getScheduleGridForSection
} from './schedulingLogic';
import {
  loadAllData,
  saveToLocalStorage,
  saveAllData
} from './persistenceUtils';

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

const SchedulerContext = createContext<SchedulerContextType | undefined>(undefined);

export const SchedulerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [timeSlots] = useState<TimeSlot[]>(createInitialTimeSlots());
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const { 
          instructors: storedInstructors, 
          courses: storedCourses, 
          rooms: storedRooms,
          departments: storedDepartments,
          sections: storedSections,
          schedules: storedSchedules
        } = await loadAllData();
        
        if (storedInstructors?.length) setInstructors(storedInstructors);
        if (storedCourses?.length) setCourses(storedCourses);
        if (storedRooms?.length) setRooms(storedRooms);
        if (storedDepartments?.length) setDepartments(storedDepartments);
        if (storedSections?.length) setSections(storedSections);
        if (storedSchedules?.length) setSchedules(storedSchedules);
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  useEffect(() => {
    if (!isLoading) {
      saveAllData({
        instructors,
        courses,
        rooms,
        departments,
        sections,
        schedules,
        examplesAdded: true
      });
    }
  }, [instructors, courses, rooms, departments, sections, schedules, isLoading]);
  
  const getInstructorById = (id: string) => instructors.find(i => i.id === id);
  const getCourseById = (id: string) => courses.find(c => c.id === id);
  const getRoomById = (id: string) => rooms.find(r => r.id === id);
  const getDepartmentById = (id: string) => departments.find(d => d.id === id);
  const getSectionById = (id: string) => sections.find(s => s.id === id);
  const getTimeSlotById = (id: string) => timeSlots.find(t => t.id === id);
  
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
    const isUsed = courses.some(course => course.instructorId === id);
    if (isUsed) {
      toast.error("Can't delete instructor as they are assigned to courses");
      return;
    }
    
    setInstructors(prev => prev.filter(instructor => instructor.id !== id));
    toast.success("Instructor deleted successfully");
  };
  
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
    const isUsed = departments.some(dept => dept.courses.includes(id));
    if (isUsed) {
      toast.error("Can't delete course as it's assigned to departments");
      return;
    }
    
    setCourses(prev => prev.filter(course => course.id !== id));
    toast.success("Course deleted successfully");
  };
  
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
    const isUsed = sections.some(section => section.departmentId === id);
    if (isUsed) {
      toast.error("Can't delete department as it has sections assigned");
      return;
    }
    
    setDepartments(prev => prev.filter(department => department.id !== id));
    toast.success("Department deleted successfully");
  };
  
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
    setSchedules(prev => prev.filter(schedule => schedule.sectionId !== id));
    toast.success("Section deleted successfully");
  };
  
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
  
  const getScheduleForSection = (sectionId: string): ScheduleCell[][] => {
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
    addManualSchedule,
    
    getInstructorById,
    getCourseById,
    getRoomById,
    getDepartmentById,
    getSectionById,
    getTimeSlotById
  };
  
  return (
    <SchedulerContext.Provider value={contextValue}>
      {isLoading ? (
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-skyblue"></div>
          <span className="ml-3 text-lg text-skyblue">Loading data...</span>
        </div>
      ) : (
        children
      )}
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
