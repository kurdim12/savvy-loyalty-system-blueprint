import Header from '@/components/layout/Header';

const AdminDashboard = () => {
  return (
    <div className="flex min-h-screen flex-col bg-[#FAF6F0]">
      <Header />
      <main className="flex-1 p-4 md:p-6 container mx-auto">
        <h1 className="text-2xl font-bold text-[#8B4513]">Admin Dashboard</h1>
        {/* Admin Dashboard content here */}
      </main>
      <footer className="py-4 px-6 text-center text-sm text-[#6F4E37] border-t border-[#8B4513]/10">
        &copy; {new Date().getFullYear()} Raw Smith Coffee Loyalty Program
      </footer>
    </div>
  );
};

export default AdminDashboard;
