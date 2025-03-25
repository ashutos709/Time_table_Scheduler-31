
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-6">
      <div className="relative flex flex-col items-center justify-center space-y-2">
        <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 to-teal-700 rounded-full blur opacity-30 animate-pulse"></div>
        <AlertCircle className="relative h-24 w-24 text-teal-500" />
      </div>
      
      <h1 className="text-5xl font-bold">404</h1>
      <h2 className="text-xl font-medium">Page Not Found</h2>
      
      <p className="text-muted-foreground max-w-md">
        The page you're looking for doesn't exist or has been moved.
      </p>
      
      <Link to="/">
        <Button className="mt-4">
          <Home className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;
