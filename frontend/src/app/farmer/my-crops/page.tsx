'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { cropAPI } from '@/services/api';
import CropCard from '@/components/CropCard';
import Button from '@/components/Button';
import Link from 'next/link';

export default function MycropsPage() {
  const router = useRouter();
  const { user, token, isAuthenticated } = useAuth();
  const [crops, setCrops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filteredCrops, setFilteredCrops] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');

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

  useEffect(() => {
    let filtered = crops;
    if (statusFilter !== 'all') {
      filtered = crops.filter(c => c.status === statusFilter);
    }
    setFilteredCrops(filtered);
  }, [crops, statusFilter]);

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

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">My Crop Listings</h1>
          <p className="text-gray-600">Manage and track all your crop listings</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Filter Buttons */}
        <div className="flex gap-4 mb-8 flex-wrap">
          {[
            { label: 'All', value: 'all' },
            { label: 'Active', value: 'active' },
            { label: 'Sold', value: 'sold' },
            { label: 'Expired', value: 'expired' },
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
            <p className="text-gray-600">Loading your crops...</p>
          </div>
        ) : filteredCrops.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-600 mb-4">
              {crops.length === 0 ? 'No crops listed yet' : 'No crops match the filter'}
            </p>
            <Link href="/farmer/new-listing">
              <Button label="List Your First Crop" variant="primary" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCrops.map(crop => (
              <CropCard key={crop._id} crop={crop} variant="farmer" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
