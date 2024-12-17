// app/layout.tsx
import React, { Suspense } from 'react';
import { Sidebar } from '@/components/Sidebar/Sidebar';
import './globals.css'; // Import CSS toàn cục nếu cần
import Loading from '@/components/Loading';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-stone-100 text-stone-900">
        <main className="grid gap-4 p-4 grid-cols-[220px,_1fr] no-scrollbar min-h-[100vh]">
          <Sidebar />
          <Suspense fallback={<Loading />}>
            <div>{children}</div>
          </Suspense>
        </main>
      </body>
    </html>
  );
}
