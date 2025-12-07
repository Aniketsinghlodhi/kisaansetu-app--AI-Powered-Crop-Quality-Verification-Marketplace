'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { bidAPI } from '@/services/api';
import Button from '@/components/Button';
import Link from 'next/link';

export default function MyBidsPage() {
  const router = useRouter();
  const { user, token, isAuthenticated } = useAuth();
  const [bids, setBids] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filteredBids, setFilteredBids] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'buyer') {
      router.push('/auth/login');
    }
  }, [isAuthenticated, user, router]);

  useEffect(() => {
    if (token && user?.role === 'buyer') {
      loadBids();
    }
  }, [token, user]);

  useEffect(() => {
    let filtered = bids;
    if (statusFilter !== 'all') {
      filtered = bids.filter(b => b.status === statusFilter);
    }
    setFilteredBids(filtered);
  }, [bids, statusFilter]);

  const loadBids = async () => {
    try {
      setLoading(true);
      const response = await bidAPI.getMyBids(token!);
      setBids(response.bids || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const wonBidsCount = bids.filter(b => b.status === 'won').length;
  const activeBidsCount = bids.filter(b => b.status === 'active').length;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">My Bids</h1>
          <p className="text-gray-600">Track and manage your bids</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { label: 'Total Bids', value: bids.length, icon: '📊' },
            { label: 'Active Bids', value: activeBidsCount, icon: '🔄' },
            { label: 'Won Auctions', value: wonBidsCount, icon: '🏆' },
          ].map((stat, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
              <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
              <div className="flex items-center justify-between">
                <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                <span className="text-4xl">{stat.icon}</span>
              </div>
            </div>
          ))}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="flex gap-4 mb-8 flex-wrap">
          {[
            { label: 'All', value: 'all' },
            { label: 'Active', value: 'active' },
            { label: 'Won', value: 'won' },
            { label: 'Lost', value: 'lost' },
          ].map(filter => (
            <Button
              key={filter.value}
              label={filter.label}
              variant={statusFilter === filter.value ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter(filter.value)}
            />
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading your bids...</p>
          </div>
        ) : filteredBids.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-600 mb-4">
              {bids.length === 0 ? 'No bids placed yet' : 'No bids match the filter'}
            </p>
            <Link href="/buyer/marketplace">
              <Button label="Browse Marketplace" variant="primary" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBids.map(bid => (
              <div key={bid._id} className="bg-white rounded-lg shadow-md p-6 flex justify-between items-center">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {bid.cropId?.cropName}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">
                    Category: <span className="font-semibold">{bid.cropId?.category}</span>
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Your Bid</p>
                      <p className="text-lg font-bold text-blue-600">₹{bid.bidAmount}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Base Price</p>
                      <p className="text-lg font-bold">₹{bid.cropId?.basePrice}/Qt</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Current Bid</p>
                      <p className="text-lg font-bold">₹{bid.cropId?.currentBid}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Grade</p>
                      <p className="text-lg font-bold text-green-600">{bid.cropId?.aiGrade}</p>
                    </div>
                  </div>
                </div>
                <div className="ml-4 text-right">
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      bid.status === 'active'
                        ? 'bg-blue-100 text-blue-800'
                        : bid.status === 'won'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
                  </span>
                  <div className="mt-4">
                    <Link href={`/crop/${bid.cropId?._id}`}>
                      <Button label="View Details" variant="outline" size="sm" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
