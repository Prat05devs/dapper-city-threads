import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, User, Sun, Moon, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from '@/components/auth/AuthModal';
import NotificationBell from '@/components/notifications/NotificationBell';

const Header = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();

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
            <Link to="/" className="flex items-center space-x-2 z-10">
              <div className="w-9 h-9 bg-gradient-to-br from-purple-600 to-blue-600 dark:from-purple-500 dark:to-blue-500 rounded-xl flex items-center justify-center shadow-lg dark:neon-glow">
                <span className="text-white font-bold text-lg">D</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent gradient-text">
                Dapper
              </span>
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
            <div className="flex items-center space-x-3">
              {/* Search - Hidden on mobile */}
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                <Input 
                  placeholder="Search rare finds..." 
                  className="pl-10 w-48 lg:w-64 border-gray-200 dark:border-gray-700 focus:border-purple-500 dark:focus:border-purple-400 rounded-full search-input bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>

              {/* Notification Bell - Only show when authenticated */}
              {user && <NotificationBell />}

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2 hover:bg-purple-50 dark:hover:bg-purple-900/20 text-gray-700 dark:text-gray-300">
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline text-sm">
                      {user ? user.email?.split('@')[0] : 'Account'}
                    </span>
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
                    <DropdownMenuItem onClick={() => setIsAuthModalOpen(true)} className="dark:hover:bg-gray-700">
                      Sign In
                    </DropdownMenuItem>
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
                {/* Mobile Search */}
                <div className="relative mb-4 md:hidden">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                  <Input 
                    placeholder="Search rare finds..." 
                    className="pl-10 w-full border-gray-200 dark:border-gray-700 focus:border-purple-500 dark:focus:border-purple-400 rounded-full search-input bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
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

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
};

export default Header;