import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const initialForm = { name: '', flat_no: '', phone: '', email: '', password: '', role: 'consumer' };

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function update(field) {
    return (e) => setForm({ ...form, [field]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/pending');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-primary-darker via-primary-dark to-primary px-6 py-10">
      <div className="animate-float-orb pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />
      <div className="animate-float-orb-slow pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-mint/10 blur-3xl" />

      <div className="animate-card-in relative w-full max-w-sm rounded-xl border border-gray-200 bg-white p-8 shadow-xl">
        <div className="mb-5 flex justify-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
            <span className="text-lg font-bold text-mint">C</span>
          </div>
        </div>
        <h1 className="text-center text-2xl font-bold text-primary-dark">Join your society</h1>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            required
            placeholder="Full name"
            value={form.name}
            onChange={update('name')}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-primary focus:outline-none"
          />
          <input
            required
            placeholder="Flat number (e.g. B-101)"
            value={form.flat_no}
            onChange={update('flat_no')}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-primary focus:outline-none"
          />
          <input
            required
            placeholder="Phone number"
            value={form.phone}
            onChange={update('phone')}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-primary focus:outline-none"
          />
          <input
            type="email"
            required
            placeholder="Email"
            value={form.email}
            onChange={update('email')}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-primary focus:outline-none"
          />
          <input
            type="password"
            required
            minLength={6}
            placeholder="Password"
            value={form.password}
            onChange={update('password')}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-primary focus:outline-none"
          />

          <div className="flex gap-3">
            {['consumer', 'seller'].map((role) => (
              <label
                key={role}
                className={`flex-1 cursor-pointer rounded-lg border px-4 py-2.5 text-center text-sm font-medium capitalize ${
                  form.role === role ? 'border-primary bg-primary-light text-primary-dark' : 'border-gray-300 text-gray-600'
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value={role}
                  checked={form.role === role}
                  onChange={update('role')}
                  className="hidden"
                />
                {role}
              </label>
            ))}
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-primary px-4 py-2.5 font-semibold text-white hover:bg-primary-dark disabled:opacity-50"
          >
            {loading ? 'Creating account…' : 'Register'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-500">
          Already registered?{' '}
          <Link to="/login" className="font-medium text-primary">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
