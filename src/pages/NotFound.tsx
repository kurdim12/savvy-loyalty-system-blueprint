
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF6F0]">
      <div className="text-center p-8">
        <h1 className="text-6xl font-bold text-[#8B4513] mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-[#6F4E37] mb-6">Page Not Found</h2>
        <p className="text-[#6F4E37] mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Button asChild className="bg-[#8B4513] hover:bg-[#6F4E37]">
          <Link to="/">Return Home</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
