'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState({ forms: 0, leads: 0 });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      fetchStats();
    }
  }, [session]);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/forms');
      const data = await res.json();
      setStats({
        forms: data.forms?.length || 0,
        leads: data.forms?.reduce((sum: number, f: any) => sum + (f.leads_count || 0), 0) || 0,
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Version badge */}
      <div className="fixed top-4 right-4 text-xs text-slate-500 bg-slate-800/50 px-2 py-1 rounded">
        v2
      </div>

      {/* Navigation */}
      <nav className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 lg:px-16 py-6 flex justify-between items-center">
          <Link href="/dashboard" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            Formix
          </Link>
          <div className="flex items-center gap-8">
            <span className="text-slate-300">{session.user?.email}</span>
            <button
              onClick={() => signOut({ redirect: true, callbackUrl: '/' })}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 lg:px-16 py-32">
        {/* Welcome Section */}
        <div className="mb-24">
          <h1 className="text-5xl font-bold text-white mb-4">
            Welcome, {session.user?.name || session.user?.email}
          </h1>
          <p className="text-slate-400 text-lg">
            Create and manage your forms to capture leads via WhatsApp
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-12 mb-24">
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-lg p-10">
            <div className="text-slate-400 text-sm font-medium mb-4">Total Forms</div>
            <div className="text-5xl font-bold text-white mb-4">{stats.forms}</div>
            <p className="text-slate-500 text-sm">
              {stats.forms === 0 ? 'Create your first form' : 'Forms created'}
            </p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-lg p-10">
            <div className="text-slate-400 text-sm font-medium mb-4">Total Leads</div>
            <div className="text-5xl font-bold text-white mb-4">{stats.leads}</div>
            <p className="text-slate-500 text-sm">Leads captured this month</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-lg p-10">
            <div className="text-slate-400 text-sm font-medium mb-4">Plan</div>
            <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-4">
              Free
            </div>
            <p className="text-slate-500 text-sm">1 form • 10 leads/month</p>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur border border-purple-400/50 rounded-lg p-16 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to start?</h2>
          <p className="text-slate-300 mb-10 max-w-2xl mx-auto text-lg leading-relaxed">
            Create your first form and start capturing leads directly to your WhatsApp
          </p>
          <Link
            href="/dashboard/forms"
            className="inline-block px-10 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:opacity-90 transition text-lg"
          >
            Go to Forms
          </Link>
        </div>
      </main>
    </div>
  );
}