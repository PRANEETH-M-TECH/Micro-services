import { useAuth } from '../context/AuthContext';

export default function PendingApproval() {
  const { user, logout } = useAuth();
  const rejected = user?.status === 'rejected';

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-6 text-center">
      <div className="max-w-sm rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <span className="text-4xl">{rejected ? '🚫' : '⏳'}</span>
        <h1 className="mt-4 text-xl font-bold text-gray-900">
          {rejected ? 'Registration not approved' : 'Awaiting admin approval'}
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          {rejected
            ? 'Your society admin did not approve this account. Contact them directly if you believe this is a mistake.'
            : "Your society admin needs to verify you belong to the community before you can browse or list on Communa. This usually doesn't take long — check back soon."}
        </p>
        <button
          onClick={logout}
          className="mt-6 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
        >
          Log out
        </button>
      </div>
    </div>
  );
}
