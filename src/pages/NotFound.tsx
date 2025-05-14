
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
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
    <div className="min-h-screen flex items-center justify-center bg-[#FAF6F0]">
      <div className="text-center p-6 max-w-md">
        <h1 className="text-4xl font-bold mb-4 text-[#8B4513]">404</h1>
        <p className="text-xl text-[#6F4E37] mb-6">Oops! Page not found</p>
        <Link to="/" className="bg-[#8B4513] text-white px-4 py-2 rounded hover:bg-[#6F4E37] transition-colors">
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
