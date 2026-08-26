import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import NavBar from '../components/NavBar';
import { apiFetch } from '../lib/api';

export default function SellerDetail() {
  const { id } = useParams();
  const [seller, setSeller] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    apiFetch(`/sellers/${id}`)
      .then((data) => setSeller(data.seller))
      .catch((err) => setError(err.message));
  }, [id]);

  if (error) return <p className="p-10 text-center text-sm text-red-600">{error}</p>;
  if (!seller) return <p className="p-10 text-center text-sm text-gray-500">Loading…</p>;

  const digits = seller.contact_number.replace(/\D/g, '');

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main className="mx-auto max-w-xl px-6 py-10">
        <Link to={`/category/${encodeURIComponent(seller.category)}`} className="text-sm text-primary hover:underline">
          ← Back to {seller.category}
        </Link>

        <div className="mt-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">{seller.title}</h1>
          <p className="mt-1 text-sm text-gray-500">
            {seller.seller_name} · Flat {seller.flat_no} · {seller.category}
          </p>
          {seller.price_range && (
            <p className="mt-3 inline-block rounded-full bg-primary-light px-3 py-1 text-sm font-medium text-primary-dark">
              {seller.price_range}
            </p>
          )}
          <p className="mt-4 text-gray-700">{seller.description}</p>

          <div className="mt-6 flex gap-3">
            <a
              href={`tel:${digits}`}
              className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-center font-semibold text-white hover:bg-primary-dark"
            >
              📞 Call
            </a>
            <a
              href={`https://wa.me/${digits}`}
              target="_blank"
              rel="noreferrer"
              className="flex-1 rounded-lg bg-green-500 px-4 py-2.5 text-center font-semibold text-white hover:bg-green-600"
            >
              💬 WhatsApp
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
