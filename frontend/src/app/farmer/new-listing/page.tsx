'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { cropAPI } from '@/services/api';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Select from '@/components/Select';
import TextArea from '@/components/TextArea';
import Link from 'next/link';

export default function NewListingPage() {
  const router = useRouter();
  const { user, token, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    cropName: '',
    category: '',
    quantity: '',
    unit: 'Qt',
    basePrice: '',
    location: '',
    description: '',
    imageUrl: '',
  });

  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'farmer') {
      router.push('/auth/login');
    }
  }, [isAuthenticated, user, router]);

  const categories = [
    'Cereals',
    'Pulses',
    'Oilseeds',
    'Cotton',
    'Sugarcane',
    'Spices',
    'Vegetables',
    'Fruits',
  ];

  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.cropName.trim()) newErrors.cropName = 'Crop name is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.quantity) newErrors.quantity = 'Quantity is required';
    if (parseFloat(formData.quantity) <= 0) newErrors.quantity = 'Quantity must be greater than 0';
    if (!formData.basePrice) newErrors.basePrice = 'Base price is required';
    if (parseFloat(formData.basePrice) <= 0) newErrors.basePrice = 'Price must be greater than 0';
    if (!formData.location.trim()) newErrors.location = 'Location is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev: any) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setApiError('');
    setSuccess('');

    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await cropAPI.createCrop(
        {
          cropName: formData.cropName.trim(),
          category: formData.category,
          quantity: parseFloat(formData.quantity),
          unit: formData.unit,
          basePrice: parseFloat(formData.basePrice),
          location: formData.location.trim(),
          description: formData.description.trim(),
          imageUrl: formData.imageUrl || 'https://via.placeholder.com/300x200?text=Crop',
        },
        token!
      );

      if (response.success) {
        setSuccess('Crop listed successfully!');
        setTimeout(() => {
          router.push('/farmer/my-crops');
        }, 1500);
      }
    } catch (error: any) {
      setApiError(error.message || 'Failed to list crop. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">List New Crop</h1>
          <p className="text-gray-600">Fill in the details to list your crop on the marketplace</p>
        </div>

        {apiError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {apiError}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Crop Name"
            name="cropName"
            placeholder="e.g., Wheat, Rice, Cotton"
            value={formData.cropName}
            onChange={handleChange}
            error={errors.cropName}
            required
          />

          <Select
            label="Category"
            name="category"
            options={categories.map(cat => ({ label: cat, value: cat }))}
            value={formData.category}
            onChange={handleChange}
            error={errors.category}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Quantity"
              name="quantity"
              type="number"
              placeholder="e.g., 50"
              value={formData.quantity}
              onChange={handleChange}
              error={errors.quantity}
              required
            />
            <Select
              label="Unit"
              name="unit"
              options={[
                { label: 'Quintal (Qt)', value: 'Qt' },
                { label: 'Kilogram (Kg)', value: 'Kg' },
                { label: 'Ton', value: 'Ton' },
                { label: 'Bag', value: 'Bag' },
              ]}
              value={formData.unit}
              onChange={handleChange}
            />
          </div>

          <Input
            label="Base Price (₹ per Qt)"
            name="basePrice"
            type="number"
            placeholder="e.g., 1200"
            value={formData.basePrice}
            onChange={handleChange}
            error={errors.basePrice}
            required
          />

          <Input
            label="Location"
            name="location"
            placeholder="e.g., Punjab, Ludhiana"
            value={formData.location}
            onChange={handleChange}
            error={errors.location}
            required
          />

          <Input
            label="Image URL (Optional)"
            name="imageUrl"
            type="url"
            placeholder="https://example.com/image.jpg"
            value={formData.imageUrl}
            onChange={handleChange}
          />

          <TextArea
            label="Description (Optional)"
            name="description"
            placeholder="Add any additional details about your crop..."
            value={formData.description}
            onChange={handleChange}
            rows={4}
          />

          <div className="pt-4 flex gap-4">
            <Button
              type="submit"
              label={loading ? 'Listing...' : 'List Crop'}
              disabled={loading}
              className="flex-1"
            />
            <Link href="/farmer/dashboard" className="flex-1">
              <Button label="Cancel" variant="outline" className="w-full" />
            </Link>
          </div>
        </form>

        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900">
            <span className="font-semibold">💡 Tip:</span> Your crop will be automatically graded using AI
            after listing. The grade will help buyers decide bidding value.
          </p>
        </div>
      </div>
    </div>
  );
}
