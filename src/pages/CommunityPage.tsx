import { InteractiveCommunityHub } from '@/components/community/InteractiveCommunityHub';
import Layout from '@/components/layout/Layout';

const CommunityPage = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-[#FAF6F0] to-[#F5E6D3]">
        <div className="container mx-auto px-4 py-8">
          <InteractiveCommunityHub />
        </div>
      </div>
    </Layout>
  );
};

export default CommunityPage;
