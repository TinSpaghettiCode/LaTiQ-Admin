// app/layout.tsx
'use client';
import React, { Suspense } from 'react';
import { Sidebar } from '@/components/Sidebar/Sidebar';
import './globals.css'; // Import CSS toàn cục nếu cần
import Loading from '@/components/Loading';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { EdgeStoreProvider } from '@/lib/edgestore';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import LoginPage from './pages/login/page';
import { Toaster } from 'react-hot-toast';

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <MainLayout>{children}</MainLayout>
    </AuthProvider>
  );
}

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();

  return (
    <QueryClientProvider client={queryClient}>
      <html lang="en">
        <body className="bg-stone-100 text-stone-900">
          <Toaster position="top-center" reverseOrder={false} />
          {isAuthenticated ? (
            <main className="grid gap-4 p-4 grid-cols-[220px,_1fr] no-scrollbar min-h-[100vh]">
              <Sidebar />
              <Suspense fallback={<Loading />}>
                <EdgeStoreProvider>
                  <div>{children}</div>
                </EdgeStoreProvider>
              </Suspense>
              <ReactQueryDevtools initialIsOpen={false} />
            </main>
          ) : (
            <LoginPage />
          )}
        </body>
      </html>
    </QueryClientProvider>
  );
};
