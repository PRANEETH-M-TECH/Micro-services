import { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import CategoryCard from '../components/CategoryCard';
import SmartSearchBar from '../components/SmartSearchBar';
import { apiFetch } from '../lib/api';

export default function CategoryGrid() {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    apiFetch('/categories')
      .then((data) => setCategories(data.categories))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="mb-2 text-center text-2xl font-bold text-gray-900">What are you looking for?</h1>
        <p className="mb-8 text-center text-sm text-gray-500">
          Browse categories, or describe what you need below.
        </p>

        <SmartSearchBar />

        {error && <p className="text-center text-sm text-red-600">{error}</p>}

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {categories.map((c) => (
            <CategoryCard key={c.id} category={c} />
          ))}
        </div>
      </main>
    </div>
  );
}
