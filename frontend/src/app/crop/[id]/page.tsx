'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { cropAPI, bidAPI } from '@/services/api';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Link from 'next/link';

export default function CropDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, token, isAuthenticated } = useAuth();
  const cropId = params.id as string;

  const [crop, setCrop] = useState<any>(null);
  const [bids, setBids] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bidAmount, setBidAmount] = useState('');
  const [bidError, setBidError] = useState('');
  const [bidLoading, setBidLoading] = useState(false);
  const [bidSuccess, setBidSuccess] = useState('');

  useEffect(() => {
    loadCropDetails();
  }, [cropId]);

  const loadCropDetails = async () => {
    try {
      setLoading(true);
      const [cropRes, bidsRes] = await Promise.all([
        cropAPI.getCropById(cropId),
        bidAPI.getBidsForCrop(cropId),
      ]);
      setCrop(cropRes.crop);
      setBids(bidsRes.bids || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceBid = async () => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    if (user?.role !== 'buyer') {
      alert('Only buyers can place bids');
      return;
    }

    setBidError('');
    setBidSuccess('');

    if (!bidAmount) {
      setBidError('Please enter a bid amount');
      return;
    }

    const minBid = crop.currentBid > 0 ? crop.currentBid + 1 : crop.basePrice;

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
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          cropId,
          bidAmount: parseFloat(bidAmount),
        }),
      });

      const data = await response.json();
      if (data.success) {
        setBidSuccess('Bid placed successfully!');
        setBidAmount('');
        loadCropDetails();
      } else {
        setBidError(data.message);
      }
    } catch (err: any) {
      setBidError(err.message);
    } finally {
      setBidLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading crop details...</p>
      </div>
    );
  }

  if (error || !crop) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-red-600 mb-4">{error || 'Crop not found'}</p>
          <Link href="/">
            <Button label="Go Home" variant="primary" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <Link href="/">
          <Button label="← Back" variant="outline" size="sm" className="mb-8" />
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Side - Crop Image & Info */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-8">
              {/* Image */}
              <div className="mb-6 h-96 bg-gray-200 rounded-lg overflow-hidden">
                <img
                  src={crop.imageUrl || 'https://via.placeholder.com/600x400?text=Crop'}
                  alt={crop.cropName}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Details */}
              <div className="mb-8">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">{crop.cropName}</h1>
                    <p className="text-gray-600 text-lg">{crop.category}</p>
                  </div>
                  <span className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-full text-lg font-bold">
                    Grade {crop.aiGrade}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {[
                    { label: 'Quantity', value: `${crop.quantity} ${crop.unit}` },
                    { label: 'Location', value: crop.location },
                    { label: 'Quality Score', value: `${crop.qualityScore}%` },
                    { label: 'Total Bids', value: crop.bidCount },
                  ].map((item, idx) => (
                    <div key={idx} className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">{item.label}</p>
                      <p className="text-lg font-bold text-gray-800">{item.value}</p>
                    </div>
                  ))}
                </div>

                {crop.description && (
                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-2">Description</h3>
                    <p className="text-gray-700">{crop.description}</p>
                  </div>
                )}
              </div>

              {/* Farmer Info */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-bold text-lg mb-4">Farmer Information</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Farmer Name</p>
                    <p className="text-xl font-bold text-gray-800">{crop.farmerId?.name}</p>
                    <p className="text-gray-600 mt-2">📍 {crop.farmerId?.location}</p>
                    {crop.farmerId?.rating > 0 && (
                      <p className="text-yellow-500 mt-2">{'⭐'.repeat(crop.farmerId?.rating)}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Bidding Section */}
          <div>
            <div className="bg-white rounded-lg shadow-lg p-8 sticky top-20">
              {/* Price Section */}
              <div className="bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-lg mb-6 border border-green-200">
                <p className="text-gray-600 text-sm mb-1">Base Price</p>
                <p className="text-3xl font-bold text-green-600 mb-4">₹{crop.basePrice}/Qt</p>

                {crop.currentBid > 0 ? (
                  <>
                    <p className="text-gray-600 text-sm mb-1">Current Highest Bid</p>
                    <p className="text-2xl font-bold text-blue-600">₹{crop.currentBid}</p>
                  </>
                ) : (
                  <p className="text-gray-600 italic">No bids yet. Be the first!</p>
                )}
              </div>

              {/* Bid Form */}
              {crop.status === 'active' && (
                <div className="mb-6">
                  <h3 className="font-bold text-lg mb-4">Place Your Bid</h3>

                  {bidError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                      {bidError}
                    </div>
                  )}

                  {bidSuccess && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
                      {bidSuccess}
                    </div>
                  )}

                  <Input
                    label="Bid Amount (₹)"
                    type="number"
                    placeholder={
                      crop.currentBid > 0
                        ? `Minimum: ₹${crop.currentBid + 1}`
                        : `Minimum: ₹${crop.basePrice}`
                    }
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                  />

                  <Button
                    type="button"
                    label={bidLoading ? 'Placing Bid...' : 'Place Bid'}
                    variant="primary"
                    className="w-full"
                    disabled={bidLoading || !bidAmount}
                    onClick={handlePlaceBid}
                  />

                  {!isAuthenticated && (
                    <p className="text-center text-sm text-gray-600 mt-4">
                      <Link href="/auth/login" className="text-blue-600 hover:underline">
                        Login
                      </Link>
                      {' '}to place a bid
                    </p>
                  )}

                  {isAuthenticated && user?.role === 'farmer' && (
                    <p className="text-center text-sm text-gray-600 mt-4">
                      Farmers cannot place bids. Switch to buyer account.
                    </p>
                  )}
                </div>
              )}

              {crop.status !== 'active' && (
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg mb-4 text-center">
                  Bidding is closed for this crop.
                </div>
              )}

              {/* Bid History */}
              <div>
                <h3 className="font-bold text-lg mb-4">Bid History ({bids.length})</h3>
                {bids.length === 0 ? (
                  <p className="text-gray-600 text-sm text-center py-4">No bids yet</p>
                ) : (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {bids.slice(0, 10).map((bid, idx) => (
                      <div key={bid._id} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-semibold text-gray-800">₹{bid.bidAmount}</p>
                            <p className="text-xs text-gray-600">{idx === 0 ? 'Highest bid' : ''}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-gray-700">{bid.buyerId?.name}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(bid.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
