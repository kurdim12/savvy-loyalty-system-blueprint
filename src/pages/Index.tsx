
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';

const Index = () => {
  return (
    <div className="flex min-h-screen flex-col bg-[#FAF6F0]">
      <Header />
      <main className="flex-1 p-4 md:p-6 container mx-auto">
        <div className="max-w-4xl mx-auto text-center py-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#8B4513] mb-6">Welcome to Raw Smith Coffee</h1>
          <p className="text-xl text-[#6F4E37] mb-8">Join our loyalty program to earn rewards for your coffee purchases!</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link 
              to="/auth" 
              className="bg-[#8B4513] text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-[#6F4E37] transition-colors"
            >
              Sign Up / Login
            </Link>
            <Link 
              to="/admin/login" 
              className="bg-transparent border border-[#8B4513] text-[#8B4513] px-6 py-3 rounded-lg text-lg font-medium hover:bg-[#8B4513]/10 transition-colors"
            >
              Admin Login
            </Link>
          </div>
        </div>
      </main>
      <footer className="py-4 px-6 text-center text-sm text-[#6F4E37] border-t border-[#8B4513]/10">
        &copy; {new Date().getFullYear()} Raw Smith Coffee Loyalty Program
      </footer>
    </div>
  );
};

export default Index;
