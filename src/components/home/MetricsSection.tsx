import React from 'react';

const MetricItem = ({ value, label }: { value: string; label: string }) => (
  <div className="text-center">
    <p className="text-4xl font-bold font-serif text-primary">{value}</p>
    <p className="text-sm text-muted-foreground mt-1">{label}</p>
  </div>
);

const MetricsSection = () => {
  const metrics = [
    { value: '10K+', label: 'Curated Styles' },
    { value: '100+', label: 'Premium Brands' },
    { value: '1M', label: 'Future Community' },
  ];

  return (
    <section className="bg-secondary/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
          <div className="hidden md:block">
            <img src="/home8.jpg" alt="Fashion item" className="w-2/3 mx-auto"/>
          </div>
          
          <div className="col-span-2 grid grid-cols-3 gap-8">
            {metrics.map(metric => (
              <MetricItem key={metric.label} value={metric.value} label={metric.label} />
            ))}
          </div>

          <div className="hidden md:flex justify-center items-center">
            <div className="w-32 h-32 rounded-full border-2 border-dashed border-primary flex items-center justify-center">
              <span className="text-center text-xs font-semibold text-primary transform -rotate-12">Launching 2025</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MetricsSection;
