import React from 'react';

import { ProfitPure } from '../Charts/Profit';

export const Services = () => {
  return <div>
    <div className="analytics-container">
      <ProfitPure />
      <ProfitPure />
      <ProfitPure />
      <ProfitPure />
    </div>
  </div>;
};

export const ServicesPure = React.memo(Services);
