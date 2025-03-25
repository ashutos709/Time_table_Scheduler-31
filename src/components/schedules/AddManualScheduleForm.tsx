
import React, { useState } from 'react';
import { useScheduler } from '@/context/SchedulerContext';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { DAYS, TIME_SLOTS } from '@/types';
import { CalendarPlus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const AddManualScheduleForm: React.FC = () => {
  const { 
    sections, 
    instructors, 
    courses, 
    rooms, 
    timeSlots,
    addManualSchedule
  } = useScheduler();
  
  const [sectionId, setSectionId] = useState('');
  const [courseId, setCourseId] = useState('');
  const [instructorId, setInstructorId] = useState('');
  const [roomId, setRoomId] = useState('');
  const [timeSlotId, setTimeSlotId] = useState('');
  const [open, setOpen] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!sectionId || !courseId || !instructorId || !roomId || !timeSlotId) {
      return;
    }
    
    addManualSchedule({
      sectionId,
      courseId,
      instructorId,
      roomId,
      timeSlotId
    });
    
    // Reset form
    setOpen(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <CalendarPlus className="mr-2 h-4 w-4" />
          Add Manual Schedule
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Manual Schedule</DialogTitle>
          <DialogDescription>
            Manually assign a course to a specific time slot, room, and instructor.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Section</label>
            <Select
              value={sectionId}
              onValueChange={setSectionId}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a section" />
              </SelectTrigger>
              <SelectContent>
                {sections.map(section => (
                  <SelectItem key={section.id} value={section.id}>
                    {section.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Course</label>
            <Select
              value={courseId}
              onValueChange={setCourseId}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a course" />
              </SelectTrigger>
              <SelectContent>
                {courses.map(course => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.code}: {course.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Instructor</label>
            <Select
              value={instructorId}
              onValueChange={setInstructorId}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an instructor" />
              </SelectTrigger>
              <SelectContent>
                {instructors.map(instructor => (
                  <SelectItem key={instructor.id} value={instructor.id}>
                    {instructor.name} ({instructor.designation})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Room</label>
            <Select
              value={roomId}
              onValueChange={setRoomId}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a room" />
              </SelectTrigger>
              <SelectContent>
                {rooms.map(room => (
                  <SelectItem key={room.id} value={room.id}>
                    Room {room.number} (Capacity: {room.capacity})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Time Slot</label>
            <Select
              value={timeSlotId}
              onValueChange={setTimeSlotId}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a time slot" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map(slot => (
                  <SelectItem key={slot.id} value={slot.id}>
                    {slot.day} ({slot.startTime} - {slot.endTime})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <DialogFooter>
            <Button type="submit">Add Schedule</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddManualScheduleForm;
