'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <nav className="bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 font-bold text-2xl hover:text-green-100 transition">
          <span className="text-3xl">🌾</span>
          <span>KisaanSetu</span>
        </Link>

        <div className="flex items-center gap-6">
          {isAuthenticated && user ? (
            <>
              <Link href="/" className="hover:text-green-100 transition">Home</Link>
              {user.role === 'farmer' ? (
                <>
                  <Link href="/farmer/dashboard" className="hover:text-green-100 transition">Dashboard</Link>
                  <Link href="/farmer/my-crops" className="hover:text-green-100 transition">My Crops</Link>
                </>
              ) : (
                <>
                  <Link href="/buyer/marketplace" className="hover:text-green-100 transition">Marketplace</Link>
                  <Link href="/buyer/my-bids" className="hover:text-green-100 transition">My Bids</Link>
                </>
              )}
              <Link href="/profile" className="hover:text-green-100 transition">Profile</Link>
              <span className="text-sm bg-green-500 px-3 py-1 rounded-full">
                ₹{user.walletBalance}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/" className="hover:text-green-100 transition">Home</Link>
              <Link href="/auth/login" className="hover:text-green-100 transition">Login</Link>
              <Link href="/auth/signup" className="bg-white text-green-600 px-4 py-2 rounded-lg hover:bg-green-50 transition font-semibold">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
