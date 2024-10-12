import React from 'react';
import { Dialog, DialogTitle, DialogContent, Typography, Grid } from '@mui/material';
import { Database } from '../types/supabase';

type Customer = Database['public']['Tables']['customers']['Row'];

interface CustomerDetailsModalProps {
  customer: Customer;
  onClose: () => void;
}

export default function CustomerDetailsModal({ customer, onClose }: CustomerDetailsModalProps) {
  return (
    <Dialog open={true} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Detalhes do Cliente</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h5" gutterBottom>{customer.name}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1" gutterBottom>
              <strong>Email:</strong> {customer.email}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1" gutterBottom>
              <Typography variant="body1" gutterBottom>
                <strong>Telefone:</strong> {customer.phone || 'N/A'}
              </Typography>
            </Typography>
          </Grid>
          {/* Add more customer details here as needed */}
        </Grid>
      </DialogContent>
    </Dialog>
  );
}