
import { supabase } from '@/integrations/supabase/client';
import { tableMapping, TableConfig } from './types';
import { TimeSlot } from '../types';

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
