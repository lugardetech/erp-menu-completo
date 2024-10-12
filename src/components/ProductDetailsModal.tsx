import React from 'react';
import { Dialog, DialogTitle, DialogContent, Typography, Grid, Paper } from '@mui/material';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  sku: string;
  image_url: string;
}

interface ProductDetailsModalProps {
  product: Product;
  onClose: () => void;
}

export default function ProductDetailsModal({ product, onClose }: ProductDetailsModalProps) {
  return (
    <Dialog open={true} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Detalhes do Produto</DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            {product.image_url ? (
              <img 
                src={product.image_url} 
                alt={product.name} 
                style={{ width: '100%', height: 'auto', maxHeight: '300px', objectFit: 'contain' }} 
              />
            ) : (
              <Paper style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography>Imagem não disponível</Typography>
              </Paper>
            )}
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" gutterBottom>{product.name}</Typography>
            <Typography variant="body1" paragraph>{product.description}</Typography>
            <Typography variant="h6" gutterBottom>Preço: R$ {product.price.toFixed(2)}</Typography>
            <Typography variant="body1" gutterBottom>Estoque: {product.stock}</Typography>
            <Typography variant="body1" gutterBottom>SKU: {product.sku}</Typography>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}