'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { cropAPI } from '@/services/api';
import Button from '@/components/Button';
import Link from 'next/link';

export default function FarmerDashboard() {
  const router = useRouter();
  const { user, token, isAuthenticated } = useAuth();
  const [crops, setCrops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'farmer') {
      router.push('/auth/login');
    }
  }, [isAuthenticated, user, router]);

  useEffect(() => {
    if (token && user?.role === 'farmer') {
      loadCrops();
    }
  }, [token, user]);

  const loadCrops = async () => {
    try {
      setLoading(true);
      const response = await cropAPI.getFarmerCrops(token!);
      setCrops(response.crops || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const activeCrops = crops.filter(c => c.status === 'active');
  const totalBids = crops.reduce((sum, c) => sum + c.bidCount, 0);
  const currentHighest = Math.max(...crops.map(c => c.currentBid), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Welcome back, {user?.name}! 🌾
          </h1>
          <p className="text-gray-600">Manage your crop listings and bids here</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Active Listings', value: activeCrops.length, icon: '📋' },
            { label: 'Total Bids Received', value: totalBids, icon: '🤝' },
            { label: 'Highest Bid', value: `₹${currentHighest}`, icon: '💰' },
            { label: 'Wallet Balance', value: `₹${user?.walletBalance}`, icon: '💳' },
          ].map((stat, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
              <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
              <div className="flex items-center justify-between">
                <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                <span className="text-4xl">{stat.icon}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <div className="mb-12">
          <Link href="/farmer/new-listing">
            <Button label="+ List New Crop" variant="primary" size="lg" />
          </Link>
        </div>

        {/* My Crops Section */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">My Crop Listings</h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading your crops...</p>
            </div>
          ) : crops.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No crops listed yet</p>
              <Link href="/farmer/new-listing">
                <Button label="List Your First Crop" variant="primary" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {crops.map((crop) => (
                <div
                  key={crop._id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-bold text-gray-800">{crop.cropName}</h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        crop.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : crop.status === 'sold'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {crop.status.charAt(0).toUpperCase() + crop.status.slice(1)}
                    </span>
                  </div>

                  <p className="text-gray-600 mb-2">{crop.category}</p>

                  <div className="bg-gray-50 p-3 rounded-lg mb-4 space-y-1 text-sm">
                    <p>
                      <span className="font-semibold">Grade:</span> {crop.aiGrade} (Score:{' '}
                      {crop.qualityScore}%)
                    </p>
                    <p>
                      <span className="font-semibold">Qty:</span> {crop.quantity} {crop.unit}
                    </p>
                    <p>
                      <span className="font-semibold">Base Price:</span> ₹{crop.basePrice}/Qt
                    </p>
                    {crop.currentBid > 0 && (
                      <p>
                        <span className="font-semibold">Current Bid:</span> ₹{crop.currentBid}
                      </p>
                    )}
                    <p>
                      <span className="font-semibold">Bids:</span> {crop.bidCount}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Link href={`/crop/${crop._id}`} className="flex-1">
                      <Button label="View" variant="outline" size="sm" className="w-full" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
