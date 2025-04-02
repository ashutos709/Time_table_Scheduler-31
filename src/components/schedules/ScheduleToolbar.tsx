
import React, { useState, useEffect } from 'react';
import { RefreshCw, FileDown, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface ScheduleToolbarProps {
  selectedSection: string;
  onGenerateSchedule: () => void;
  onExportSchedule: () => void;
}

const ScheduleToolbar: React.FC<ScheduleToolbarProps> = ({
  selectedSection,
  onGenerateSchedule,
  onExportSchedule,
}) => {
  const [dbStatus, setDbStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');
  
  useEffect(() => {
    const checkDbConnection = async () => {
      try {
        setDbStatus('checking');
        // Check if we can connect to Supabase by making a simple query
        const { error } = await supabase.from('time_slots').select('id').limit(1);
        
        if (error) {
          console.error('Failed to connect to Supabase:', error);
          setDbStatus('disconnected');
          toast.error('Supabase connection failed');
        } else {
          setDbStatus('connected');
        }
      } catch (error) {
        console.error('Failed to connect to Supabase:', error);
        setDbStatus('disconnected');
        toast.error('Database connection failed');
      }
    };
    
    checkDbConnection();
  }, []);
  
  return (
    <div className="flex space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onGenerateSchedule}
        className="hidden sm:flex border-skyblue/30 text-skyblue hover:text-skyblue-600"
      >
        <RefreshCw className="mr-2 h-4 w-4" />
        Generate Schedule
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={onExportSchedule}
        disabled={!selectedSection}
        className="hidden sm:flex border-skyblue/30 text-skyblue hover:text-skyblue-600"
      >
        <FileDown className="mr-2 h-4 w-4" />
        Export CSV
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        className={`hidden sm:flex ${
          dbStatus === 'connected' 
            ? 'border-green-500/30 text-green-500' 
            : dbStatus === 'disconnected'
              ? 'border-red-500/30 text-red-500'
              : 'border-yellow-500/30 text-yellow-500'
        }`}
      >
        <Database className="mr-2 h-4 w-4" />
        {dbStatus === 'connected' 
          ? 'Supabase Connected' 
          : dbStatus === 'disconnected'
            ? 'Supabase Disconnected'
            : 'Checking Connection...'}
      </Button>
    </div>
  );
};

export default ScheduleToolbar;
