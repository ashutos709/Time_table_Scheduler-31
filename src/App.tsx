
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SchedulerProvider } from "@/context/SchedulerContext";
import Layout from "@/components/layout/Layout";
import Index from "@/pages/Index";
import InstructorsPage from "@/pages/InstructorsPage";
import CoursesPage from "@/pages/CoursesPage";
import RoomsPage from "@/pages/RoomsPage";
import DepartmentsPage from "@/pages/DepartmentsPage";
import SectionsPage from "@/pages/SectionsPage";
import TimeSlotsPage from "@/pages/TimeSlotsPage";
import SchedulesPage from "@/pages/SchedulesPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SchedulerProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/instructors" element={<InstructorsPage />} />
              <Route path="/courses" element={<CoursesPage />} />
              <Route path="/rooms" element={<RoomsPage />} />
              <Route path="/departments" element={<DepartmentsPage />} />
              <Route path="/sections" element={<SectionsPage />} />
              <Route path="/time-slots" element={<TimeSlotsPage />} />
              <Route path="/schedules" element={<SchedulesPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </SchedulerProvider>
  </QueryClientProvider>
);

export default App;
