
import { toast } from 'sonner';
import { StoredData } from './types';
import { saveToLocalStorage, loadFromLocalStorage } from './localStorage';
import { saveToSupabase, loadFromSupabase } from './supabseUtils';

export const saveAllData = async (data: StoredData): Promise<void> => {
  try {
    // Try to save to Supabase
    const supabaseSaves = await Promise.all([
      saveToSupabase('instructors', data.instructors),
      saveToSupabase('courses', data.courses),
      saveToSupabase('rooms', data.rooms),
      saveToSupabase('departments', data.departments),
      saveToSupabase('sections', data.sections),
      saveToSupabase('schedules', data.schedules),
      saveToSupabase('timeSlots', data.timeSlots)
    ]);
    
    const allSupabaseSuccess = supabaseSaves.every(success => success);
    
    if (allSupabaseSuccess) {
      toast.success('Data saved to Supabase');
    } else {
      toast.error('Error saving data to Supabase');
    }
    
    // Always save to localStorage as a backup
    Object.entries(data).forEach(([key, value]) => {
      saveToLocalStorage(key, value);
    });
  } catch (error) {
    console.error('Error saving data:', error);
    toast.error('Failed to save data to database, falling back to localStorage');
    
    Object.entries(data).forEach(([key, value]) => {
      saveToLocalStorage(key, value);
    });
  }
};

export const loadAllData = async (): Promise<Partial<StoredData>> => {
  try {
    // Try to load from Supabase
    const [
      instructorsData,
      coursesData,
      roomsData,
      departmentsData,
      sectionsData,
      schedulesData,
      timeSlotsData
    ] = await Promise.all([
      loadFromSupabase<Instructor>('instructors'),
      loadFromSupabase<Course>('courses'),
      loadFromSupabase<Room>('rooms'),
      loadFromSupabase<Department>('departments'),
      loadFromSupabase<Section>('sections'),
      loadFromSupabase<Schedule>('schedules'),
      loadFromSupabase<TimeSlot>('timeSlots')
    ]);
    
    const hasSupabaseData = 
      instructorsData.length > 0 || 
      coursesData.length > 0 || 
      roomsData.length > 0 || 
      departmentsData.length > 0 || 
      sectionsData.length > 0 || 
      schedulesData.length > 0 ||
      timeSlotsData.length > 0;
    
    if (hasSupabaseData) {
      toast.success('Data loaded from Supabase');
      return {
        instructors: instructorsData,
        courses: coursesData,
        rooms: roomsData,
        departments: departmentsData,
        sections: sectionsData,
        schedules: schedulesData,
        timeSlots: timeSlotsData,
        examplesAdded: true
      };
    }
    
    toast.info('No data found in Supabase, loading from local storage');
    return {
      instructors: loadFromLocalStorage<Instructor[]>('instructors') || [],
      courses: loadFromLocalStorage<Course[]>('courses') || [],
      rooms: loadFromLocalStorage<Room[]>('rooms') || [],
      departments: loadFromLocalStorage<Department[]>('departments') || [],
      sections: loadFromLocalStorage<Section[]>('sections') || [],
      schedules: loadFromLocalStorage<Schedule[]>('schedules') || [],
      timeSlots: loadFromLocalStorage<TimeSlot[]>('timeSlots') || [],
      examplesAdded: loadFromLocalStorage<boolean>('examplesAdded') || false
    };
  } catch (error) {
    console.error('Error loading data:', error);
    toast.error('Failed to load data from database, falling back to localStorage');
    
    return {
      instructors: loadFromLocalStorage<Instructor[]>('instructors') || [],
      courses: loadFromLocalStorage<Course[]>('courses') || [],
      rooms: loadFromLocalStorage<Room[]>('rooms') || [],
      departments: loadFromLocalStorage<Department[]>('departments') || [],
      sections: loadFromLocalStorage<Section[]>('sections') || [],
      schedules: loadFromLocalStorage<Schedule[]>('schedules') || [],
      timeSlots: loadFromLocalStorage<TimeSlot[]>('timeSlots') || [],
      examplesAdded: loadFromLocalStorage<boolean>('examplesAdded') || false
    };
  }
};

// Import missing types from the main scheduler types
import { Instructor, Course, Room, Department, Section, Schedule, TimeSlot } from '../types';

// Re-export everything
export * from './types';
export * from './localStorage';
export * from './supabseUtils';
