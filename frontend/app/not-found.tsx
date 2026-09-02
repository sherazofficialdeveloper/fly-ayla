'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#08080A] text-white p-6 text-center">
      <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
      <p className="text-zinc-400 mb-6 max-w-md">
        The requested flight portal or aviation page could not be located.
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
      >
        Return to Home
      </Link>
    </div>
  );
}
