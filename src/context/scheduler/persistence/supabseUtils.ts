
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
      // Apply transform if it exists, otherwise use data as is
      let transformedData;
      
      if (mapping.transform) {
        // Type assertion to help TypeScript understand this operation
        transformedData = (data as any[]).map(item => 
          mapping.transform ? mapping.transform(item as any) : item
        );
      } else {
        // Handle specific table cases
        if (tableKey === 'instructors') {
          // Format instructor data to match Supabase schema
          transformedData = data.map((item: any) => ({
            id: item.id,
            name: item.name,
            designation: item.designation,
            max_hours: item.maxHours,
            current_hours: item.currentHours || 0
          }));
        } else {
          transformedData = data;
        }
      }
      
      console.log(`Saving to ${table}:`, transformedData);
      
      // Use type assertion to bypass type checking
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
    }
    
    return data as unknown as T[] || [];
  } catch (error) {
    console.error(`Error loading from Supabase (${tableKey}):`, error);
    return [];
  }
};
