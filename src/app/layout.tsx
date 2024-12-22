// app/layout.tsx
'use client';
import React, { Suspense, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar/Sidebar';
import './globals.css'; // Import CSS toàn cục nếu cần
import Loading from '@/components/Loading';
import { useRouter } from 'next/navigation';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { EdgeStoreProvider } from '@/lib/edgestore';

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  useEffect(() => {
    // Chuyển hướng đến trang dashboard khi người dùng truy cập vào root URL
    router.push('/pages/dashboard');
  }, [router]);

  return (
    <QueryClientProvider client={queryClient}>
      <html lang="en">
        <body className="bg-stone-100 text-stone-900">
          <main className="grid gap-4 p-4 grid-cols-[220px,_1fr] no-scrollbar min-h-[100vh]">
            <Sidebar />
            <Suspense fallback={<Loading />}>
              <EdgeStoreProvider>
                <div>{children}</div>
              </EdgeStoreProvider>
            </Suspense>
            <ReactQueryDevtools initialIsOpen={false} />
          </main>
        </body>
      </html>
    </QueryClientProvider>
  );
}
