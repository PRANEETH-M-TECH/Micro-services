import { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import { apiFetch } from '../lib/api';

const EMPTY_FORM = { category_id: '', title: '', description: '', price_range: '', contact_number: '' };

const STATUS_STYLES = {
  approved: 'bg-primary-light text-primary-dark',
  pending: 'bg-category-amber-light text-category-amber-dark',
  rejected: 'bg-red-50 text-red-600',
};

function StatusPill({ status }) {
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_STYLES[status] || STATUS_STYLES.pending}`}>
      {status}
    </span>
  );
}

export default function BecomeSeller() {
  const [categories, setCategories] = useState([]);
  const [myListings, setMyListings] = useState([]);
  const [loadingMine, setLoadingMine] = useState(true);
  // null = show the dashboard; 'create' = new-listing form; a listing id = editing that listing
  const [formMode, setFormMode] = useState(null);

  const [rough, setRough] = useState('');
  const [form, setForm] = useState(EMPTY_FORM);
  const [aiLoading, setAiLoading] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function loadMine() {
    setLoadingMine(true);
    try {
      const { sellers } = await apiFetch('/sellers/mine');
      setMyListings(sellers);
      setFormMode(sellers.length === 0 ? 'create' : null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingMine(false);
    }
  }

  useEffect(() => {
    apiFetch('/categories').then((data) => setCategories(data.categories));
    loadMine();
  }, []);

  function startCreate() {
    setForm(EMPTY_FORM);
    setRough('');
    setError('');
    setFormMode('create');
  }

  function startEdit(listing) {
    setForm({
      category_id: listing.category_id,
      title: listing.title,
      description: listing.description,
      price_range: listing.price_range || '',
      contact_number: listing.contact_number,
    });
    setError('');
    setFormMode(listing.id);
  }

  async function suggestCategory() {
    if (!rough.trim()) return;
    setAiLoading('category');
    setError('');
    try {
      const { category } = await apiFetch('/ai/suggest-category', {
        method: 'POST',
        body: JSON.stringify({ description: rough }),
      });
      const match = categories.find((c) => c.name === category);
      if (match) setForm((f) => ({ ...f, category_id: match.id }));
    } catch (err) {
      setError(err.message);
    } finally {
      setAiLoading('');
    }
  }

  async function generateListing() {
    if (!rough.trim()) return;
    setAiLoading('listing');
    setError('');
    try {
      const { listing } = await apiFetch('/ai/generate-listing', {
        method: 'POST',
        body: JSON.stringify({ text: rough }),
      });
      setForm((f) => ({ ...f, title: listing.title, description: listing.description, price_range: listing.price_range }));
    } catch (err) {
      setError(err.message);
    } finally {
      setAiLoading('');
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      if (typeof formMode === 'number') {
        await apiFetch(`/sellers/${formMode}`, { method: 'PUT', body: JSON.stringify(form) });
      } else {
        await apiFetch('/sellers', { method: 'POST', body: JSON.stringify(form) });
      }
      await loadMine();
      setFormMode(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  const showForm = formMode !== null;

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main className="mx-auto max-w-xl px-6 py-10">
        {!showForm && (
          <>
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Your Listings</h1>
              <button
                onClick={startCreate}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
              >
                + Add listing
              </button>
            </div>

            {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

            <div className="mt-6 space-y-3">
              {loadingMine && <p className="text-sm text-gray-500">Loading…</p>}
              {!loadingMine && myListings.length === 0 && (
                <p className="text-sm text-gray-500">You haven't listed anything yet.</p>
              )}
              {myListings.map((listing) => (
                <div key={listing.id} className="rounded-lg border border-gray-200 bg-white p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-gray-900">{listing.title}</p>
                      <p className="text-sm text-gray-500">{listing.category}</p>
                    </div>
                    <StatusPill status={listing.status} />
                  </div>
                  <p className="mt-2 text-sm text-gray-600">{listing.description}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {listing.price_range || 'Contact for pricing'} · {listing.contact_number}
                    </span>
                    <button onClick={() => startEdit(listing)} className="text-sm font-medium text-primary hover:underline">
                      Edit
                    </button>
                  </div>
                  {listing.status === 'pending' && (
                    <p className="mt-2 text-xs text-category-amber-dark">Waiting on admin approval.</p>
                  )}
                  {listing.status === 'rejected' && (
                    <p className="mt-2 text-xs text-red-600">Not approved — edit and resubmit, or contact your admin.</p>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {showForm && (
          <>
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">
                {typeof formMode === 'number' ? 'Edit listing' : 'List your offering'}
              </h1>
              {myListings.length > 0 && (
                <button onClick={() => setFormMode(null)} className="text-sm font-medium text-gray-500 hover:text-gray-800">
                  Cancel
                </button>
              )}
            </div>
            {typeof formMode !== 'number' && (
              <p className="mt-1 text-sm text-gray-500">
                Not sure how to phrase it? Type a rough description below and let AI help.
              </p>
            )}

            {typeof formMode !== 'number' && (
              <div className="mt-6 rounded-xl border border-dashed border-primary/40 bg-primary-light/40 p-4">
                <textarea
                  rows={3}
                  value={rough}
                  onChange={(e) => setRough(e.target.value)}
                  placeholder="e.g. I make fresh idli and dosa batter, sell by the kg, available most mornings"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                />
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={suggestCategory}
                    disabled={!rough.trim() || aiLoading === 'category'}
                    className="rounded-lg border border-primary px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary-light disabled:opacity-50"
                  >
                    {aiLoading === 'category' ? 'Thinking…' : '✨ Suggest Category'}
                  </button>
                  <button
                    type="button"
                    onClick={generateListing}
                    disabled={!rough.trim() || aiLoading === 'listing'}
                    className="rounded-lg border border-primary px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary-light disabled:opacity-50"
                  >
                    {aiLoading === 'listing' ? 'Thinking…' : '✨ Generate Listing'}
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <select
                required
                value={form.category_id}
                onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-primary focus:outline-none"
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <input
                required
                placeholder="Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-primary focus:outline-none"
              />
              <textarea
                required
                rows={3}
                placeholder="Description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-primary focus:outline-none"
              />
              <input
                placeholder="Price range (optional)"
                value={form.price_range}
                onChange={(e) => setForm({ ...form, price_range: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-primary focus:outline-none"
              />
              <input
                required
                placeholder="Contact number"
                value={form.contact_number}
                onChange={(e) => setForm({ ...form, contact_number: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-primary focus:outline-none"
              />

              {error && <p className="text-sm text-red-600">{error}</p>}
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-lg bg-primary px-4 py-2.5 font-semibold text-white hover:bg-primary-dark disabled:opacity-50"
              >
                {submitting ? 'Submitting…' : typeof formMode === 'number' ? 'Save changes' : 'Submit for approval'}
              </button>
            </form>
          </>
        )}
      </main>
    </div>
  );
}
