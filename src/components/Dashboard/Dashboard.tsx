'use client';

import React from 'react';
import TopBar from './TopBar';
import Grid from './Grid';

// Lazy load the TopBar and Grid components

export const Dashboard = () => {
  return (
    <div className="bg-white rounded-lg pb-4 shadow">
      <TopBar />
      <Grid />
    </div>
  );
};
