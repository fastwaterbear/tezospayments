import React from 'react';

export const Generator = () => {
  return <div>Generator</div>;
};

export const GeneratorPure = React.memo(Generator);
