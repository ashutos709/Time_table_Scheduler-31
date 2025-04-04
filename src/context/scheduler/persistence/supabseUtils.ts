
import { supabase } from '@/integrations/supabase/client';
import { tableMapping, TableConfig } from './types';
import { TimeSlot, Instructor, Course, Room, Department, Section, Schedule } from '../types';

// Define mapping for entity types to their Supabase table names
export type EntityType = keyof typeof tableMapping;
export type SupabaseTable = 'instructors' | 'courses' | 'rooms' | 'departments' | 'sections' | 'schedules' | 'time_slots';

// Convert our key to Supabase table name
export const getSupabaseTableName = (tableKey: EntityType): SupabaseTable => {
  return tableMapping[tableKey].table as SupabaseTable;
};

// Save data to Supabase with proper type mapping
export const saveToSupabase = async <T extends EntityType>(
  tableKey: T, 
  data: Array<Parameters<(typeof tableMapping)[T]['transform']>[0]>
): Promise<boolean> => {
  try {
    const mapping = tableMapping[tableKey];
    const tableName = getSupabaseTableName(tableKey);
    
    // First delete all existing records
    const { error: deleteError } = await supabase
      .from(tableName)
      .delete()
      .not('id', 'is', null);
    
    if (deleteError) {
      console.error(`Delete error for table ${tableName}:`, deleteError);
      throw deleteError;
    }
    
    // Then insert new data if we have any
    if (data && data.length > 0) {
      // Transform data according to the database schema using the transform function
      const transformedData = data.map(item => mapping.transform(item));
      
      console.log(`Saving to ${tableName}:`, transformedData);
      
      const { error: insertError } = await supabase
        .from(tableName)
        .insert(transformedData);
      
      if (insertError) {
        console.error(`Insert error for table ${tableName}:`, insertError);
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
export const loadFromSupabase = async <T extends EntityType>(
  tableKey: T
): Promise<Array<ReturnType<(typeof tableMapping)[T]['fromDb']>>> => {
  try {
    const { table, fromDb } = tableMapping[tableKey];
    const tableName = getSupabaseTableName(tableKey);
    
    const { data, error } = await supabase
      .from(tableName)
      .select('*');
    
    if (error) {
      console.error(`Load error for table ${tableName}:`, error);
      throw error;
    }
    
    // Transform data using the fromDb function
    if (data && fromDb) {
      return data.map(item => fromDb(item)) as Array<ReturnType<(typeof tableMapping)[T]['fromDb']>>;
    }
    
    return [] as Array<ReturnType<(typeof tableMapping)[T]['fromDb']>>;
  } catch (error) {
    console.error(`Error loading from Supabase (${tableKey}):`, error);
    return [] as Array<ReturnType<(typeof tableMapping)[T]['fromDb']>>;
  }
};
