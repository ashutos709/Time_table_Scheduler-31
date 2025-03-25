
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useScheduler } from '@/context/SchedulerContext';
import { CalendarDays, Users, BookOpen, Building, School, Clock, ArrowRight } from 'lucide-react';

const Index = () => {
  const { 
    instructors, 
    courses, 
    rooms, 
    departments, 
    sections,
    schedules,
    generateSchedule 
  } = useScheduler();

  const features = [
    {
      title: 'Instructor Management',
      description: 'Add and manage instructors with workload based on designation.',
      icon: <Users className="h-10 w-10 text-teal-500" />,
      count: instructors.length,
      link: '/instructors'
    },
    {
      title: 'Course Management',
      description: 'Create and organize courses for different departments.',
      icon: <BookOpen className="h-10 w-10 text-teal-500" />,
      count: courses.length,
      link: '/courses'
    },
    {
      title: 'Room Allocation',
      description: 'Manage classroom availability and room capacity.',
      icon: <Building className="h-10 w-10 text-teal-500" />,
      count: rooms.length,
      link: '/rooms'
    },
    {
      title: 'Department Setup',
      description: 'Organize courses by academic departments.',
      icon: <School className="h-10 w-10 text-teal-500" />,
      count: departments.length,
      link: '/departments'
    },
    {
      title: 'Schedule Generation',
      description: 'Create conflict-free schedules with smart algorithms.',
      icon: <CalendarDays className="h-10 w-10 text-teal-500" />,
      count: schedules.length,
      link: '/schedules'
    },
    {
      title: 'Time Slot Management',
      description: 'Define available time periods for scheduling.',
      icon: <Clock className="h-10 w-10 text-teal-500" />,
      count: sections.length,
      link: '/time-slots'
    }
  ];

  return (
    <div className="space-y-12 py-4">
      <section className="flex flex-col md:flex-row items-center justify-between space-y-8 md:space-y-0 md:space-x-12">
        <div className="space-y-6 max-w-2xl">
          <div className="inline-block rounded-md px-3 py-1 text-sm bg-teal-500/10 text-teal-500 mb-2">
            Intelligent Scheduling
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Schedule Timetables with Precision & Ease
          </h1>
          <p className="text-xl text-muted-foreground">
            Effortlessly create conflict-free academic schedules that optimize faculty workload 
            and room utilization while meeting all educational requirements.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button 
              size="lg" 
              className="group"
              onClick={() => generateSchedule()}
            >
              Generate Schedule 
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Link to="/schedules">
              <Button variant="outline" size="lg">
                View Schedules
              </Button>
            </Link>
          </div>
        </div>
        <div className="relative w-full max-w-md">
          <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 to-teal-700 rounded-lg blur opacity-30"></div>
          <div className="relative bg-background glass-effect rounded-lg p-6 shadow-xl">
            <img
              src="/lovable-uploads/c6e622f8-0efa-466a-ae2f-fa066cb28875.png"
              alt="Schedule Illustration"
              className="w-full rounded-md object-cover"
            />
          </div>
        </div>
      </section>

      <section className="py-8">
        <h2 className="text-3xl font-bold mb-8 text-center">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <Card key={i} className="border border-border glass-effect hover:shadow-md transition-all duration-300">
              <CardHeader>
                <div className="mb-4">{feature.icon}</div>
                <CardTitle className="flex justify-between items-center">
                  <span>{feature.title}</span>
                  {feature.count > 0 && (
                    <span className="inline-flex items-center justify-center h-6 min-w-6 rounded-full bg-teal-500/10 text-teal-500 text-sm">
                      {feature.count}
                    </span>
                  )}
                </CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Link to={feature.link} className="w-full">
                  <Button variant="outline" className="w-full group">
                    Manage
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      <section className="py-8 bg-teal-900/10 rounded-lg p-6">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-bold">How It Works</h2>
          <p className="text-lg text-muted-foreground">
            Our intelligent scheduling system ensures optimal timetables by:
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 text-left">
            <li className="bg-background/40 p-4 rounded-lg border border-border">
              <h3 className="font-bold text-lg mb-2">Workload Management</h3>
              <p className="text-sm text-muted-foreground">
                Distributes teaching hours fairly based on instructor designation
              </p>
            </li>
            <li className="bg-background/40 p-4 rounded-lg border border-border">
              <h3 className="font-bold text-lg mb-2">Conflict Resolution</h3>
              <p className="text-sm text-muted-foreground">
                Ensures instructors are never double-booked for classes
              </p>
            </li>
            <li className="bg-background/40 p-4 rounded-lg border border-border">
              <h3 className="font-bold text-lg mb-2">Resource Optimization</h3>
              <p className="text-sm text-muted-foreground">
                Efficiently utilizes rooms based on class size and availability
              </p>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default Index;
