'use client';

import Image from 'next/image';
import Button from './Button';
import { useRouter } from 'next/navigation';

interface CropCardProps {
  crop: any;
  onPlaceBid?: () => void;
  variant?: 'marketplace' | 'farmer';
}

export default function CropCard({ crop, onPlaceBid, variant = 'marketplace' }: CropCardProps) {
  const router = useRouter();

  const handleViewDetails = () => {
    router.push(`/crop/${crop._id}`);
  };

  // Generate crop-specific placeholder images based on category
  const cropImages: { [key: string]: string } = {
    'Cereals': 'https://images.unsplash.com/photo-1625246333333-5f8c3d1e68f6?w=500&h=300&fit=crop',
    'Pulses': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&h=300&fit=crop',
    'Oilseeds': 'https://images.unsplash.com/photo-1574943320219-553eb2f72885?w=500&h=300&fit=crop',
    'Cotton': 'https://images.unsplash.com/photo-1625246333333-5f8c3d1e68f6?w=500&h=300&fit=crop',
    'Sugarcane': 'https://images.unsplash.com/photo-1600965962885-6e2a4a53cca2?w=500&h=300&fit=crop',
    'Spices': 'https://images.unsplash.com/photo-1596040707264-96b16ee8c5c2?w=500&h=300&fit=crop',
    'Vegetables': 'https://images.unsplash.com/photo-1464226184081-280282a34f6d?w=500&h=300&fit=crop',
    'Fruits': 'https://images.unsplash.com/photo-1610459286039-f45d3f7d8f3b?w=500&h=300&fit=crop',
  };

  const getGradeColor = (grade: string) => {
    const colors: { [key: string]: string } = {
      'A': 'from-green-500 to-emerald-600',
      'B': 'from-amber-500 to-orange-500',
      'C': 'from-orange-500 to-red-500',
    };
    return colors[grade] || 'from-blue-500 to-blue-600';
  };

  const imageUrl = crop.imageUrl || cropImages[crop.category] || 'https://via.placeholder.com/500x300?text=Crop+Image';

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden border border-emerald-100 hover:border-emerald-400">
      {/* Image Container */}
      <div className="relative w-full h-56 bg-gradient-to-br from-emerald-100 to-lime-100 overflow-hidden">
        <img
          src={imageUrl}
          alt={crop.cropName}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/500x300?text=Crop';
          }}
        />
        {/* Grade Badge */}
        <div className={`absolute top-3 right-3 bg-gradient-to-r ${getGradeColor(crop.aiGrade)} text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg`}>
          Grade {crop.aiGrade}
        </div>
        {/* Quality Score Badge */}
        {crop.qualityScore && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
            Quality: {crop.qualityScore}%
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="p-5">
        {/* Crop Name */}
        <h3 className="text-xl font-bold text-emerald-900 mb-3 truncate">{crop.cropName}</h3>

        {/* Details Grid */}
        <div className="mb-4 space-y-2 text-sm">
          <p className="text-slate-700">
            <span className="font-semibold text-emerald-700">👨‍🌾 Farmer:</span> <span className="text-slate-900">{crop.farmerId?.name || 'Unknown'}</span>
          </p>
          <p className="text-slate-700">
            <span className="font-semibold text-emerald-700">📍 Location:</span> <span className="text-slate-900">{crop.location}</span>
          </p>
          <p className="text-slate-700">
            <span className="font-semibold text-emerald-700">📦 Quantity:</span> <span className="text-slate-900">{crop.quantity} {crop.unit}</span>
          </p>
        </div>

        {/* Price Section */}
        <div className="bg-gradient-to-r from-emerald-50 to-lime-50 p-4 rounded-xl mb-4 border-2 border-emerald-200">
          <p className="text-sm text-slate-700 mb-2">
            <span className="font-bold text-slate-900">Base Price:</span> <span className="text-2xl font-bold text-emerald-700">₹{crop.basePrice}</span><span className="text-slate-600">/Qt</span>
          </p>
          {crop.currentBid > 0 && (
            <p className="text-sm text-slate-700 mb-1">
              <span className="font-bold text-slate-900">Current Bid:</span> <span className="text-lg font-bold text-blue-600">₹{crop.currentBid}</span>
            </p>
          )}
          {crop.bidCount > 0 && (
            <p className="text-xs text-slate-600 font-medium">
              💰 {crop.bidCount} bid{crop.bidCount !== 1 ? 's' : ''} placed
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            label="View Details"
            onClick={handleViewDetails}
            variant="outline"
            size="sm"
            className="flex-1"
          />
          {variant === 'marketplace' && onPlaceBid && (
            <Button
              label="Place Bid"
              onClick={onPlaceBid}
              variant="primary"
              size="sm"
              className="flex-1"
            />
          )}
        </div>
      </div>
    </div>
  );
}
