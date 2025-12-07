'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { cropAPI } from '@/services/api';
import CropCard from '@/components/CropCard';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Select from '@/components/Select';
import Link from 'next/link';

export default function MarketplacePage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [crops, setCrops] = useState<any[]>([]);
  const [filteredCrops, setFilteredCrops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [filters, setFilters] = useState({
    search: '',
    category: 'All',
    priceRange: '',
    location: 'All',
  });

  const [selectedCropForBid, setSelectedCropForBid] = useState<any>(null);
  const [bidAmount, setBidAmount] = useState('');
  const [bidError, setBidError] = useState('');
  const [bidLoading, setBidLoading] = useState(false);

  const categories = ['All', 'Cereals', 'Pulses', 'Oilseeds', 'Cotton', 'Sugarcane', 'Spices', 'Vegetables', 'Fruits'];
  const locations = ['All', 'Punjab', 'Haryana', 'Uttar Pradesh', 'Madhya Pradesh', 'Gujarat', 'Karnataka', 'Maharashtra'];

  useEffect(() => {
    loadCrops();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [crops, filters]);

  const loadCrops = async () => {
    try {
      setLoading(true);
      const response = await cropAPI.getCrops({ status: 'active' });
      setCrops(response.crops || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = crops;

    if (filters.search) {
      filtered = filtered.filter(c =>
        c.cropName.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.category !== 'All') {
      filtered = filtered.filter(c => c.category === filters.category);
    }

    if (filters.location !== 'All') {
      filtered = filtered.filter(c =>
        c.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    setFilteredCrops(filtered);
  };

  const handleFilterChange = (e: any) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const openBidModal = (crop: any) => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    if (user?.role !== 'buyer') {
      alert('Only buyers can place bids');
      return;
    }
    setSelectedCropForBid(crop);
    setBidAmount('');
    setBidError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-amber-50 to-lime-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-emerald-900">Crop Marketplace</h1>
              <p className="text-slate-700 mt-2 text-lg">Discover premium crops from verified farmers</p>
            </div>
            <Link href="/buyer/my-bids">
              <Button label="View My Bids" variant="secondary" size="lg" />
            </Link>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border-2 border-red-400 text-red-800 px-5 py-4 rounded-xl mb-6 font-semibold">
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8 border-2 border-emerald-100">
          <h3 className="font-bold text-xl text-emerald-900 mb-5">🔍 Filter Crops</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              label="Search Crop"
              name="search"
              placeholder="Search by crop name"
              value={filters.search}
              onChange={handleFilterChange}
            />
            <Select
              label="Category"
              name="category"
              options={categories.map(cat => ({ label: cat, value: cat }))}
              value={filters.category}
              onChange={handleFilterChange}
            />
            <Select
              label="Location"
              name="location"
              options={locations.map(loc => ({ label: loc, value: loc }))}
              value={filters.location}
              onChange={handleFilterChange}
            />
            <div className="flex items-end">
              <Button
                label="Reset Filters"
                variant="outline"
                size="md"
                onClick={() => setFilters({ search: '', category: 'All', priceRange: '', location: 'All' })}
              />
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-16">
            <p className="text-slate-700 text-lg font-semibold">⏳ Loading premium crops...</p>
          </div>
        ) : filteredCrops.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border-2 border-emerald-100">
            <p className="text-slate-700 text-lg font-semibold">🌾 No crops available matching your filters</p>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold text-emerald-900 mb-6">Available Crops ({filteredCrops.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCrops.map(crop => (
                <CropCard
                  key={crop._id}
                  crop={crop}
                  variant="marketplace"
                  onPlaceBid={() => openBidModal(crop)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bid Modal */}
      {selectedCropForBid && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl border-2 border-emerald-200">
            <h2 className="text-3xl font-black text-emerald-900 mb-6">💰 Place Your Bid</h2>
            <p className="text-slate-700 text-sm mb-4">Crop: <span className="font-bold text-emerald-700">{selectedCropForBid.cropName}</span></p>

            {bidError && (
              <div className="bg-red-100 border-2 border-red-400 text-red-800 px-4 py-3 rounded-xl mb-5 font-semibold">
                {bidError}
              </div>
            )}

            <div className="bg-gradient-to-r from-emerald-50 to-lime-50 p-5 rounded-xl mb-6 border-2 border-emerald-200">
              <p className="text-sm text-slate-700 mb-1">📍 Base Price</p>
              <p className="text-3xl font-black text-emerald-700">₹{selectedCropForBid.basePrice}/Qt</p>
              <p className="text-sm text-slate-700 mt-3 mb-1">Current Highest Bid</p>
              <p className="text-2xl font-bold text-blue-600">{selectedCropForBid.currentBid > 0 ? `₹${selectedCropForBid.currentBid}` : 'No bids yet'}</p>
              <p className="text-xs text-slate-600 mt-2">💬 {selectedCropForBid.bidCount} bid{selectedCropForBid.bidCount !== 1 ? 's' : ''} placed</p>
            </div>

            <Input
              label="Your Bid Amount (₹)"
              type="number"
              placeholder={
                selectedCropForBid.currentBid > 0
                  ? `Minimum: ₹${selectedCropForBid.currentBid + 1}`
                  : `Minimum: ₹${selectedCropForBid.basePrice}`
              }
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              error={bidError}
            />

            <div className="flex gap-3">
              <Button
                type="button"
                label="Cancel"
                variant="outline"
                className="flex-1"
                onClick={() => setSelectedCropForBid(null)}
              />
              <Button
                type="button"
                label={bidLoading ? 'Placing...' : 'Place Bid'}
                variant="primary"
                className="flex-1"
                disabled={bidLoading || !bidAmount}
                onClick={async () => {
                  if (!bidAmount) {
                    setBidError('Please enter a bid amount');
                    return;
                  }

                  const minBid = selectedCropForBid.currentBid > 0
                    ? selectedCropForBid.currentBid + 1
                    : selectedCropForBid.basePrice;

                  if (parseFloat(bidAmount) < minBid) {
                    setBidError(`Bid must be at least ₹${minBid}`);
                    return;
                  }

                  setBidLoading(true);
                  try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bids`, {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                      },
                      body: JSON.stringify({
                        cropId: selectedCropForBid._id,
                        bidAmount: parseFloat(bidAmount),
                      }),
                    });

                    const data = await response.json();
                    if (data.success) {
                      alert('Bid placed successfully!');
                      setSelectedCropForBid(null);
                      loadCrops();
                    } else {
                      setBidError(data.message);
                    }
                  } catch (err: any) {
                    setBidError(err.message);
                  } finally {
                    setBidLoading(false);
                  }
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
