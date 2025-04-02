
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
} from './types';
import { SchedulerContextType } from './types/contextTypes';
import { createInitialTimeSlots } from './utils';
import { loadAllData, saveAllData } from './persistenceUtils';
import { createInstructorOperations } from './operations/instructorOperations';
import { createCourseOperations } from './operations/courseOperations';
import { createRoomOperations } from './operations/roomOperations';
import { createDepartmentOperations } from './operations/departmentOperations';
import { createSectionOperations } from './operations/sectionOperations';
import { createScheduleOperations } from './operations/scheduleOperations';
import { v4 as uuidv4 } from 'uuid';

const SchedulerContext = createContext<SchedulerContextType | undefined>(undefined);

export const SchedulerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Get operations
  const getTimeSlotById = (id: string) => timeSlots.find(t => t.id === id);
  
  // Time slot operations
  const addTimeSlot = (timeSlotData: Omit<TimeSlot, 'id'>) => {
    const newTimeSlot: TimeSlot = {
      ...timeSlotData,
      id: uuidv4()
    };
    setTimeSlots(prev => [...prev, newTimeSlot]);
    toast.success('Time slot added successfully');
  };
  
  const deleteTimeSlot = (id: string) => {
    // Check if time slot is used in any schedule
    const isUsed = schedules.some(schedule => schedule.timeSlotId === id);
    
    if (isUsed) {
      toast.error('Cannot delete time slot that is in use');
      return;
    }
    
    setTimeSlots(prev => prev.filter(ts => ts.id !== id));
    toast.success('Time slot deleted successfully');
  };
  
  const clearTimeSlots = () => {
    // Check if any time slots are used in schedules
    const usedTimeSlotIds = schedules.map(schedule => schedule.timeSlotId);
    if (usedTimeSlotIds.length > 0) {
      toast.error('Cannot clear time slots that are in use');
      return;
    }
    
    setTimeSlots([]);
    toast.success('All time slots have been cleared');
  };
  
  const instructorOps = createInstructorOperations(instructors, setInstructors, courses);
  const courseOps = createCourseOperations(courses, setCourses, departments);
  const roomOps = createRoomOperations(rooms, setRooms);
  const departmentOps = createDepartmentOperations(departments, setDepartments, sections);
  const sectionOps = createSectionOperations(sections, setSections, setSchedules);
  const scheduleOps = createScheduleOperations(
    schedules, 
    setSchedules,
    instructors,
    setInstructors,
    courses,
    rooms,
    departments,
    sections,
    timeSlots,
    instructorOps.getInstructorById,
    courseOps.getCourseById,
    roomOps.getRoomById,
    sectionOps.getSectionById,
    getTimeSlotById
  );
  
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
          schedules: storedSchedules,
          timeSlots: storedTimeSlots
        } = await loadAllData();
        
        if (storedInstructors?.length) setInstructors(storedInstructors);
        if (storedCourses?.length) setCourses(storedCourses);
        if (storedRooms?.length) setRooms(storedRooms);
        if (storedDepartments?.length) setDepartments(storedDepartments);
        if (storedSections?.length) setSections(storedSections);
        if (storedSchedules?.length) setSchedules(storedSchedules);
        if (storedTimeSlots?.length) {
          setTimeSlots(storedTimeSlots);
        } else {
          // We're no longer initializing default time slots here
          setTimeSlots([]);
        }
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
        timeSlots,
        examplesAdded: true
      });
    }
  }, [instructors, courses, rooms, departments, sections, schedules, timeSlots, isLoading]);
  
  const contextValue: SchedulerContextType = {
    instructors,
    courses,
    rooms,
    departments,
    sections,
    timeSlots,
    schedules,
    
    ...instructorOps,
    ...courseOps,
    ...roomOps,
    ...departmentOps,
    ...sectionOps,
    ...scheduleOps,
    
    addTimeSlot,
    deleteTimeSlot,
    clearTimeSlots,
    
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
