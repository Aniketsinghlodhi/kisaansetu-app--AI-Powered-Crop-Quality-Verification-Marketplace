'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authAPI } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Select from '@/components/Select';
import Link from 'next/link';

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isAuthenticated } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: searchParams.get('role') || 'farmer',
    location: '',
  });

  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.mobile.trim()) newErrors.mobile = 'Mobile number is required';
    if (!/^\d{10}$/.test(formData.mobile)) newErrors.mobile = 'Mobile must be 10 digits';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
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

    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await authAPI.signup({
        name: formData.name.trim(),
        mobile: formData.mobile.trim(),
        email: formData.email?.trim() || undefined,
        password: formData.password,
        role: formData.role,
        location: formData.location.trim(),
      });

      if (response.success) {
        login(response.token, response.user);
        router.push(formData.role === 'farmer' ? '/farmer/dashboard' : '/buyer/marketplace');
      }
    } catch (error: any) {
      setApiError(error.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const locations = ['Punjab', 'Haryana', 'Uttar Pradesh', 'Madhya Pradesh', 'Gujarat', 'Karnataka', 'Maharashtra', 'Bihar'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl mb-2">🌾</h1>
          <h2 className="text-2xl font-bold text-gray-800">Sign Up</h2>
          <p className="text-gray-600 mt-2">
            Join KisaanSetu as a {formData.role === 'farmer' ? 'Farmer' : 'Buyer'}
          </p>
        </div>

        {apiError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            required
          />

          <Input
            label="Mobile Number"
            name="mobile"
            type="tel"
            placeholder="10-digit mobile number"
            value={formData.mobile}
            onChange={handleChange}
            error={errors.mobile}
            required
          />

          <Input
            label="Email (Optional)"
            name="email"
            type="email"
            placeholder="your@email.com"
            value={formData.email}
            onChange={handleChange}
          />

          <Select
            label="Location"
            name="location"
            options={locations.map(loc => ({ label: loc, value: loc }))}
            value={formData.location}
            onChange={handleChange}
            error={errors.location}
            required
          />

          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="At least 6 characters"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            required
          />

          <Input
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            required
          />

          <Button
            type="submit"
            label={loading ? 'Creating account...' : 'Sign Up'}
            disabled={loading}
            className="w-full"
          />
        </form>

        <p className="text-center mt-6 text-gray-600">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-green-600 font-semibold hover:underline">
            Login here
          </Link>
        </p>

        <div className="mt-6 pt-6 border-t">
          <p className="text-center text-sm text-gray-600 mb-3">Want to switch role?</p>
          <div className="flex gap-2">
            <Link href="/auth/signup?role=farmer" className="flex-1">
              <Button
                label="Sign up as Farmer"
                variant={formData.role === 'farmer' ? 'primary' : 'outline'}
                size="sm"
                className="w-full"
                disabled={formData.role === 'farmer'}
              />
            </Link>
            <Link href="/auth/signup?role=buyer" className="flex-1">
              <Button
                label="Sign up as Buyer"
                variant={formData.role === 'buyer' ? 'primary' : 'outline'}
                size="sm"
                className="w-full"
                disabled={formData.role === 'buyer'}
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
