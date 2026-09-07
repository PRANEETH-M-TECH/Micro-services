import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      if (user.status === 'pending' || user.status === 'rejected') {
        navigate('/pending');
      } else if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/home');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-primary-darker via-primary-dark to-primary px-6">
      <div className="animate-float-orb pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />
      <div className="animate-float-orb-slow pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-mint/10 blur-3xl" />

      <div className="animate-card-in relative w-full max-w-sm rounded-xl border border-gray-200 bg-white p-8 shadow-xl">
        <div className="mb-5 flex justify-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
            <span className="text-lg font-bold text-mint">C</span>
          </div>
        </div>
        <h1 className="text-center text-2xl font-bold text-primary-dark">Welcome back</h1>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="email"
            required
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-primary focus:outline-none"
          />
          <input
            type="password"
            required
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-primary focus:outline-none"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-primary px-4 py-2.5 font-semibold text-white hover:bg-primary-dark disabled:opacity-50"
          >
            {loading ? 'Signing in…' : 'Log In'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-500">
          New here?{' '}
          <Link to="/register" className="font-medium text-primary">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
