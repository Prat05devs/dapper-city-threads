
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Transaction {
  id: string;
  amount: number;
  status: string;
  confirmation_status: string;
  product_id: string;
  buyer_id: string;
  seller_id: string;
  created_at: string;
  product?: {
    name: string;
    image_urls: string[];
  };
}

interface TransactionConfirmationProps {
  transaction: Transaction;
  userRole: 'buyer' | 'seller';
  onUpdate: () => void;
}

const TransactionConfirmation: React.FC<TransactionConfirmationProps> = ({
  transaction,
  userRole,
  onUpdate
}) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleConfirmReceived = async () => {
    if (userRole !== 'buyer') return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('transactions')
        .update({
          confirmation_status: 'confirmed',
          confirmed_at: new Date().toISOString()
        })
        .eq('id', transaction.id);

      if (error) throw error;

      // Trigger payout to seller via edge function
      await supabase.functions.invoke('process-payout', {
        body: { transactionId: transaction.id }
      });

      toast({
        title: "Confirmed!",
        description: "You have confirmed receipt. The seller will receive payment shortly.",
      });

      onUpdate();
    } catch (error) {
      console.error('Error confirming transaction:', error);
      toast({
        title: "Error",
        description: "Failed to confirm transaction",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = () => {
    switch (transaction.confirmation_status) {
      case 'pending':
        return (
          <Badge variant="outline" className="text-yellow-600 border-yellow-600">
            <Clock className="w-3 h-3 mr-1" />
            Awaiting Confirmation
          </Badge>
        );
      case 'confirmed':
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Confirmed
          </Badge>
        );
      case 'disputed':
        return (
          <Badge variant="destructive">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Disputed
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Transaction #{transaction.id.slice(0, 8)}</CardTitle>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {transaction.product && (
          <div className="flex items-center space-x-3">
            <img
              src={transaction.product.image_urls?.[0] || '/placeholder.svg'}
              alt={transaction.product.name}
              className="w-16 h-16 object-cover rounded"
            />
            <div>
              <h4 className="font-medium">{transaction.product.name}</h4>
              <p className="text-sm text-gray-600">₹{transaction.amount}</p>
            </div>
          </div>
        )}

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Status:</span>
            <span className="font-medium">{transaction.status}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Date:</span>
            <span>{new Date(transaction.created_at).toLocaleDateString()}</span>
          </div>
        </div>

        {userRole === 'buyer' && transaction.confirmation_status === 'pending' && (
          <div className="pt-4 border-t">
            <p className="text-sm text-gray-600 mb-3">
              Have you received the item? Confirming will release payment to the seller.
            </p>
            <Button 
              onClick={handleConfirmReceived}
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Processing...' : 'Confirm Receipt'}
            </Button>
          </div>
        )}

        {userRole === 'seller' && transaction.confirmation_status === 'pending' && (
          <div className="pt-4 border-t">
            <p className="text-sm text-gray-600">
              Waiting for buyer to confirm receipt. Payment will be released once confirmed.
            </p>
          </div>
        )}

        {transaction.confirmation_status === 'confirmed' && (
          <div className="pt-4 border-t bg-green-50 p-3 rounded">
            <p className="text-sm text-green-800">
              {userRole === 'buyer' 
                ? 'You have confirmed receipt of this item.'
                : 'Payment has been released for this transaction.'
              }
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionConfirmation;
