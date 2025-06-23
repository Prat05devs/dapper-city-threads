import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Edit, Trash2 } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Tables } from '@/integrations/supabase/types';
import { User } from '@supabase/supabase-js';
import { useRef } from 'react';

const MyActivity = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [bidsModalOpen, setBidsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [bids, setBids] = useState<Tables<'bids'>[]>([]);
  const [bidsLoading, setBidsLoading] = useState(false);
  const [acceptingBidId, setAcceptingBidId] = useState<string | null>(null);
  const [sellerProfile, setSellerProfile] = useState<Tables<'profiles'> | null>(null);

  useEffect(() => {
    if (user) {
      fetchUserProducts();
      fetchSellerProfile();
    }
  }, [user]);

  const fetchUserProducts = async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('seller_id', user.id)
      .order('created_at', { ascending: false });
    if (error) {
      console.error("Error fetching products:", error);
      toast({ title: "Error", description: "Could not fetch your products.", variant: "destructive" });
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  };

  const fetchSellerProfile = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    if (!error && data) setSellerProfile(data);
  };

  const openBidsModal = async (product: any) => {
    setSelectedProduct(product);
    setBidsModalOpen(true);
    setBidsLoading(true);
    const { data, error } = await supabase
      .from('bids')
      .select('*, buyer:profiles!buyer_id(full_name, email, avatar_url)')
      .eq('product_id', product.id)
      .order('amount', { ascending: false });
    if (!error && data) setBids(data as any);
    setBidsLoading(false);
  };

  const closeBidsModal = () => {
    setBidsModalOpen(false);
    setSelectedProduct(null);
    setBids([]);
  };

  const handleAcceptBid = async (bid: Tables<'bids'> & { buyer: any }) => {
    if (!selectedProduct || !user) return;
    setAcceptingBidId(bid.id);
    // Accept this bid, reject others
    const { error: acceptError } = await supabase
      .from('bids')
      .update({ status: 'accepted' })
      .eq('id', bid.id);
    const { error: rejectError } = await supabase
      .from('bids')
      .update({ status: 'rejected' })
      .eq('product_id', selectedProduct.id)
      .neq('id', bid.id);
    // Notify buyer
    await supabase.from('notifications').insert({
      user_id: bid.buyer_id,
      type: 'bid_selected',
      title: 'Your bid was accepted!',
      message: `Your bid of ₹${bid.amount} for ${selectedProduct.name} was accepted. Complete your payment to proceed.`,
      related_id: bid.id,
    });
    // Check seller Stripe
    if (!sellerProfile?.stripe_account_id) {
      await supabase.from('notifications').insert({
        user_id: user.id,
        type: 'stripe_required',
        title: 'Connect Stripe to receive payment',
        message: `Please connect your Stripe account to receive payment for ${selectedProduct.name}.`,
        related_id: selectedProduct.id,
      });
    }
    toast({ title: 'Bid accepted', description: 'The buyer has been notified to complete payment.' });
    // Refresh bids
    openBidsModal(selectedProduct);
    setAcceptingBidId(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'sold':
        return <Badge variant="secondary">Sold</Badge>;
      case 'pending':
        return <Badge variant="outline">Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleDelete = async (productId: string) => {
    if (!window.confirm("Are you sure you want to delete this listing?")) return;
    const { error } = await supabase.from('products').delete().eq('id', productId);
    if (error) {
      toast({ title: "Error", description: "Could not delete listing.", variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Listing deleted." });
      fetchUserProducts();
    }
  };

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-8">My Listings</h1>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[350px]">Product</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Listed On</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={5} className="text-center">Loading...</TableCell></TableRow>
              ) : products.length > 0 ? (
                products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-4">
                        <img src={product.image_urls?.[0] || '/placeholder.svg'} alt={product.name} className="w-16 h-16 object-cover rounded-md" />
                        <span>{product.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(product.status)}</TableCell>
                    <TableCell>₹{product.price.toLocaleString()}</TableCell>
                    <TableCell>{new Date(product.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right flex flex-col gap-2 items-end">
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => openBidsModal(product)}>
                        View Bids
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow><TableCell colSpan={5} className="text-center">You haven't listed any products yet.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Bids Modal */}
      <Dialog open={bidsModalOpen} onOpenChange={closeBidsModal}>
        <DialogContent className="max-w-lg w-full p-2 sm:p-4 rounded-xl">
          <h2 className="text-xl font-bold mb-4 text-center">Bids for {selectedProduct?.name}</h2>
          {bidsLoading ? (
            <div className="text-center py-8">Loading bids...</div>
          ) : bids.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No bids yet for this product.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="p-2 text-left">Buyer</th>
                    <th className="p-2 text-left">Amount</th>
                    <th className="p-2 text-left">Message</th>
                    <th className="p-2 text-left">Status</th>
                    <th className="p-2 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {bids.map((bid: any) => (
                    <tr key={bid.id} className="border-b last:border-b-0">
                      <td className="p-2">
                        <div className="flex items-center gap-2">
                          {bid.buyer?.avatar_url && (
                            <img src={bid.buyer.avatar_url} alt="avatar" className="w-6 h-6 rounded-full" />
                          )}
                          <span>{bid.buyer?.full_name || 'Anonymous'}</span>
                        </div>
                      </td>
                      <td className="p-2 font-semibold">₹{bid.amount}</td>
                      <td className="p-2 max-w-[120px] truncate" title={bid.message}>{bid.message || '-'}</td>
                      <td className="p-2">
                        {bid.status === 'accepted' ? (
                          <span className="text-green-600 font-semibold">Accepted</span>
                        ) : bid.status === 'rejected' ? (
                          <span className="text-red-500">Rejected</span>
                        ) : (
                          <span className="text-gray-500">Pending</span>
                        )}
                      </td>
                      <td className="p-2">
                        {bid.status !== 'accepted' && bid.status !== 'rejected' && (
                          <Button
                            size="sm"
                            className="w-full"
                            disabled={!!acceptingBidId}
                            onClick={() => handleAcceptBid(bid)}
                          >
                            {acceptingBidId === bid.id ? 'Accepting...' : 'Accept'}
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default MyActivity;
