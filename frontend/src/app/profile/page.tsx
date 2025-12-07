'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/Button';
import Link from 'next/link';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, router]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Profile</h1>
          <p className="text-gray-600">Your account information</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="md:col-span-1">
              <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
                <div className="text-6xl text-center mb-4">👤</div>
                <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">{user.name}</h2>
                <p className="text-gray-600 text-center text-sm mb-4">
                  {user.role === 'farmer' ? '🌾 Farmer' : '🛒 Buyer'}
                </p>
                {user.rating > 0 && (
                  <div className="text-center mb-4">
                    <p className="text-yellow-500 text-xl">{'⭐'.repeat(Math.min(user.rating, 5))}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Information */}
            <div className="md:col-span-2">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Account Information</h3>

              <div className="space-y-6">
                {[
                  { label: 'Name', value: user.name },
                  { label: 'Mobile', value: user.mobile },
                  { label: 'Email', value: user.email || 'Not provided' },
                  { label: 'Role', value: user.role === 'farmer' ? 'Farmer' : 'Buyer' },
                  { label: 'Location', value: user.location },
                  { label: 'Wallet Balance', value: `₹${user.walletBalance}` },
                  { label: 'Rating', value: `${user.rating}/5` || 'No rating yet' },
                  { label: 'Member Since', value: new Date(user.createdAt).toLocaleDateString() },
                ].map((item, idx) => (
                  <div key={idx} className="border-b border-gray-200 pb-4">
                    <p className="text-gray-600 text-sm mb-1">{item.label}</p>
                    <p className="text-lg font-semibold text-gray-800">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t">
                <Link href={user.role === 'farmer' ? '/farmer/dashboard' : '/buyer/marketplace'}>
                  <Button
                    label={user.role === 'farmer' ? 'Go to Dashboard' : 'Go to Marketplace'}
                    variant="primary"
                    className="mr-4"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
