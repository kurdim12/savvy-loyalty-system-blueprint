
import { CafeOfficialSeatingPlan } from '@/components/community/enhanced/CafeOfficialSeatingPlan';

const CommunityPage = () => {
  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <CafeOfficialSeatingPlan exportMode={true} />
    </div>
  );
};

export default CommunityPage;
