import React, { useState, useEffect } from 'react';
import { Typography, Paper, Grid, Chip, CircularProgress, Button, Dialog, DialogTitle, DialogContent, TextField } from '@mui/material';
import { supabase } from '../lib/supabaseClient';
import { Database } from '../types/supabase';

type PurchaseOrder = Database['public']['Tables']['purchase_orders']['Row'];

const PurchaseOrderTracker: React.FC = () => {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [trackingCode, setTrackingCode] = useState('');

  useEffect(() => {
    fetchPurchaseOrders();
  }, []);

  async function fetchPurchaseOrders() {
    setLoading(true);
    const { data, error } = await supabase
      .from('purchase_orders')
      .select('*')
      .order('order_date', { ascending: false });

    if (error) {
      console.error('Error fetching purchase orders:', error);
    } else {
      setPurchaseOrders(data || []);
    }
    setLoading(false);
  }

  const handleOpenDialog = (order: PurchaseOrder) => {
    setSelectedOrder(order);
    setTrackingCode(order.tracking_code || '');
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedOrder(null);
    setTrackingCode('');
  };

  const handleUpdateTrackingCode = async () => {
    if (selectedOrder) {
      const { error } = await supabase
        .from('purchase_orders')
        .update({ tracking_code: trackingCode })
        .eq('id', selectedOrder.id);

      if (error) {
        console.error('Error updating tracking code:', error);
      } else {
        fetchPurchaseOrders();
        handleCloseDialog();
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'shipped':
        return 'info';
      case 'delivered':
        return 'success';
      default:
        return 'default';
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Purchase Order Tracker
      </Typography>
      <Grid container spacing={3}>
        {purchaseOrders.map((order) => (
          <Grid item xs={12} md={6} key={order.id}>
            <Paper elevation={3} style={{ padding: '1rem' }}>
              <Typography variant="h6">Order #{order.id}</Typography>
              <Typography>Date: {new Date(order.order_date || '').toLocaleDateString()}</Typography>
              <Typography>Total: ${order.total_amount.toFixed(2)}</Typography>
              <Chip 
                label={order.status} 
                color={getStatusColor(order.status)}
                style={{ marginTop: '0.5rem' }}
              />
              <Button 
                variant="outlined" 
                color="primary" 
                style={{ marginTop: '1rem' }}
                onClick={() => handleOpenDialog(order)}
              >
                Update Tracking
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Update Tracking Code</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Tracking Code"
            type="text"
            fullWidth
            value={trackingCode}
            onChange={(e) => setTrackingCode(e.target.value)}
          />
          <Button onClick={handleUpdateTrackingCode} color="primary">
            Update
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PurchaseOrderTracker;