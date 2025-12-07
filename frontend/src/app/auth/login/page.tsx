'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    mobile: '',
    password: '',
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

    if (!formData.mobile.trim()) newErrors.mobile = 'Mobile number is required';
    if (!/^\d{10}$/.test(formData.mobile)) newErrors.mobile = 'Mobile must be 10 digits';
    if (!formData.password) newErrors.password = 'Password is required';

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
      const response = await authAPI.login(formData.mobile.trim(), formData.password);

      if (response.success) {
        login(response.token, response.user);
        router.push(response.user.role === 'farmer' ? '/farmer/dashboard' : '/buyer/marketplace');
      }
    } catch (error: any) {
      setApiError(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl mb-2">🌾</h1>
          <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
          <p className="text-gray-600 mt-2">Login to KisaanSetu-App</p>
        </div>

        {apiError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
            label="Password"
            name="password"
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            required
          />

          <Button
            type="submit"
            label={loading ? 'Logging in...' : 'Login'}
            disabled={loading}
            className="w-full"
          />
        </form>

        <p className="text-center mt-6 text-gray-600">
          Don't have an account?{' '}
          <Link href="/auth/signup" className="text-green-600 font-semibold hover:underline">
            Sign up here
          </Link>
        </p>

        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm font-semibold text-blue-900 mb-2">Demo Credentials:</p>
          <p className="text-xs text-blue-800">
            Farmer: <span className="font-mono">9876543210</span> / <span className="font-mono">password123</span>
          </p>
          <p className="text-xs text-blue-800">
            Buyer: <span className="font-mono">9123456789</span> / <span className="font-mono">password123</span>
          </p>
        </div>
      </div>
    </div>
  );
}
