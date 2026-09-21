'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Form {
  id: string;
  name: string;
  description: string;
  created_at: string;
  leads_count: number;
}

export default function FormsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newForm, setNewForm] = useState({ name: '', description: '' });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      fetchForms();
    }
  }, [session]);

  const fetchForms = async () => {
    try {
      const res = await fetch('/api/forms');
      const data = await res.json();
      setForms(data.forms || []);
    } catch (err) {
      console.error('Error fetching forms:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateForm = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const res = await fetch('/api/forms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newForm),
      });

      if (res.ok) {
        const data = await res.json();
        setForms([...forms, data.form]);
        setNewForm({ name: '', description: '' });
        setShowNewForm(false);
        router.push(`/dashboard/forms/${data.form.id}`);
      }
    } catch (err) {
      console.error('Error creating form:', err);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            Formix
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="text-slate-300 hover:text-white transition">
              Dashboard
            </Link>
            <span className="text-slate-300">{session?.user?.email}</span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Your Forms</h1>
            <p className="text-slate-400">
              {forms.length} form{forms.length !== 1 ? 's' : ''} created
            </p>
          </div>
          <button
            onClick={() => setShowNewForm(!showNewForm)}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:opacity-90 transition"
          >
            Create New Form
          </button>
        </div>

        {/* New Form Modal */}
        {showNewForm && (
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-lg p-8 mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">Create New Form</h2>
            <form onSubmit={handleCreateForm} className="space-y-4">
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">
                  Form Name
                </label>
                <input
                  type="text"
                  value={newForm.name}
                  onChange={(e) => setNewForm({ ...newForm, name: e.target.value })}
                  placeholder="Contact Form"
                  required
                  className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition"
                />
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">
                  Description (optional)
                </label>
                <textarea
                  value={newForm.description}
                  onChange={(e) => setNewForm({ ...newForm, description: e.target.value })}
                  placeholder="Collect customer inquiries"
                  rows={3}
                  className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition"
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:opacity-90 transition"
                >
                  Create Form
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewForm(false)}
                  className="px-6 py-2 bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-600 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Forms List */}
        {forms.length === 0 ? (
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-lg p-12 text-center">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-white mb-2">No forms yet</h3>
            <p className="text-slate-400 mb-6">
              Create your first form to start capturing leads
            </p>
            <button
              onClick={() => setShowNewForm(true)}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:opacity-90 transition"
            >
              Create First Form
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {forms.map((form) => (
              <Link
                key={form.id}
                href={`/dashboard/forms/${form.id}`}
                className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-lg p-6 hover:bg-slate-800/80 transition block"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">{form.name}</h3>
                    <p className="text-slate-400 mb-4">{form.description}</p>
                    <div className="flex gap-8 text-sm text-slate-500">
                      <span>📧 {form.leads_count} leads</span>
                      <span>📅 {new Date(form.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl">→</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
