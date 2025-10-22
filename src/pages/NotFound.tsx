import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { usePage } from "@/context/PageContext";

const NotFound = () => {
  const location = useLocation();
  const { setCurrentPageTitle } = usePage();

  useEffect(() => {
    setCurrentPageTitle("Страница не найдена");
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname, setCurrentPageTitle]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="text-center">
        <p className="mb-4 text-xl text-gray-600">Oops! Page not found</p>
        <a href="/" className="text-blue-500 underline hover:text-blue-700">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
