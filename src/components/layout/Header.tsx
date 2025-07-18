import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, User, Sun, Moon, Menu, X, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import NotificationBell from '@/components/notifications/NotificationBell';
import LocationButton from '@/components/LocationButton';

const countries = [
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'US', name: 'USA', flag: '🇺🇸' },
  { code: 'UK', name: 'UK', flag: '🇬🇧' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'UAE', name: 'UAE', flag: '🇦🇪' },
];

const Header = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut, location: currentLocation, setLocation } = useAuth();

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const isActive = (path: string) => location.pathname === path;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <>
      <header className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50 shadow-sm dark:shadow-2xl nav-dark transition-all duration-300">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <img
                src="/logo.png"
                alt="Dapper Logo"
                className="h-10 sm:h-12 md:h-14 lg:h-16 w-auto rounded-lg transition-all duration-200 block dark:hidden"
              />
              <img
                src="/logoDark.png"
                alt="Dapper Logo Dark"
                className="h-10 sm:h-12 md:h-14 lg:h-16 w-auto rounded-lg transition-all duration-200 hidden dark:block"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <Link 
                to="/" 
                className={`text-sm font-medium transition-all duration-200 hover:text-purple-600 dark:hover:text-purple-400 ${
                  isActive('/') ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400 pb-1' : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                Home
              </Link>
              <Link 
                to="/buy" 
                className={`text-sm font-medium transition-all duration-200 hover:text-purple-600 dark:hover:text-purple-400 ${
                  isActive('/buy') ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400 pb-1' : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                Shop
              </Link>
              <Link 
                to="/sell" 
                className={`text-sm font-medium transition-all duration-200 hover:text-purple-600 dark:hover:text-purple-400 ${
                  isActive('/sell') ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400 pb-1' : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                Sell
              </Link>
              <Link 
                to="/donate" 
                className={`text-sm font-medium transition-all duration-200 hover:text-purple-600 dark:hover:text-purple-400 ${
                  isActive('/donate') ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400 pb-1' : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                Donate
              </Link>
              <Link 
                to="/about" 
                className={`text-sm font-medium transition-all duration-200 hover:text-purple-600 dark:hover:text-purple-400 ${
                  isActive('/about') ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400 pb-1' : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                About
              </Link>
            </nav>

            {/* Right Section */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Location Display - Hidden on mobile */}
              <div className="hidden md:flex items-center">
                <LocationButton
                  country={currentLocation.country}
                  city={currentLocation.city}
                  onCountryChange={(country) => setLocation(prev => ({ ...prev, country: country }))}
                  onCityChange={(city) => setLocation(prev => ({ ...prev, city: city }))}
                />
              </div>

              {/* Notification Bell - Only show when authenticated */}
              {user && <NotificationBell />}

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-white dark:bg-gray-800 border shadow-lg dark:border-gray-700">
                  {user ? (
                    <>
                      <DropdownMenuItem className="dark:hover:bg-gray-700">
                        <Link to="/my-activity" className="w-full">My Activity</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="dark:hover:bg-gray-700">
                        <Link to="/sell" className="w-full">Seller Dashboard</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleSignOut} className="dark:hover:bg-gray-700">
                        Sign Out
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem onClick={() => navigate('/signin')} className="dark:hover:bg-gray-700">
                        Sign In
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/signup')} className="dark:hover:bg-gray-700">
                        Sign Up
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Dark Mode Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleDarkMode}
                className="p-2 hover:bg-purple-50 dark:hover:bg-purple-900/20 text-gray-700 dark:text-gray-300"
              >
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMobileMenu}
                className="lg:hidden p-2 text-gray-700 dark:text-gray-300"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden absolute top-full left-0 right-0 bg-white dark:bg-gray-900 border-b shadow-lg dark:border-gray-800 mobile-menu-dark">
              <div className="container mx-auto px-4 py-4">
                {/* Mobile Location */}
                <div className="mb-4 md:hidden">
                  <LocationButton
                    country={currentLocation.country}
                    city={currentLocation.city}
                    onCountryChange={(country) => setLocation(prev => ({ ...prev, country: country }))}
                    onCityChange={(city) => setLocation(prev => ({ ...prev, city: city }))}
                  />
                </div>
                
                {/* Mobile Navigation */}
                <nav className="flex flex-col space-y-3">
                  <Link 
                    to="/" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`text-lg font-medium py-2 transition-colors ${
                      isActive('/') ? 'text-purple-600 dark:text-purple-400' : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    Home
                  </Link>
                  <Link 
                    to="/buy" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`text-lg font-medium py-2 transition-colors ${
                      isActive('/buy') ? 'text-purple-600 dark:text-purple-400' : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    Shop
                  </Link>
                  <Link 
                    to="/sell" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`text-lg font-medium py-2 transition-colors ${
                      isActive('/sell') ? 'text-purple-600 dark:text-purple-400' : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    Sell
                  </Link>
                  <Link 
                    to="/donate" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`text-lg font-medium py-2 transition-colors ${
                      isActive('/donate') ? 'text-purple-600 dark:text-purple-400' : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    Donate
                  </Link>
                  <Link 
                    to="/about" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`text-lg font-medium py-2 transition-colors ${
                      isActive('/about') ? 'text-purple-600 dark:text-purple-400' : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    About
                  </Link>
                </nav>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;