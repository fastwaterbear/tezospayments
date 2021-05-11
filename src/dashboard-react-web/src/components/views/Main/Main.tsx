import React from 'react';
import './Main.scss';

export const Main = () => {
  return <div>
    Main
  </div>;
};

export const MainPure = React.memo(Main);
