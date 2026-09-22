'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function FeesIndexPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/fees/collect');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
