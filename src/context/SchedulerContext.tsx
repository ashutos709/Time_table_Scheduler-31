import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  Instructor,
  Course,
  Room,
  Department,
  Section,
  TimeSlot,
  Schedule,
  DAYS,
  TIME_SLOTS,
  ScheduleCell
} from '@/types';

interface SchedulerContextType {
  instructors: Instructor[];
  courses: Course[];
  rooms: Room[];
  departments: Department[];
  sections: Section[];
  timeSlots: TimeSlot[];
  schedules: Schedule[];
  
  addInstructor: (instructor: Omit<Instructor, 'id'>) => void;
  updateInstructor: (instructor: Instructor) => void;
  deleteInstructor: (id: string) => void;
  
  addCourse: (course: Omit<Course, 'id'>) => void;
  updateCourse: (course: Course) => void;
  deleteCourse: (id: string) => void;
  
  addRoom: (room: Omit<Room, 'id'>) => void;
  updateRoom: (room: Room) => void;
  deleteRoom: (id: string) => void;
  
  addDepartment: (department: Omit<Department, 'id'>) => void;
  updateDepartment: (department: Department) => void;
  deleteDepartment: (id: string) => void;
  
  addSection: (section: Omit<Section, 'id'>) => void;
  updateSection: (section: Section) => void;
  deleteSection: (id: string) => void;
  
  generateSchedule: () => void;
  getScheduleForSection: (sectionId: string) => ScheduleCell[][];
  clearSchedules: () => void;
  
  getInstructorById: (id: string) => Instructor | undefined;
  getCourseById: (id: string) => Course | undefined;
  getRoomById: (id: string) => Room | undefined;
  getDepartmentById: (id: string) => Department | undefined;
  getSectionById: (id: string) => Section | undefined;
  getTimeSlotById: (id: string) => TimeSlot | undefined;
}

const SchedulerContext = createContext<SchedulerContextType | undefined>(undefined);

const createInitialTimeSlots = (): TimeSlot[] => {
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

const generateExampleInstructors = (): Instructor[] => {
  const designations = ['Professor', 'Associate Professor', 'Assistant Professor', 'Lecturer'];
  const maxHoursByDesignation = {
    'Professor': 10,
    'Associate Professor': 12,
    'Assistant Professor': 14,
    'Lecturer': 16
  };
  
  const instructorNames = [
    'Dr. Emma Watson', 'Dr. Michael Brown', 'Dr. Sarah Johnson', 'Dr. David Clark',
    'Dr. Jennifer Lee', 'Dr. Robert Chen', 'Dr. Lisa Garcia', 'Dr. James Wilson',
    'Dr. Patricia Moore', 'Dr. Thomas Rodriguez', 'Dr. Elizabeth Lewis', 'Dr. Daniel Walker',
    'Dr. Margaret Hall', 'Dr. Richard Allen', 'Dr. Susan Young', 'Dr. Kevin Wright',
    'Dr. Karen Scott', 'Dr. Charles King', 'Dr. Nancy Hill', 'Dr. Joseph Green'
  ];
  
  return instructorNames.map((name, index) => {
    const designation = designations[index % designations.length];
    return {
      id: `instructor-example-${index + 1}`,
      name,
      designation,
      maxHours: maxHoursByDesignation[designation as keyof typeof maxHoursByDesignation],
      currentHours: 0
    };
  });
};

const generateExampleRooms = (): Room[] => {
  const buildings = ['A', 'B', 'C', 'D'];
  const rooms: Room[] = [];
  
  buildings.forEach(building => {
    for (let i = 1; i <= 5; i++) {
      rooms.push({
        id: `room-example-${building}${i}`,
        number: `${building}${i < 10 ? '0' : ''}${i}`,
        capacity: 30 + (Math.floor(Math.random() * 10) * 5)
      });
    }
  });
  
  return rooms;
};

const generateExampleDepartments = (): Department[] => {
  return [
    { id: 'department-example-1', name: 'Computer Science', courses: [] },
    { id: 'department-example-2', name: 'Mathematics', courses: [] },
    { id: 'department-example-3', name: 'Physics', courses: [] },
    { id: 'department-example-4', name: 'Chemistry', courses: [] },
    { id: 'department-example-5', name: 'Biology', courses: [] },
    { id: 'department-example-6', name: 'Engineering', courses: [] },
    { id: 'department-example-7', name: 'Business', courses: [] },
    { id: 'department-example-8', name: 'Medicine', courses: [] },
    { id: 'department-example-9', name: 'Law', courses: [] },
    { id: 'department-example-10', name: 'Arts and Humanities', courses: [] }
  ];
};

const generateExampleCourses = (instructors: Instructor[]): Course[] => {
  const csSubjects = [
    'Introduction to Programming', 'Data Structures', 'Algorithms', 'Database Systems',
    'Computer Networks', 'Operating Systems', 'Software Engineering', 'Web Development',
    'Mobile Development', 'Machine Learning'
  ];
  
  const mathSubjects = [
    'Calculus I', 'Calculus II', 'Linear Algebra', 'Differential Equations',
    'Discrete Mathematics', 'Statistics', 'Probability', 'Number Theory',
    'Abstract Algebra', 'Real Analysis'
  ];
  
  const physicsSubjects = [
    'Mechanics', 'Thermodynamics', 'Electromagnetism', 'Optics',
    'Quantum Physics', 'Modern Physics', 'Classical Physics', 'Astrophysics',
    'Fluid Mechanics', 'Relativity'
  ];
  
  const chemistrySubjects = [
    'General Chemistry', 'Organic Chemistry', 'Inorganic Chemistry', 'Physical Chemistry',
    'Biochemistry', 'Analytical Chemistry', 'Environmental Chemistry', 'Medicinal Chemistry',
    'Polymer Chemistry', 'Nuclear Chemistry'
  ];
  
  const biologySubjects = [
    'Cell Biology', 'Molecular Biology', 'Genetics', 'Microbiology',
    'Immunology', 'Ecology', 'Evolution', 'Anatomy and Physiology',
    'Zoology', 'Botany'
  ];
  
  const engineeringSubjects = [
    'Mechanics of Materials', 'Fluid Mechanics', 'Thermodynamics', 'Electric Circuits',
    'Digital Systems', 'Control Systems', 'Signal Processing', 'Communications',
    'VLSI Design', 'Robotics'
  ];
  
  const businessSubjects = [
    'Principles of Management', 'Marketing', 'Finance', 'Accounting',
    'Economics', 'Business Law', 'Entrepreneurship', 'International Business',
    'Human Resources', 'Operations Management'
  ];
  
  const allSubjects = [
    ...csSubjects, ...mathSubjects, ...physicsSubjects, ...chemistrySubjects,
    ...biologySubjects, ...engineeringSubjects, ...businessSubjects
  ];
  
  const generateCourseCode = (name: string, index: number): string => {
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
  
  return allSubjects.map((name, index) => {
    const instructorId = instructors[index % instructors.length].id;
    return {
      id: `course-example-${index + 1}`,
      name,
      code: generateCourseCode(name, index),
      instructorId,
      maxStudents: 30 + (Math.floor(Math.random() * 10) * 5)
    };
  });
};

const assignCoursesToDepartments = (
  departments: Department[], 
  courses: Course[]
): Department[] => {
  const updatedDepartments = [...departments];
  
  // Assign CS courses to CS department
  const csDept = updatedDepartments.find(d => d.name === 'Computer Science');
  if (csDept) {
    csDept.courses = courses.slice(0, 10).map(c => c.id);
  }
  
  // Assign Math courses to Math department
  const mathDept = updatedDepartments.find(d => d.name === 'Mathematics');
  if (mathDept) {
    mathDept.courses = courses.slice(10, 20).map(c => c.id);
  }
  
  // Assign Physics courses to Physics department
  const physicsDept = updatedDepartments.find(d => d.name === 'Physics');
  if (physicsDept) {
    physicsDept.courses = courses.slice(20, 30).map(c => c.id);
  }
  
  // Assign Chemistry courses to Chemistry department
  const chemistryDept = updatedDepartments.find(d => d.name === 'Chemistry');
  if (chemistryDept) {
    chemistryDept.courses = courses.slice(30, 40).map(c => c.id);
  }
  
  // Assign Biology courses to Biology department
  const biologyDept = updatedDepartments.find(d => d.name === 'Biology');
  if (biologyDept) {
    biologyDept.courses = courses.slice(40, 50).map(c => c.id);
  }
  
  // Assign Engineering courses to Engineering department
  const engineeringDept = updatedDepartments.find(d => d.name === 'Engineering');
  if (engineeringDept) {
    engineeringDept.courses = courses.slice(50, 60).map(c => c.id);
  }
  
  // Assign Business courses to Business department
  const businessDept = updatedDepartments.find(d => d.name === 'Business');
  if (businessDept) {
    businessDept.courses = courses.slice(60, 70).map(c => c.id);
  }
  
  return updatedDepartments;
};

const generateExampleSections = (departments: Department[]): Section[] => {
  const semesters = ['Fall 2023', 'Spring 2024', 'Summer 2024', 'Fall 2024'];
  const years = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
  
  const sections: Section[] = [];
  
  departments.slice(0, 7).forEach(department => {
    years.forEach(year => {
      semesters.slice(0, 2).forEach(semester => {
        sections.push({
          id: `section-example-${department.id}-${year}-${semester}`,
          name: `${department.name} ${year} ${semester}`,
          departmentId: department.id
        });
      });
    });
  });
  
  return sections;
};

export const SchedulerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [timeSlots] = useState<TimeSlot[]>(createInitialTimeSlots());
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [examplesAdded, setExamplesAdded] = useState(false);
  
  useEffect(() => {
    const loadData = () => {
      const storedInstructors = localStorage.getItem('instructors');
      const storedCourses = localStorage.getItem('courses');
      const storedRooms = localStorage.getItem('rooms');
      const storedDepartments = localStorage.getItem('departments');
      const storedSections = localStorage.getItem('sections');
      const storedSchedules = localStorage.getItem('schedules');
      const storedExamplesAdded = localStorage.getItem('examplesAdded');
      
      if (storedInstructors) setInstructors(JSON.parse(storedInstructors));
      if (storedCourses) setCourses(JSON.parse(storedCourses));
      if (storedRooms) setRooms(JSON.parse(storedRooms));
      if (storedDepartments) setDepartments(JSON.parse(storedDepartments));
      if (storedSections) setSections(JSON.parse(storedSections));
      if (storedSchedules) setSchedules(JSON.parse(storedSchedules));
      if (storedExamplesAdded) setExamplesAdded(JSON.parse(storedExamplesAdded));
    };
    
    loadData();
    
    const populateExampleData = async () => {
      if (instructors.length === 0 && courses.length === 0 && !examplesAdded) {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const exampleInstructors = generateExampleInstructors();
        const exampleRooms = generateExampleRooms();
        const exampleDepartments = generateExampleDepartments();
        const exampleCourses = generateExampleCourses(exampleInstructors);
        const updatedDepartments = assignCoursesToDepartments(exampleDepartments, exampleCourses);
        const exampleSections = generateExampleSections(updatedDepartments);
        
        setInstructors(exampleInstructors);
        setRooms(exampleRooms);
        setCourses(exampleCourses);
        setDepartments(updatedDepartments);
        setSections(exampleSections);
        setExamplesAdded(true);
        
        toast.success('Example data has been loaded');
      }
    };
    
    populateExampleData();
  }, [instructors.length, courses.length, examplesAdded]);
  
  useEffect(() => {
    localStorage.setItem('instructors', JSON.stringify(instructors));
  }, [instructors]);
  
  useEffect(() => {
    localStorage.setItem('courses', JSON.stringify(courses));
  }, [courses]);
  
  useEffect(() => {
    localStorage.setItem('rooms', JSON.stringify(rooms));
  }, [rooms]);
  
  useEffect(() => {
    localStorage.setItem('departments', JSON.stringify(departments));
  }, [departments]);
  
  useEffect(() => {
    localStorage.setItem('sections', JSON.stringify(sections));
  }, [sections]);
  
  useEffect(() => {
    localStorage.setItem('schedules', JSON.stringify(schedules));
  }, [schedules]);
  
  useEffect(() => {
    localStorage.setItem('examplesAdded', JSON.stringify(examplesAdded));
  }, [examplesAdded]);
  
  const getInstructorById = (id: string) => instructors.find(i => i.id === id);
  const getCourseById = (id: string) => courses.find(c => c.id === id);
  const getRoomById = (id: string) => rooms.find(r => r.id === id);
  const getDepartmentById = (id: string) => departments.find(d => d.id === id);
  const getSectionById = (id: string) => sections.find(s => s.id === id);
  const getTimeSlotById = (id: string) => timeSlots.find(t => t.id === id);
  
  const addInstructor = (instructorData: Omit<Instructor, 'id'>) => {
    const newInstructor: Instructor = {
      ...instructorData,
      id: `instructor-${Date.now()}`,
      currentHours: 0
    };
    
    setInstructors(prev => [...prev, newInstructor]);
    toast.success(`Instructor ${instructorData.name} added successfully`);
  };
  
  const updateInstructor = (updatedInstructor: Instructor) => {
    setInstructors(prev => 
      prev.map(instructor => 
        instructor.id === updatedInstructor.id ? updatedInstructor : instructor
      )
    );
    toast.success(`Instructor ${updatedInstructor.name} updated successfully`);
  };
  
  const deleteInstructor = (id: string) => {
    const isUsed = courses.some(course => course.instructorId === id);
    if (isUsed) {
      toast.error("Can't delete instructor as they are assigned to courses");
      return;
    }
    
    setInstructors(prev => prev.filter(instructor => instructor.id !== id));
    toast.success("Instructor deleted successfully");
  };
  
  const addCourse = (courseData: Omit<Course, 'id'>) => {
    const newCourse: Course = {
      ...courseData,
      id: `course-${Date.now()}`
    };
    
    setCourses(prev => [...prev, newCourse]);
    toast.success(`Course ${courseData.name} added successfully`);
  };
  
  const updateCourse = (updatedCourse: Course) => {
    setCourses(prev => 
      prev.map(course => 
        course.id === updatedCourse.id ? updatedCourse : course
      )
    );
    toast.success(`Course ${updatedCourse.name} updated successfully`);
  };
  
  const deleteCourse = (id: string) => {
    const isUsed = departments.some(dept => dept.courses.includes(id));
    if (isUsed) {
      toast.error("Can't delete course as it's assigned to departments");
      return;
    }
    
    setCourses(prev => prev.filter(course => course.id !== id));
    toast.success("Course deleted successfully");
  };
  
  const addRoom = (roomData: Omit<Room, 'id'>) => {
    const newRoom: Room = {
      ...roomData,
      id: `room-${Date.now()}`
    };
    
    setRooms(prev => [...prev, newRoom]);
    toast.success(`Room ${roomData.number} added successfully`);
  };
  
  const updateRoom = (updatedRoom: Room) => {
    setRooms(prev => 
      prev.map(room => 
        room.id === updatedRoom.id ? updatedRoom : room
      )
    );
    toast.success(`Room ${updatedRoom.number} updated successfully`);
  };
  
  const deleteRoom = (id: string) => {
    setRooms(prev => prev.filter(room => room.id !== id));
    toast.success("Room deleted successfully");
  };
  
  const addDepartment = (departmentData: Omit<Department, 'id'>) => {
    const newDepartment: Department = {
      ...departmentData,
      id: `department-${Date.now()}`
    };
    
    setDepartments(prev => [...prev, newDepartment]);
    toast.success(`Department ${departmentData.name} added successfully`);
  };
  
  const updateDepartment = (updatedDepartment: Department) => {
    setDepartments(prev => 
      prev.map(department => 
        department.id === updatedDepartment.id ? updatedDepartment : department
      )
    );
    toast.success(`Department ${updatedDepartment.name} updated successfully`);
  };
  
  const deleteDepartment = (id: string) => {
    const isUsed = sections.some(section => section.departmentId === id);
    if (isUsed) {
      toast.error("Can't delete department as it has sections assigned");
      return;
    }
    
    setDepartments(prev => prev.filter(department => department.id !== id));
    toast.success("Department deleted successfully");
  };
  
  const addSection = (sectionData: Omit<Section, 'id'>) => {
    const newSection: Section = {
      ...sectionData,
      id: `section-${Date.now()}`
    };
    
    setSections(prev => [...prev, newSection]);
    toast.success(`Section ${sectionData.name} added successfully`);
  };
  
  const updateSection = (updatedSection: Section) => {
    setSections(prev => 
      prev.map(section => 
        section.id === updatedSection.id ? updatedSection : section
      )
    );
    toast.success(`Section ${updatedSection.name} updated successfully`);
  };
  
  const deleteSection = (id: string) => {
    setSections(prev => prev.filter(section => section.id !== id));
    
    setSchedules(prev => prev.filter(schedule => schedule.sectionId !== id));
    
    toast.success("Section deleted successfully");
  };
  
  const generateSchedule = () => {
    if (sections.length === 0) {
      toast.error("Please add at least one section");
      return;
    }
    
    if (rooms.length === 0) {
      toast.error("Please add at least one room");
      return;
    }
    
    if (instructors.length === 0) {
      toast.error("Please add at least one instructor");
      return;
    }
    
    if (courses.length === 0) {
      toast.error("Please add at least one course");
      return;
    }
    
    setSchedules([]);
    
    const resetInstructors = instructors.map(instructor => ({
      ...instructor,
      currentHours: 0
    }));
    setInstructors(resetInstructors);
    
    const newSchedules: Schedule[] = [];
    
    sections.forEach(section => {
      const department = departments.find(d => d.id === section.departmentId);
      if (!department) return;
      
      const departmentCourses = courses.filter(c => 
        department.courses.includes(c.id)
      );
      
      if (departmentCourses.length === 0) {
        toast.error(`No courses found for department ${department.name}`);
        return;
      }
      
      const instructorAssignments: Record<string, Set<string>> = {};
      const roomAssignments: Record<string, Set<string>> = {};
      
      departmentCourses.forEach(course => {
        const instructor = instructors.find(i => i.id === course.instructorId);
        if (!instructor) return;
        
        const currentHours = instructor.currentHours || 0;
        if (currentHours >= instructor.maxHours) {
          toast.error(`Instructor ${instructor.name} has reached their maximum hours`);
          return;
        }
        
        if (!instructorAssignments[instructor.id]) {
          instructorAssignments[instructor.id] = new Set();
        }
        
        for (const timeSlot of timeSlots) {
          if (instructorAssignments[instructor.id].has(timeSlot.id)) {
            continue;
          }
          
          for (const room of rooms) {
            if (!roomAssignments[room.id]) {
              roomAssignments[room.id] = new Set();
            }
            
            if (roomAssignments[room.id].has(timeSlot.id)) {
              continue;
            }
            
            if (room.capacity < course.maxStudents) {
              continue;
            }
            
            const newSchedule: Schedule = {
              id: `schedule-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
              courseId: course.id,
              instructorId: instructor.id,
              roomId: room.id,
              timeSlotId: timeSlot.id,
              sectionId: section.id
            };
            
            newSchedules.push(newSchedule);
            
            instructorAssignments[instructor.id].add(timeSlot.id);
            roomAssignments[room.id].add(timeSlot.id);
            
            const updatedInstructor = {
              ...instructor,
              currentHours: (instructor.currentHours || 0) + 1
            };
            
            setInstructors(prev => 
              prev.map(i => i.id === instructor.id ? updatedInstructor : i)
            );
            
            break;
          }
          
          if (newSchedules.some(s => s.courseId === course.id && s.sectionId === section.id)) {
            break;
          }
        }
      });
    });
    
    if (newSchedules.length === 0) {
      toast.error("Unable to generate a valid schedule. Please check your constraints.");
      return;
    }
    
    setSchedules(newSchedules);
    toast.success("Schedule generated successfully");
  };
  
  const getScheduleForSection = (sectionId: string): ScheduleCell[][] => {
    const sectionSchedules = schedules.filter(s => s.sectionId === sectionId);
    
    const scheduleGrid: ScheduleCell[][] = DAYS.map(() => 
      TIME_SLOTS.map(() => ({ isEmpty: true }))
    );
    
    sectionSchedules.forEach(schedule => {
      const timeSlot = getTimeSlotById(schedule.timeSlotId);
      if (!timeSlot) return;
      
      const dayIndex = DAYS.indexOf(timeSlot.day as any);
      if (dayIndex === -1) return;
      
      const timeIndex = TIME_SLOTS.findIndex(
        t => t.start === timeSlot.startTime && t.end === timeSlot.endTime
      );
      if (timeIndex === -1) return;
      
      const course = getCourseById(schedule.courseId);
      const instructor = getInstructorById(schedule.instructorId);
      const room = getRoomById(schedule.roomId);
      
      if (course && instructor && room) {
        scheduleGrid[dayIndex][timeIndex] = {
          course,
          instructor,
          room,
          isEmpty: false
        };
      }
    });
    
    return scheduleGrid;
  };
  
  const clearSchedules = () => {
    setSchedules([]);
    
    const resetInstructors = instructors.map(instructor => ({
      ...instructor,
      currentHours: 0
    }));
    setInstructors(resetInstructors);
    
    toast.success("Schedules cleared");
  };
  
  const contextValue: SchedulerContextType = {
    instructors,
    courses,
    rooms,
    departments,
    sections,
    timeSlots,
    schedules,
    
    addInstructor,
    updateInstructor,
    deleteInstructor,
    
    addCourse,
    updateCourse,
    deleteCourse,
    
    addRoom,
    updateRoom,
    deleteRoom,
    
    addDepartment,
    updateDepartment,
    deleteDepartment,
    
    addSection,
    updateSection,
    deleteSection,
    
    generateSchedule,
    getScheduleForSection,
    clearSchedules,
    
    getInstructorById,
    getCourseById,
    getRoomById,
    getDepartmentById,
    getSectionById,
    getTimeSlotById
  };
  
  return (
    <SchedulerContext.Provider value={contextValue}>
      {children}
    </SchedulerContext.Provider>
  );
};

export const useScheduler = () => {
  const context = useContext(SchedulerContext);
  if (context === undefined) {
    throw new Error('useScheduler must be used within a SchedulerProvider');
  }
  return context;
};
