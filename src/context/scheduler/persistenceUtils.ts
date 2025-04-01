
import { Instructor, Course, Room, Department, Section, Schedule } from './types';
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
    await connectMongoDB();
    
    await saveToMongoDB(InstructorModel, data.instructors);
    await saveToMongoDB(CourseModel, data.courses);
    await saveToMongoDB(RoomModel, data.rooms);
    await saveToMongoDB(DepartmentModel, data.departments);
    await saveToMongoDB(SectionModel, data.sections);
    await saveToMongoDB(ScheduleModel, data.schedules);
    
    Object.entries(data).forEach(([key, value]) => {
      saveToLocalStorage(key, value);
    });
    
    toast.success('Data saved to database');
  } catch (error) {
    console.error('Error saving all data to MongoDB:', error);
    toast.error('Failed to save data to database, falling back to localStorage');
    
    Object.entries(data).forEach(([key, value]) => {
      saveToLocalStorage(key, value);
    });
  }
};

export const loadAllData = async (): Promise<Partial<StoredData>> => {
  try {
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
      toast.success('Data loaded from database');
      return {
        instructors,
        courses,
        rooms,
        departments,
        sections,
        schedules,
        examplesAdded: true
      };
    }
    
    toast.info('No data found in database, loading from local storage');
    return {
      instructors: loadFromLocalStorage<Instructor[]>('instructors') || [],
      courses: loadFromLocalStorage<Course[]>('courses') || [],
      rooms: loadFromLocalStorage<Room[]>('rooms') || [],
      departments: loadFromLocalStorage<Department[]>('departments') || [],
      sections: loadFromLocalStorage<Section[]>('sections') || [],
      schedules: loadFromLocalStorage<Schedule[]>('schedules') || [],
      examplesAdded: loadFromLocalStorage<boolean>('examplesAdded') || false
    };
  } catch (error) {
    console.error('Error loading all data from MongoDB:', error);
    toast.error('Failed to load data from database, falling back to localStorage');
    
    return {
      instructors: loadFromLocalStorage<Instructor[]>('instructors') || [],
      courses: loadFromLocalStorage<Course[]>('courses') || [],
      rooms: loadFromLocalStorage<Room[]>('rooms') || [],
      departments: loadFromLocalStorage<Department[]>('departments') || [],
      sections: loadFromLocalStorage<Section[]>('sections') || [],
      schedules: loadFromLocalStorage<Schedule[]>('schedules') || [],
      examplesAdded: loadFromLocalStorage<boolean>('examplesAdded') || false
    };
  }
};
