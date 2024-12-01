// src/components/Layout.tsx
import React from 'react';
import { Sidebar } from './Sidebar/Sidebar';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="grid gap-4 p-4 grid-cols-[220px,_1fr] no-scrollbar">
      <Sidebar />
      <div>{children}</div>
    </main>
  );
};

export default Layout;
