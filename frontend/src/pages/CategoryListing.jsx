import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import NavBar from '../components/NavBar';
import SellerCard from '../components/SellerCard';
import { apiFetch } from '../lib/api';

export default function CategoryListing() {
  const { name } = useParams();
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    apiFetch(`/sellers?category=${encodeURIComponent(name)}`)
      .then((data) => setSellers(data.sellers))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [name]);

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main className="mx-auto max-w-3xl px-6 py-10">
        <Link to="/home" className="text-sm text-primary hover:underline">
          ← All categories
        </Link>
        <h1 className="mt-2 mb-6 text-2xl font-bold text-gray-900">{name}</h1>

        {loading && <p className="text-sm text-gray-500">Loading…</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}
        {!loading && sellers.length === 0 && (
          <p className="text-sm text-gray-500">No approved sellers in this category yet.</p>
        )}

        <div className="space-y-3">
          {sellers.map((s) => (
            <SellerCard key={s.id} seller={s} />
          ))}
        </div>
      </main>
    </div>
  );
}
