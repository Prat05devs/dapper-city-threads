
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, User, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Header = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const location = useLocation();

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-green-100 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">D</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Dapper</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors hover:text-green-600 ${
                isActive('/') ? 'text-green-600' : 'text-gray-700'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/buy" 
              className={`text-sm font-medium transition-colors hover:text-green-600 ${
                isActive('/buy') ? 'text-green-600' : 'text-gray-700'
              }`}
            >
              Buy
            </Link>
            <Link 
              to="/sell" 
              className={`text-sm font-medium transition-colors hover:text-green-600 ${
                isActive('/sell') ? 'text-green-600' : 'text-gray-700'
              }`}
            >
              Sell
            </Link>
            <Link 
              to="/donate" 
              className={`text-sm font-medium transition-colors hover:text-green-600 ${
                isActive('/donate') ? 'text-green-600' : 'text-gray-700'
              }`}
            >
              Donate
            </Link>
            <Link 
              to="/about" 
              className={`text-sm font-medium transition-colors hover:text-green-600 ${
                isActive('/about') ? 'text-green-600' : 'text-gray-700'
              }`}
            >
              About
            </Link>
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input 
                placeholder="Search items..." 
                className="pl-10 w-64 border-gray-200 focus:border-green-500"
              />
            </div>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Account</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>
                  <Link to="/signin" className="w-full">Sign In</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/sell" className="w-full">Seller Dashboard</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Dark Mode Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleDarkMode}
              className="p-2"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
