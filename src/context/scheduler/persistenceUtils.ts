
import { Instructor, Course, Room, Department, Section, Schedule, TimeSlot } from './types';
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
  timeSlots: TimeSlot[];
  examplesAdded: boolean;
}

// Define proper table mappings with explicitly typed transforms
interface TableConfig<T> {
  table: 'instructors' | 'courses' | 'rooms' | 'departments' | 'sections' | 'schedules' | 'time_slots';
  transform?: (data: T) => any;
}

const tableMapping: {
  instructors: TableConfig<Instructor>;
  courses: TableConfig<Course>;
  rooms: TableConfig<Room>;
  departments: TableConfig<Department>;
  sections: TableConfig<Section>;
  schedules: TableConfig<Schedule>;
  timeSlots: TableConfig<TimeSlot>;
} = {
  instructors: { table: 'instructors' },
  courses: { table: 'courses' },
  rooms: { table: 'rooms' },
  departments: { table: 'departments' },
  sections: { table: 'sections' },
  schedules: { table: 'schedules' },
  timeSlots: { 
    table: 'time_slots',
    transform: (slot: TimeSlot) => ({
      id: slot.id,
      day: slot.day,
      start_time: slot.startTime,
      end_time: slot.endTime
    })
  }
};

// Save data to Supabase with proper type mapping
export const saveToSupabase = async <T>(tableKey: keyof typeof tableMapping, data: T[]): Promise<boolean> => {
  try {
    const mapping = tableMapping[tableKey];
    const table = mapping.table;
    
    // First delete all existing records
    const { error: deleteError } = await supabase
      .from(table)
      .delete()
      .not('id', 'is', null);
    
    if (deleteError) throw deleteError;
    
    // Then insert new data if we have any
    if (data && data.length > 0) {
      // Apply transform if it exists, otherwise use data as is
      let transformedData;
      
      if (mapping.transform) {
        // Type assertion to help TypeScript understand this operation
        transformedData = (data as any[]).map(item => 
          mapping.transform ? mapping.transform(item as any) : item
        );
      } else {
        transformedData = data;
      }
      
      // Cast transformedData to any to bypass strict type checking
      const { error: insertError } = await supabase
        .from(table)
        .insert(transformedData as any);
      
      if (insertError) throw insertError;
    }
    
    return true;
  } catch (error) {
    console.error(`Error saving to Supabase (${tableKey}):`, error);
    return false;
  }
};

// Transform time_slots data back to our TimeSlot format
const transformTimeSlot = (dbSlot: any): TimeSlot => ({
  id: dbSlot.id,
  day: dbSlot.day,
  startTime: dbSlot.start_time,
  endTime: dbSlot.end_time
});

// Load data from Supabase with proper type mapping
export const loadFromSupabase = async <T>(tableKey: keyof typeof tableMapping): Promise<T[]> => {
  try {
    const { table } = tableMapping[tableKey];
    
    const { data, error } = await supabase
      .from(table)
      .select('*');
    
    if (error) throw error;
    
    // Transform time_slots data if needed
    if (tableKey === 'timeSlots' && data) {
      return data.map(transformTimeSlot) as unknown as T[];
    }
    
    return data as T[] || [];
  } catch (error) {
    console.error(`Error loading from Supabase (${tableKey}):`, error);
    return [];
  }
};

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
