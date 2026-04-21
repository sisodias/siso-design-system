import { AnalyticsCard } from '@/components/ui/card';
import { ArrowUpRight } from 'lucide-react';

// --- DEMO COMPONENT ---
// Provides a clean, centered preview of the AnalyticsCard.
const AnalyticsCardDemo = () => {
  // Sample data to be passed into the component via props.
  const sampleAnalyticsData = [
    { label: 'Mon', value: 64 },
    { label: 'Tue', value: 52 },
    { label: 'Wed', value: 46 },
  ];

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background p-4">
      <AnalyticsCard
        title="Analytics"
        totalAmount="$242,63"
        icon={<ArrowUpRight className="h-4 w-4 text-muted-foreground" />}
        data={sampleAnalyticsData}
      />
    </div>
  );
};

export default AnalyticsCardDemo;
