import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-6">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <h1 className="text-7xl font-bold tracking-tight">404</h1>

        <p className="mt-4 text-xl text-muted-foreground">
          This page wandered off into the internet void.
        </p>

        <Link
          to="/"
          className="inline-block mt-6 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:scale-105"
        >
          Go Home
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;