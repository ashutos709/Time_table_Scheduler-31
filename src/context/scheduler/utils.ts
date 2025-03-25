
import { TimeSlot, DAYS, TIME_SLOTS } from './types';

export const createInitialTimeSlots = (): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  
  DAYS.forEach(day => {
    TIME_SLOTS.forEach(timeRange => {
      slots.push({
        id: `${day}-${timeRange.start}-${timeRange.end}`,
        startTime: timeRange.start,
        endTime: timeRange.end,
        day
      });
    });
  });
  
  return slots;
};

export const generateCourseCode = (name: string, index: number): string => {
  let deptCode = '';
  
  if (index < 10) deptCode = 'CS';
  else if (index < 20) deptCode = 'MATH';
  else if (index < 30) deptCode = 'PHYS';
  else if (index < 40) deptCode = 'CHEM';
  else if (index < 50) deptCode = 'BIO';
  else if (index < 60) deptCode = 'ENG';
  else deptCode = 'BUS';
  
  const courseNum = (index % 10) * 100 + Math.floor(Math.random() * 99);
  
  return `${deptCode}${courseNum}`;
};
