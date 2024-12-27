import { MultiStepMovieAddition } from '@/components/Movies/MultiStepMovieAddtion';
import React from 'react';

const page = () => {
  return (
    <div className="bg-white rounded-lg pb-4 shadow h-full">
      {/* Main Content */}
      <MultiStepMovieAddition />
    </div>
  );
};

export default page;
