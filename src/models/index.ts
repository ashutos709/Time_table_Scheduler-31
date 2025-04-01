
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

// Helper function to safely define models
function getModel<T>(modelName: string, schema: Schema<T>) {
  // Check if mongoose.models exists before trying to access it
  if (mongoose.models && mongoose.models[modelName]) {
    return mongoose.models[modelName] as mongoose.Model<T>;
  }
  
  // If model doesn't exist, create it
  return mongoose.model<T>(modelName, schema);
}

// Export models using the helper function
export const InstructorModel = getModel<Instructor>('Instructor', instructorSchema);
export const CourseModel = getModel<Course>('Course', courseSchema);
export const RoomModel = getModel<Room>('Room', roomSchema);
export const DepartmentModel = getModel<Department>('Department', departmentSchema);
export const SectionModel = getModel<Section>('Section', sectionSchema);
export const ScheduleModel = getModel<Schedule>('Schedule', scheduleSchema);
