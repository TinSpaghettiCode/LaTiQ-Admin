'use client';

import React, { useState } from 'react';
import AccountToggle from './AccountToggle';
import { Search } from './Search';
import { RouteSelect } from './RouteSelect';
import { Plan } from './Plan';

export const Sidebar = () => {
  const [selectedRoute, setSelectedRoute] = useState('/pages/dashboard');

  return (
    <div>
      {/* TODO: Main sidebar content */}
      <div className="overflow-y-scroll sticky top-4 h-[calc(100vh - 32px - 48px)] no-scrollbar">
        <AccountToggle />
        <Search />
        <RouteSelect
          selectedRoute={selectedRoute}
          setSelectedRoute={setSelectedRoute}
        />
      </div>

      <Plan />
      {/* TODO: Plan toggle */}
    </div>
  );
};
