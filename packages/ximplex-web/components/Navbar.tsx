'use client';

import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              ✨ Ximplex
            </div>
          </div>

          <div className="flex gap-6 items-center">
            <Link href="#features" className="text-gray-700 hover:text-purple-600 transition">
              Features
            </Link>
            <Link href="#pricing" className="text-gray-700 hover:text-purple-600 transition">
              Pricing
            </Link>
            <Link href="#docs" className="text-gray-700 hover:text-purple-600 transition">
              Docs
            </Link>
            <Link
              href="/login"
              className="px-6 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}