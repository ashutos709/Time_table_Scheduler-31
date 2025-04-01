
import mongoose, { Schema } from 'mongoose';
import { 
  Instructor, 
  Course, 
  Room, 
  Department, 
  Section, 
  Schedule 
} from '@/types';

// Instructor schema
const instructorSchema = new Schema<Instructor>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  designation: { type: String, required: true },
  maxHours: { type: Number, required: true },
  currentHours: { type: Number, default: 0 }
});

// Course schema
const courseSchema = new Schema<Course>({
  id: { type: String, required: true, unique: true },
  code: { type: String, required: true },
  name: { type: String, required: true },
  maxStudents: { type: Number, required: true },
  instructorId: { type: String, required: true }
});

// Room schema
const roomSchema = new Schema<Room>({
  id: { type: String, required: true, unique: true },
  number: { type: String, required: true },
  capacity: { type: Number, required: true }
});

// Department schema
const departmentSchema = new Schema<Department>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  courses: [{ type: String }]
});

// Section schema
const sectionSchema = new Schema<Section>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  departmentId: { type: String, required: true }
});

// Schedule schema
const scheduleSchema = new Schema<Schedule>({
  id: { type: String, required: true, unique: true },
  courseId: { type: String, required: true },
  instructorId: { type: String, required: true },
  roomId: { type: String, required: true },
  timeSlotId: { type: String, required: true },
  sectionId: { type: String, required: true }
});

// Export models (check if models already exist to avoid overwriting)
export const InstructorModel = mongoose.models.Instructor || mongoose.model<Instructor>('Instructor', instructorSchema);
export const CourseModel = mongoose.models.Course || mongoose.model<Course>('Course', courseSchema);
export const RoomModel = mongoose.models.Room || mongoose.model<Room>('Room', roomSchema);
export const DepartmentModel = mongoose.models.Department || mongoose.model<Department>('Department', departmentSchema);
export const SectionModel = mongoose.models.Section || mongoose.model<Section>('Section', sectionSchema);
export const ScheduleModel = mongoose.models.Schedule || mongoose.model<Schedule>('Schedule', scheduleSchema);
