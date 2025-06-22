import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Sidebar = () => {
  const location = useLocation();
  console.log('Sidebar rendered, current location:', location.pathname);

  const navItems = [
    { name: 'Dashboard', path: '/sell', icon: <Home className="h-5 w-5" /> },
    { name: 'My Listings', path: '/my-activity', icon: <ShoppingBag className="h-5 w-5" /> },
    { name: 'Create Listing', path: '/sell/new', icon: <PlusCircle className="h-5 w-5" /> },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="w-64 flex flex-col bg-card border-r border-border h-screen sticky top-0 z-10">
      <div className="p-6">
        <Link to="/" className="text-2xl font-bold text-primary">Dapper</Link>
      </div>
      <nav className="flex-grow px-4">
        <p className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Menu</p>
        {navItems.map(item => (
          <Link key={item.name} to={item.path}>
            <Button
              variant={isActive(item.path) ? 'secondary' : 'ghost'}
              className="w-full justify-start mb-1"
            >
              {item.icon}
              <span className="ml-3">{item.name}</span>
            </Button>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar; 