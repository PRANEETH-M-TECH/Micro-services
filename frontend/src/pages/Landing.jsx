import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-primary-light px-6 text-center">
      <h1 className="text-5xl font-bold text-primary-dark">Communa</h1>
      <p className="mt-4 max-w-md text-gray-600">
        Your society's own marketplace — discover and connect with neighbors offering food,
        clothing, essentials, services and tuitions.
      </p>
      <Link
        to="/login"
        className="mt-8 rounded-lg bg-primary px-8 py-3 font-semibold text-white shadow-sm transition hover:bg-primary-dark"
      >
        Enter Community
      </Link>
    </div>
  );
}
