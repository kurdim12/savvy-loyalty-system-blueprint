
import Layout from '@/components/layout/Layout';

const CommunityHub = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-[#95A5A6]/5 via-white to-[#95A5A6]/10">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
              Community Hub
            </h1>
            <p className="text-xl text-[#95A5A6] max-w-2xl mx-auto">
              Connect, compete, and celebrate coffee culture with fellow enthusiasts
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CommunityHub;
