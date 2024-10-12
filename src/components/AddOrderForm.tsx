import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, Snackbar, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { supabase } from '../lib/supabaseClient';
import { Database } from '../types/supabase';

type Product = Database['public']['Tables']['produtos']['Row'];
type Supplier = Database['public']['Tables']['fornecedores']['Row'];
type Carrier = Database['public']['Tables']['carriers']['Row'];

interface OrderItem {
  produto_id: number;
  quantidade: number;
  preco_unitario: number;
}

interface FormValues {
  status: string;
  items: OrderItem[];
  fornecedor_id: number;
  meio_pagamento: string;
  transportadora_id: number;
}

interface AddOrderFormProps {
  onSuccess: () => void;
}

const initialValues: FormValues = {
  status: 'pending',
  items: [],
  fornecedor_id: 0,
  meio_pagamento: '',
  transportadora_id: 0,
};

export default function AddOrderForm({ onSuccess }: AddOrderFormProps) {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [carriers, setCarriers] = useState<Carrier[]>([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    fetchProducts();
    fetchSuppliers();
    fetchCarriers();
  }, []);

  async function fetchProducts() {
    const { data, error } = await supabase
      .from('produtos')
      .select('*');
    
    if (error) console.error('Error fetching products:', error);
    else setProducts(data || []);
  }

  async function fetchSuppliers() {
    const { data, error } = await supabase
      .from('fornecedores')
      .select('*');
    
    if (error) console.error('Error fetching suppliers:', error);
    else setSuppliers(data || []);
  }

  async function fetchCarriers() {
    const { data, error } = await supabase
      .from('carriers')
      .select('*');
    
    if (error) console.error('Error fetching carriers:', error);
    else setCarriers(data || []);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setValues(prevValues => ({
      ...prevValues,
      [name as string]: value,
    }));
  };

  const handleAddItem = () => {
    setValues(prevValues => ({
      ...prevValues,
      items: [...prevValues.items, { produto_id: 0, quantidade: 1, preco_unitario: 0 }],
    }));
  };

  const handleItemChange = (index: number, field: keyof OrderItem, value: number) => {
    setValues(prevValues => {
      const newItems = [...prevValues.items];
      newItems[index] = { ...newItems[index], [field]: value };
      if (field === 'produto_id') {
        const product = products.find(p => p.id === value);
        if (product) {
          newItems[index].preco_unitario = product.preco;
        }
      }
      return { ...prevValues, items: newItems };
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const total = values.items.reduce((sum, item) => sum + item.quantidade * item.preco_unitario, 0);

      const { data: orderData, error: orderError } = await supabase
        .from('sales_orders')
        .insert([{ 
          status: values.status, 
          total_amount: total, 
          order_date: new Date().toISOString(),
          supplier_id: values.fornecedor_id,
          payment_method: values.meio_pagamento,
          carrier_id: values.transportadora_id
        }])
        .select();

      if (orderError) throw orderError;

      const orderId = orderData[0].id;

      const { error: itemsError } = await supabase
        .from('sales_order_items')
        .insert(values.items.map(item => ({ 
          sales_order_id: orderId,
          product_id: item.produto_id,
          quantity: item.quantidade,
          unit_price: item.preco_unitario
        })));

      if (itemsError) throw itemsError;

      setSnackbarMessage('Order added successfully!');
      setOpenSnackbar(true);
      setValues(initialValues);
      onSuccess();
    } catch (error: any) {
      setSnackbarMessage(error.message || 'An error occurred while adding the order.');
      setOpenSnackbar(true);
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Add New Order
      </Typography>
      <form onSubmit={handleSubmit}>
        <FormControl fullWidth margin="normal">
          <InputLabel>Status</InputLabel>
          <Select
            name="status"
            value={values.status}
            onChange={handleChange}
            required
          >
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="processing">Processing</MenuItem>
            <MenuItem value="shipped">Shipped</MenuItem>
            <MenuItem value="delivered">Delivered</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>Supplier</InputLabel>
          <Select
            name="fornecedor_id"
            value={values.fornecedor_id}
            onChange={handleChange}
            required
          >
            {suppliers.map((supplier) => (
              <MenuItem key={supplier.id} value={supplier.id}>{supplier.nome}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>Payment Method</InputLabel>
          <Select
            name="meio_pagamento"
            value={values.meio_pagamento}
            onChange={handleChange}
            required
          >
            <MenuItem value="credit_card">Credit Card</MenuItem>
            <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
            <MenuItem value="cash">Cash</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>Carrier</InputLabel>
          <Select
            name="transportadora_id"
            value={values.transportadora_id}
            onChange={handleChange}
            required
          >
            {carriers.map((carrier) => (
              <MenuItem key={carrier.id} value={carrier.id}>{carrier.nome}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
          Order Items
        </Typography>
        {values.items.map((item, index) => (
          <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Product</InputLabel>
              <Select
                value={item.produto_id}
                onChange={(e) => handleItemChange(index, 'produto_id', Number(e.target.value))}
                required
              >
                {products.map((product) => (
                  <MenuItem key={product.id} value={product.id}>{product.nome}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Quantity"
              type="number"
              value={item.quantidade}
              onChange={(e) => handleItemChange(index, 'quantidade', Number(e.target.value))}
              required
            />
            <TextField
              label="Unit Price"
              type="number"
              value={item.preco_unitario}
              onChange={(e) => handleItemChange(index, 'preco_unitario', Number(e.target.value))}
              required
            />
          </Box>
        ))}
        <Button onClick={handleAddItem} variant="outlined" sx={{ mb: 2 }}>
          Add Item
        </Button>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Add Order
        </Button>
      </form>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        message={snackbarMessage}
      />
    </Box>
  );
}