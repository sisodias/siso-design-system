import React from 'react';
import DivergingIncidentReportCard from "./stacked-diverging-bar";

function DivergingIncidentReportCardDemoPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-neutral-900 p-4 transition-colors duration-300">
      <DivergingIncidentReportCard title="Incident Resolution Trend" />
    </div>
  );
}

export default DivergingIncidentReportCardDemoPage;
