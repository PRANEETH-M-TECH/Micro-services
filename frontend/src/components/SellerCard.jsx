import { Link } from 'react-router-dom';

export default function SellerCard({ seller }) {
  return (
    <Link
      to={`/seller/${seller.id}`}
      className="block rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold text-gray-900">{seller.title}</h3>
          <p className="mt-1 text-sm text-gray-500">
            {seller.seller_name} · Flat {seller.flat_no}
          </p>
        </div>
        {seller.price_range && (
          <span className="whitespace-nowrap rounded-full bg-primary-light px-3 py-1 text-xs font-medium text-primary-dark">
            {seller.price_range}
          </span>
        )}
      </div>
      <p className="mt-3 line-clamp-2 text-sm text-gray-600">{seller.description}</p>
    </Link>
  );
}
