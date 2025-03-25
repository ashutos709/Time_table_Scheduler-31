
import { Instructor, Course, Room, Department, Section } from './types';
import { generateCourseCode } from './utils';

export const generateExampleInstructors = (): Instructor[] => {
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

export const generateExampleRooms = (): Room[] => {
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

export const generateExampleDepartments = (): Department[] => {
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

export const generateExampleCourses = (instructors: Instructor[]): Course[] => {
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

export const assignCoursesToDepartments = (
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

export const generateExampleSections = (departments: Department[]): Section[] => {
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
