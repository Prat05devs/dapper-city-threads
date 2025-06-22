import React from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import NotificationSystem from '../notifications/NotificationSystem';

const LayoutWrapper = () => {
  const location = useLocation();
  
  // Define dashboard routes more specifically - only the actual dashboard pages
  const dashboardRoutes = ['/my-activity', '/sell/new'];
  const isDashboardRoute = dashboardRoutes.some(path => 
    location.pathname === path || location.pathname.startsWith(path + '/')
  );

  console.log('Current path:', location.pathname);
  console.log('Is dashboard route:', isDashboardRoute);

  if (isDashboardRoute) {
    return <Outlet />; // DashboardLayout will be applied in App.tsx
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <NotificationSystem />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default LayoutWrapper; 