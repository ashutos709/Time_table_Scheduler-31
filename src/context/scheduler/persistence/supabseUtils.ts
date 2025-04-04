
import { supabase } from '@/integrations/supabase/client';
import { tableMapping, TableConfig } from './types';
import { TimeSlot, Instructor, Course, Room, Department, Section, Schedule } from '../types';

// Type-safe Supabase tables
type SupabaseTable = 'instructors' | 'courses' | 'rooms' | 'departments' | 'sections' | 'schedules' | 'time_slots';

// Convert our key to Supabase table name
const getSupabaseTableName = (tableKey: keyof typeof tableMapping): SupabaseTable => {
  return tableMapping[tableKey].table as SupabaseTable;
};

// Save data to Supabase with proper type mapping
export const saveToSupabase = async <T>(tableKey: keyof typeof tableMapping, data: T[]): Promise<boolean> => {
  try {
    const mapping = tableMapping[tableKey];
    const table = getSupabaseTableName(tableKey);
    
    // First delete all existing records
    const { error: deleteError } = await supabase
      .from(table)
      .delete()
      .not('id', 'is', null);
    
    if (deleteError) throw deleteError;
    
    // Then insert new data if we have any
    if (data && data.length > 0) {
      // Transform data according to the database schema using the transform function
      const transformedData = (data as any[]).map(item => 
        mapping.transform ? mapping.transform(item) : item
      );
      
      console.log(`Saving to ${table}:`, transformedData);
      
      const { error: insertError } = await supabase
        .from(table)
        .insert(transformedData);
      
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
    const supabaseTable = getSupabaseTableName(tableKey);
    
    const { data, error } = await supabase
      .from(supabaseTable)
      .select('*');
    
    if (error) throw error;
    
    // Transform data using the fromDb function if provided
    if (data && fromDb) {
      return data.map(item => fromDb(item)) as unknown as T[];
    }
    
    return data as unknown as T[] || [];
  } catch (error) {
    console.error(`Error loading from Supabase (${tableKey}):`, error);
    return [];
  }
};
