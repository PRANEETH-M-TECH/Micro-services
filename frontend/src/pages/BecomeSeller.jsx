import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import { apiFetch } from '../lib/api';

export default function BecomeSeller() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [rough, setRough] = useState('');
  const [form, setForm] = useState({ category_id: '', title: '', description: '', price_range: '', contact_number: '' });
  const [aiLoading, setAiLoading] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    apiFetch('/categories').then((data) => setCategories(data.categories));
  }, []);

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
      await apiFetch('/sellers', { method: 'POST', body: JSON.stringify(form) });
      navigate('/home');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main className="mx-auto max-w-xl px-6 py-10">
        <h1 className="text-2xl font-bold text-gray-900">List your offering</h1>
        <p className="mt-1 text-sm text-gray-500">
          Not sure how to phrase it? Type a rough description below and let AI help.
        </p>

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
            {submitting ? 'Submitting…' : 'Submit for approval'}
          </button>
        </form>
      </main>
    </div>
  );
}
