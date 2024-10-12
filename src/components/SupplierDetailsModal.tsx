import React from 'react';
import { Dialog, DialogTitle, DialogContent, Typography, Grid } from '@mui/material';

interface Supplier {
  id: number;
  name: string;
  contact: string;
}

interface SupplierDetailsModalProps {
  supplier: Supplier;
  onClose: () => void;
}

export default function SupplierDetailsModal({ supplier, onClose }: SupplierDetailsModalProps) {
  return (
    <Dialog open={true} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Detalhes do Fornecedor</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h5" gutterBottom>{supplier.name}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1" gutterBottom>
              <strong>Contato:</strong> {supplier.contact}
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}