import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { PlusCircle, DollarSign, ShoppingCart, List, Clock, CreditCard, CheckCircle, AlertTriangle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import StripeConnectButton from '@/components/payments/StripeConnectButton';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Sell = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ revenue: 0, sales: 0, active: 0, pending: 0 });
  const [recentListings, setRecentListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stripeConnected, setStripeConnected] = useState(false);
  const [stripeLoading, setStripeLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
      checkStripeConnection();
    }
  }, [user]);

  const checkStripeConnection = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('stripe_account_id')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error checking Stripe connection:', error);
      } else {
        setStripeConnected(!!data?.stripe_account_id);
      }
    } catch (error) {
      console.error('Error checking Stripe connection:', error);
    } finally {
      setStripeLoading(false);
    }
  };

  const fetchDashboardData = async () => {
    if (!user) return;
    setLoading(true);

    // In a real app, these would be more complex queries.
    // For now, we'll fetch listings and calculate stats.
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('seller_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching dashboard data:", error);
    } else if (data) {
      const activeListings = data.filter(p => p.status === 'active');
      const totalSales = data.filter(p => p.status === 'sold').length;
      // Dummy revenue
      const totalRevenue = data.filter(p => p.status === 'sold').reduce((acc, p) => acc + p.price, 0);

      setStats({
        revenue: totalRevenue,
        sales: totalSales,
        active: activeListings.length,
        pending: 0 // Placeholder
      });
      setRecentListings(data.slice(0, 5));
    }
    setLoading(false);
  };

  const StatCard = ({ title, value, icon, formatAsCurrency = false }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {formatAsCurrency ? `₹${value.toLocaleString()}` : value}
        </div>
      </CardContent>
    </Card>
  );

  const handleStripeSuccess = () => {
    // Refresh the Stripe connection status
    checkStripeConnection();
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Please sign in to access the seller dashboard</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 py-6 sm:py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold">Seller Dashboard</h1>
        <div className="flex items-center gap-4">
          {stripeConnected ? (
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Stripe Connected
              </Badge>
            </div>
          ) : (
            <StripeConnectButton onSuccess={handleStripeSuccess} />
          )}
          <Link to="/sell/new">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create New Listing
            </Button>
          </Link>
        </div>
      </div>

      {!stripeConnected && (
        <Alert className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Connect your Stripe account to receive payments from buyers. You can still create listings, but you won't be able to receive payments until you connect Stripe.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Revenue" value={stats.revenue} icon={<DollarSign className="h-4 w-4 text-muted-foreground" />} formatAsCurrency />
        <StatCard title="Total Sales" value={stats.sales} icon={<ShoppingCart className="h-4 w-4 text-muted-foreground" />} />
        <StatCard title="Active Listings" value={stats.active} icon={<List className="h-4 w-4 text-muted-foreground" />} />
        <StatCard title="Pending Orders" value={stats.pending} icon={<Clock className="h-4 w-4 text-muted-foreground" />} />
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Recent Listings</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto w-full">
            <Table className="min-w-[600px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentListings.map(listing => (
                  <TableRow key={listing.id}>
                    <TableCell className="font-medium">{listing.name}</TableCell>
                    <TableCell className="capitalize">{listing.status}</TableCell>
                    <TableCell>₹{listing.price.toLocaleString()}</TableCell>
                    <TableCell>{new Date(listing.created_at).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Sell;
