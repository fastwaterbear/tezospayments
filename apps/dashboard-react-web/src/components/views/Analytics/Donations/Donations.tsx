import React from 'react';

export const Donations = () => {
  return <div>
    <h2>Donations</h2>
  </div>;
};

export const DonationsPure = React.memo(Donations);
