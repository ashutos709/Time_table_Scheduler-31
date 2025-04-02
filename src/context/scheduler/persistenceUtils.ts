
import { Instructor, Course, Room, Department, Section, Schedule, TimeSlot } from './types';
import connectMongoDB from '@/lib/mongodb';
import { 
  InstructorModel, 
  CourseModel, 
  RoomModel, 
  DepartmentModel, 
  SectionModel, 
  ScheduleModel 
} from '@/models';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const saveToLocalStorage = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
    return false;
  }
};

const loadFromLocalStorage = <T>(key: string): T | null => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
    return null;
  }
};

export interface StoredData {
  instructors: Instructor[];
  courses: Course[];
  rooms: Room[];
  departments: Department[];
  sections: Section[];
  schedules: Schedule[];
  timeSlots: TimeSlot[]; // Added this to fix type error
  examplesAdded: boolean;
}

export const saveToMongoDB = async <T>(model: any, data: T[]): Promise<boolean> => {
  try {
    await connectMongoDB();
    
    await model.deleteMany({});
    if (data.length > 0) {
      await model.insertMany(data);
    }
    
    return true;
  } catch (error) {
    console.error(`Error saving to MongoDB:`, error);
    toast.error(`Failed to save data to database`);
    return false;
  }
};

// Save data to Supabase
export const saveToSupabase = async <T>(table: string, data: T[]): Promise<boolean> => {
  try {
    // First delete all existing records
    const { error: deleteError } = await supabase
      .from(table)
      .delete()
      .not('id', 'is', null);
    
    if (deleteError) throw deleteError;
    
    // Then insert new data if we have any
    if (data && data.length > 0) {
      const { error: insertError } = await supabase
        .from(table)
        .insert(data);
      
      if (insertError) throw insertError;
    }
    
    return true;
  } catch (error) {
    console.error(`Error saving to Supabase (${table}):`, error);
    return false;
  }
};

// Load data from Supabase
export const loadFromSupabase = async <T>(table: string): Promise<T[]> => {
  try {
    const { data, error } = await supabase
      .from(table)
      .select('*');
    
    if (error) throw error;
    return data as T[] || [];
  } catch (error) {
    console.error(`Error loading from Supabase (${table}):`, error);
    return [];
  }
};

export const loadFromMongoDB = async <T>(model: any): Promise<T[]> => {
  try {
    await connectMongoDB();
    const data = await model.find({}).lean();
    return data as T[];
  } catch (error) {
    console.error(`Error loading from MongoDB:`, error);
    toast.error(`Failed to load data from database`);
    return [];
  }
};

export const saveAllData = async (data: StoredData): Promise<void> => {
  try {
    // Try to save to Supabase first
    const supabaseSaves = await Promise.all([
      saveToSupabase('instructors', data.instructors),
      saveToSupabase('courses', data.courses),
      saveToSupabase('rooms', data.rooms),
      saveToSupabase('departments', data.departments),
      saveToSupabase('sections', data.sections),
      saveToSupabase('schedules', data.schedules),
      saveToSupabase('time_slots', data.timeSlots)
    ]);
    
    const allSupabaseSuccess = supabaseSaves.every(success => success);
    
    if (allSupabaseSuccess) {
      toast.success('Data saved to Supabase');
    } else {
      // Fall back to MongoDB if Supabase fails
      await connectMongoDB();
      
      await saveToMongoDB(InstructorModel, data.instructors);
      await saveToMongoDB(CourseModel, data.courses);
      await saveToMongoDB(RoomModel, data.rooms);
      await saveToMongoDB(DepartmentModel, data.departments);
      await saveToMongoDB(SectionModel, data.sections);
      await saveToMongoDB(ScheduleModel, data.schedules);
      
      toast.success('Data saved to MongoDB');
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
    // Try to load from Supabase first
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
      loadFromSupabase<TimeSlot>('time_slots')
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
    
    // Fall back to MongoDB if no Supabase data
    toast.info('No data found in Supabase, trying MongoDB...');
    
    await connectMongoDB();
    
    const [instructors, courses, rooms, departments, sections, schedules] = await Promise.all([
      loadFromMongoDB<Instructor>(InstructorModel),
      loadFromMongoDB<Course>(CourseModel),
      loadFromMongoDB<Room>(RoomModel),
      loadFromMongoDB<Department>(DepartmentModel),
      loadFromMongoDB<Section>(SectionModel),
      loadFromMongoDB<Schedule>(ScheduleModel),
    ]);
    
    const hasMongoData = 
      instructors.length > 0 || 
      courses.length > 0 || 
      rooms.length > 0 || 
      departments.length > 0 || 
      sections.length > 0 || 
      schedules.length > 0;
    
    if (hasMongoData) {
      toast.success('Data loaded from MongoDB');
      return {
        instructors,
        courses,
        rooms,
        departments,
        sections,
        schedules,
        timeSlots: loadFromLocalStorage<TimeSlot[]>('timeSlots') || [],
        examplesAdded: true
      };
    }
    
    toast.info('No data found in MongoDB, loading from local storage');
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
    toast.error('Failed to load data from databases, falling back to localStorage');
    
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
