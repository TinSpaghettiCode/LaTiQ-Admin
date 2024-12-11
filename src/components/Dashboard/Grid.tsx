import React from 'react';
import { StatCards } from './StatCards';
import { ActivityGraph } from './ActivityGraph';
import { UsageRadar } from './UsageRadar';
import { RecentTransactions } from './ReactTransactions';

const Grid = () => {
  return (
    <div className="px-4 grid gap-3 grid-cols-12">
      <StatCards />
      <ActivityGraph />
      <UsageRadar />
      <RecentTransactions />
    </div>
  );
};

export default Grid;
