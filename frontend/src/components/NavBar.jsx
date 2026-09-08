import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../lib/api';

export default function NavBar() {
  const { user, logout } = useAuth();
  const [hasListing, setHasListing] = useState(false);

  useEffect(() => {
    if (user?.role === 'seller') {
      apiFetch('/sellers/mine')
        .then((data) => setHasListing(data.sellers.length > 0))
        .catch(() => {});
    }
  }, [user?.role]);

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link to="/home" className="text-lg font-bold text-primary-dark">
          Communa
        </Link>
        <div className="flex items-center gap-4 text-sm">
          {user?.role === 'seller' && (
            <Link to="/sell" className="font-medium text-primary hover:underline">
              {hasListing ? 'My Listing' : 'Become a Seller'}
            </Link>
          )}
          {user?.role === 'admin' && (
            <Link to="/admin" className="font-medium text-primary hover:underline">
              Admin Dashboard
            </Link>
          )}
          <span className="text-gray-500">{user?.name}</span>
          <button onClick={logout} className="text-gray-500 hover:text-gray-800">
            Log out
          </button>
        </div>
      </div>
    </header>
  );
}
