
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// This file is kept for backward compatibility and renamed functionality
// It now provides a connection check for Supabase instead of MongoDB

const connectMongoDB = async () => {
  try {
    // Check if we can connect to Supabase by making a simple query
    const { error } = await supabase.from('instructors').select('id').limit(1);
    
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

export default connectMongoDB;
