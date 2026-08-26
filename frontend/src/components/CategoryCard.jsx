import { Link } from 'react-router-dom';

const ICONS = {
  Food: '🍲',
  Clothing: '👕',
  Essentials: '🧺',
  'Additional Services': '🛠️',
  Tuitions: '📚',
};

export default function CategoryCard({ category }) {
  return (
    <Link
      to={`/category/${encodeURIComponent(category.name)}`}
      className="flex flex-col items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <span className="text-4xl">{ICONS[category.name] || '🏷️'}</span>
      <span className="font-semibold text-gray-800">{category.name}</span>
    </Link>
  );
}
