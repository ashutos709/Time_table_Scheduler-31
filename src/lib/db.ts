
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// This file replaces the old mongodb.ts file with Supabase functionality
const connectDB = async () => {
  try {
    // Check if we can connect to Supabase by making a simple query
    const { error } = await supabase.from('time_slots').select('id').limit(1);
    
    if (error) {
      console.error('Supabase connection error:', error);
      toast.error('Failed to connect to database');
      throw error;
    }
    
    console.log(`Supabase connected successfully`);
    return supabase;
  } catch (error) {
    console.error('Database connection error:', error);
    toast.error('Failed to connect to database');
    throw error;
  }
};

export default connectDB;
