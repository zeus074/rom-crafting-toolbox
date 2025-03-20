
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 max-w-md p-6 animate-fade-in-up">
        <h1 className="text-5xl font-bold tracking-tighter">404</h1>
        <p className="text-xl text-muted-foreground">This page does not exist</p>
        <div className="h-px w-16 bg-border mx-auto my-4"></div>
        <p className="text-muted-foreground">
          The page you are looking for might have been removed, had its name changed,
          or is temporarily unavailable.
        </p>
        <Button asChild variant="outline" className="mt-6">
          <Link to="/" className="inline-flex items-center">
            <ArrowLeft size={16} className="mr-2" />
            Return to Home
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
