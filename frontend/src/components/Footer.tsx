'use client';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <span className="text-2xl">🌾</span>
              KisaanSetu
            </h3>
            <p className="text-sm">Empowering farmers with AI-verified crop quality marketplace.</p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">For Farmers</h4>
            <ul className="text-sm space-y-2">
              <li><a href="#" className="hover:text-white transition">List Crops</a></li>
              <li><a href="#" className="hover:text-white transition">Track Bids</a></li>
              <li><a href="#" className="hover:text-white transition">My Earnings</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">For Buyers</h4>
            <ul className="text-sm space-y-2">
              <li><a href="#" className="hover:text-white transition">Browse Crops</a></li>
              <li><a href="#" className="hover:text-white transition">Place Bids</a></li>
              <li><a href="#" className="hover:text-white transition">My Purchases</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="text-sm space-y-2">
              <li><a href="#" className="hover:text-white transition">About</a></li>
              <li><a href="#" className="hover:text-white transition">Contact</a></li>
              <li><a href="#" className="hover:text-white transition">Privacy</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8">
          <p className="text-center text-sm">
            © 2025 KisaanSetu-App. All rights reserved. Made with ❤️ for Indian Farmers.
          </p>
        </div>
      </div>
    </footer>
  );
}
