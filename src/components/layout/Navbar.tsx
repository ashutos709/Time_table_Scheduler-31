import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Calendar, Users, BookOpen, School, Home, Clock, Building2 } from 'lucide-react';
const Navbar: React.FC = () => {
  const location = useLocation();
  const navItems = [{
    path: '/',
    label: 'Home',
    icon: <Home className="h-5 w-5" />
  }, {
    path: '/instructors',
    label: 'Instructors',
    icon: <Users className="h-5 w-5" />
  }, {
    path: '/courses',
    label: 'Courses',
    icon: <BookOpen className="h-5 w-5" />
  }, {
    path: '/rooms',
    label: 'Rooms',
    icon: <Building2 className="h-5 w-5" />
  }, {
    path: '/departments',
    label: 'Departments',
    icon: <School className="h-5 w-5" />
  }, {
    path: '/time-slots',
    label: 'Time Slots',
    icon: <Clock className="h-5 w-5" />
  }, {
    path: '/schedules',
    label: 'Schedules',
    icon: <Calendar className="h-5 w-5" />
  }];
  return <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <Calendar className="h-8 w-8 text-teal-500" />
          <span className="text-xl font-semibold tracking-tight">Scheduler</span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map(item => <Link key={item.path} to={item.path} className={cn("flex items-center gap-1 text-sm font-medium transition-colors relative px-1 py-1.5", location.pathname === item.path ? "text-teal-500" : "text-muted-foreground hover:text-foreground")}>
              {item.icon}
              <span>{item.label}</span>
              {location.pathname === item.path && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-500 animate-fade-in rounded-full" />}
            </Link>)}
        </nav>
        
        <div className="block md:hidden">
          {/* Mobile menu button would go here */}
        </div>
      </div>
    </header>;
};
export default Navbar;