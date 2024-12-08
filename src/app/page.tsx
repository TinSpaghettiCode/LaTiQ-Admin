// app/page.tsx
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Chuyển hướng đến trang Dashboard khi người dùng truy cập vào trang chính
    router.push('/pages/dashboard');
  }, [router]);

  return null; // Không cần render gì ở đây
}
