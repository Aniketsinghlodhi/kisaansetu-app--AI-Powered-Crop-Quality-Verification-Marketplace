"use client";

import Link from 'next/link';
import Button from '@/components/Button';

export default function Home() {
  return (
    <div className="w-full bg-gradient-to-b from-emerald-50 via-amber-50 to-lime-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-700 via-green-600 to-lime-600 text-white py-32 px-4 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-white opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-white opacity-5 rounded-full blur-3xl"></div>
        
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="text-8xl mb-6 drop-shadow-lg">🌾</div>
          <h1 className="text-6xl md:text-7xl font-black mb-4 leading-tight tracking-tight drop-shadow-lg">KisaanSetu</h1>
          <p className="text-xl md:text-2xl mb-10 text-emerald-50 max-w-3xl mx-auto font-medium leading-relaxed drop-shadow-md">Empowering Farmers, Connecting Buyers with AI-Verified Quality</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup?role=farmer">
              <Button label="🚜 Sign Up as Farmer" variant="secondary" size="lg" className="w-full sm:w-auto" />
            </Link>
            <Link href="/auth/signup?role=buyer">
              <Button label="🛒 Sign Up as Buyer" variant="outline" size="lg" className="w-full sm:w-auto" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-emerald-900 mb-4">Why Choose KisaanSetu?</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-emerald-500 to-lime-500 mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '🤖', title: 'AI Crop Grading', description: 'Instant quality verification using machine learning' },
              { icon: '🏪', title: 'Real Marketplace', description: 'Direct access to buyers and sellers nationwide' },
              { icon: '🤝', title: 'Fair Bidding', description: 'Transparent auction system without middlemen' },
              { icon: '🔒', title: 'Secure Payments', description: 'Protected transactions with verified users' },
            ].map((feature, idx) => (
              <div key={idx} className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl hover:scale-105 transition-all duration-300 text-center border-2 border-emerald-100 hover:border-emerald-400">
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
                <h3 className="font-bold text-xl mb-3 text-emerald-900">{feature.title}</h3>
                <p className="text-slate-700 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-emerald-700 to-lime-600 py-16 px-4 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold mb-4">Ready to Transform Agriculture?</h3>
          <p className="text-emerald-50 mb-8 text-lg">Join thousands of farmers and buyers using KisaanSetu for fair, transparent crop trading</p>
          <Link href="/auth/signup?role=farmer">
            <Button label="Get Started Today" variant="secondary" size="lg" />
          </Link>
        </div>
      </section>
    </div>
  );
}
