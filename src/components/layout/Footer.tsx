
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">D</span>
              </div>
              <span className="text-xl font-bold text-white">Dapper</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              Sustainable fashion marketplace connecting cities through pre-owned clothing. 
              Join our community to buy, sell, and donate fashion items with purpose.
            </p>
            <div className="flex space-x-4">
              <span className="text-sm">Available in:</span>
              <div className="flex space-x-2 text-sm text-green-400">
                <span>Delhi</span>
                <span>•</span>
                <span>Bengaluru</span>
                <span>•</span>
                <span>Dehradun</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/buy" className="hover:text-green-400 transition-colors">Buy Items</Link></li>
              <li><Link to="/sell" className="hover:text-green-400 transition-colors">Sell Items</Link></li>
              <li><Link to="/donate" className="hover:text-green-400 transition-colors">Donate</Link></li>
              <li><Link to="/about" className="hover:text-green-400 transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-green-400 transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-green-400 transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-green-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-green-400 transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Dapper. All rights reserved. Making fashion sustainable, one city at a time.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
