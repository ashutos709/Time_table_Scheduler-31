
import { Instructor, Course, Room, Department, Section, Schedule } from './types';

export const saveToLocalStorage = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
    return false;
  }
};

export const loadFromLocalStorage = <T>(key: string): T | null => {
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

export const saveAllData = (data: StoredData): void => {
  Object.entries(data).forEach(([key, value]) => {
    saveToLocalStorage(key, value);
  });
};

export const loadAllData = (): Partial<StoredData> => {
  return {
    instructors: loadFromLocalStorage<Instructor[]>('instructors') || [],
    courses: loadFromLocalStorage<Course[]>('courses') || [],
    rooms: loadFromLocalStorage<Room[]>('rooms') || [],
    departments: loadFromLocalStorage<Department[]>('departments') || [],
    sections: loadFromLocalStorage<Section[]>('sections') || [],
    schedules: loadFromLocalStorage<Schedule[]>('schedules') || [],
    examplesAdded: loadFromLocalStorage<boolean>('examplesAdded') || false
  };
};
