import { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import { apiFetch } from '../lib/api';

const TABS = [
  { key: 'consumers', label: 'Pending Accounts' },
  { key: 'sellers', label: 'Pending Sellers' },
  { key: 'approved', label: 'All Approved Sellers' },
];

export default function AdminDashboard() {
  const [tab, setTab] = useState('consumers');
  const [pendingUsers, setPendingUsers] = useState([]);
  const [pendingSellers, setPendingSellers] = useState([]);
  const [approvedSellers, setApprovedSellers] = useState([]);
  const [error, setError] = useState('');

  async function loadAll() {
    setError('');
    try {
      const [users, sellers, approved] = await Promise.all([
        apiFetch('/admin/pending-users'),
        apiFetch('/admin/sellers/pending'),
        apiFetch('/admin/sellers'),
      ]);
      setPendingUsers(users.users);
      setPendingSellers(sellers.sellers);
      setApprovedSellers(approved.sellers);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  async function actOnUser(id, action) {
    await apiFetch(`/admin/users/${id}/${action}`, { method: 'PATCH' });
    loadAll();
  }

  async function actOnSeller(id, action) {
    await apiFetch(`/admin/sellers/${id}/${action}`, { method: 'PATCH' });
    loadAll();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main className="mx-auto max-w-4xl px-6 py-10">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>

        <div className="mt-6 flex gap-2 border-b border-gray-200">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`border-b-2 px-4 py-2 text-sm font-medium ${
                tab === t.key ? 'border-primary text-primary' : 'border-transparent text-gray-500'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        {tab === 'consumers' && (
          <div className="mt-6 space-y-3">
            {pendingUsers.length === 0 && <p className="text-sm text-gray-500">No pending sign-ups.</p>}
            {pendingUsers.map((u) => (
              <div key={u.id} className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4">
                <div>
                  <p className="font-medium text-gray-900">
                    {u.name} <span className="ml-2 rounded bg-gray-100 px-2 py-0.5 text-xs capitalize">{u.role}</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Flat {u.flat_no} · {u.phone} · {u.email}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => actOnUser(u.id, 'approve')}
                    className="rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-white hover:bg-primary-dark"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => actOnUser(u.id, 'reject')}
                    className="rounded-lg border border-red-300 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'sellers' && (
          <div className="mt-6 space-y-3">
            {pendingSellers.length === 0 && <p className="text-sm text-gray-500">No pending listings.</p>}
            {pendingSellers.map((s) => (
              <div key={s.id} className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4">
                <div>
                  <p className="font-medium text-gray-900">{s.title}</p>
                  <p className="text-sm text-gray-500">
                    {s.category} · {s.seller_name} · Flat {s.flat_no}
                  </p>
                  <p className="mt-1 text-sm text-gray-600">{s.description}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => actOnSeller(s.id, 'approve')}
                    className="rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-white hover:bg-primary-dark"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => actOnSeller(s.id, 'reject')}
                    className="rounded-lg border border-red-300 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'approved' && (
          <div className="mt-6 space-y-6">
            {Object.entries(
              approvedSellers.reduce((acc, s) => {
                (acc[s.category] ||= []).push(s);
                return acc;
              }, {})
            ).map(([category, sellers]) => (
              <div key={category}>
                <h2 className="mb-2 font-semibold text-gray-800">{category}</h2>
                <div className="space-y-2">
                  {sellers.map((s) => (
                    <div key={s.id} className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm">
                      {s.title} — {s.seller_name} (Flat {s.flat_no})
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {approvedSellers.length === 0 && <p className="text-sm text-gray-500">No approved sellers yet.</p>}
          </div>
        )}
      </main>
    </div>
  );
}
