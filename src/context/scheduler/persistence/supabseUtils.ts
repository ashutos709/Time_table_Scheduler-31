
import { supabase } from '@/integrations/supabase/client';
import { tableMapping, TableConfig } from './types';
import { TimeSlot, Instructor, Course, Room, Department, Section, Schedule } from '../types';

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
      // Transform data according to the database schema
      let transformedData;
      
      if (mapping.transform) {
        // Use the transform function if provided
        transformedData = (data as any[]).map(item => 
          mapping.transform ? mapping.transform(item as any) : item
        );
      } else {
        // Handle specific table cases based on schema
        if (tableKey === 'instructors') {
          transformedData = data.map((item: any) => ({
            id: item.id,
            name: item.name,
            designation: item.designation,
            max_hours: item.maxHours,
            current_hours: item.currentHours || 0
          }));
        } else if (tableKey === 'courses') {
          transformedData = data.map((item: any) => ({
            id: item.id,
            code: item.code,
            name: item.name,
            max_students: item.maxStudents,
            instructor_id: item.instructorId
          }));
        } else if (tableKey === 'sections') {
          transformedData = data.map((item: any) => ({
            id: item.id,
            name: item.name,
            department_id: item.departmentId
          }));
        } else if (tableKey === 'schedules') {
          transformedData = data.map((item: any) => ({
            id: item.id,
            course_id: item.courseId,
            instructor_id: item.instructorId,
            room_id: item.roomId,
            time_slot_id: item.timeSlotId,
            section_id: item.sectionId
          }));
        } else if (tableKey === 'timeSlots') {
          transformedData = data.map((item: any) => ({
            id: item.id,
            day: item.day,
            start_time: item.startTime,
            end_time: item.endTime
          }));
        } else {
          // For other tables with matching schema
          transformedData = data;
        }
      }
      
      console.log(`Saving to ${table}:`, transformedData);
      
      const { error: insertError } = await supabase
        .from(table)
        .insert(transformedData as any);
      
      if (insertError) {
        console.error(`Insert error for table ${table}:`, insertError);
        throw insertError;
      }
    }
    
    return true;
  } catch (error) {
    console.error(`Error saving to Supabase (${tableKey}):`, error);
    return false;
  }
};

// Load data from Supabase with proper type mapping
export const loadFromSupabase = async <T>(tableKey: keyof typeof tableMapping): Promise<T[]> => {
  try {
    const { table, fromDb } = tableMapping[tableKey];
    
    const { data, error } = await supabase
      .from(table)
      .select('*');
    
    if (error) throw error;
    
    // Transform data if needed using the fromDb function
    if (data && fromDb) {
      return data.map(item => fromDb(item)) as unknown as T[];
    }
    
    // Handle specific table cases for return transformation
    if (tableKey === 'instructors' && data) {
      return data.map((item: any) => ({
        id: item.id,
        name: item.name,
        designation: item.designation,
        maxHours: item.max_hours,
        currentHours: item.current_hours || 0
      })) as unknown as T[];
    } else if (tableKey === 'courses' && data) {
      return data.map((item: any) => ({
        id: item.id,
        code: item.code,
        name: item.name,
        maxStudents: item.max_students,
        instructorId: item.instructor_id
      })) as unknown as T[];
    } else if (tableKey === 'sections' && data) {
      return data.map((item: any) => ({
        id: item.id,
        name: item.name,
        departmentId: item.department_id
      })) as unknown as T[];
    } else if (tableKey === 'schedules' && data) {
      return data.map((item: any) => ({
        id: item.id,
        courseId: item.course_id,
        instructorId: item.instructor_id,
        roomId: item.room_id,
        timeSlotId: item.time_slot_id,
        sectionId: item.section_id
      })) as unknown as T[];
    } else if (tableKey === 'timeSlots' && data) {
      return data.map((item: any) => ({
        id: item.id,
        day: item.day,
        startTime: item.start_time,
        endTime: item.end_time
      })) as unknown as T[];
    }
    
    return data as unknown as T[] || [];
  } catch (error) {
    console.error(`Error loading from Supabase (${tableKey}):`, error);
    return [];
  }
};
