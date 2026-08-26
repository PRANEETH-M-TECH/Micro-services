import { useState } from 'react';
import { apiFetch } from '../lib/api';
import SellerCard from './SellerCard';

export default function SmartSearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSearch(e) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    try {
      const { sellers } = await apiFetch('/search', {
        method: 'POST',
        body: JSON.stringify({ query }),
      });
      setResults(sellers);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto mb-10 max-w-2xl">
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Try: someone who delivers milk every morning"
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 focus:border-primary focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-primary px-5 py-2.5 font-medium text-white hover:bg-primary-dark disabled:opacity-50"
        >
          {loading ? 'Searching…' : 'Smart Search'}
        </button>
      </form>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      {results && (
        <div className="mt-6 space-y-3">
          {results.length === 0 ? (
            <p className="text-sm text-gray-500">No matching sellers found.</p>
          ) : (
            results.map((s) => <SellerCard key={s.id} seller={s} />)
          )}
        </div>
      )}
    </div>
  );
}
