'use client';

import React, { Suspense, lazy } from 'react';
import Loading from '../Loading';

// Lazy load the TopBar and Grid components
const TopBar = lazy(() => import('./TopBar'));
const Grid = lazy(() => import('./Grid'));

export const Dashboard = () => {
  return (
    <div className="bg-white rounded-lg pb-4 shadow">
      <Suspense fallback={<Loading />}>
        <TopBar />
        <Grid />
      </Suspense>
    </div>
  );
};
