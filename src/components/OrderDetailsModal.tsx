import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Button, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { supabase } from '../lib/supabaseClient';
import { Database } from '../types/supabase';

type Order = Database['public']['Tables']['pedidos']['Row'];
type OrderItem = Database['public']['Tables']['itens_pedido']['Row'] & { produto: { nome: string } };
type Supplier = Database['public']['Tables']['fornecedores']['Row'];
type Carrier = Database['public']['Tables']['carriers']['Row'];

interface OrderDetailsModalProps {
  order: Order;
  onClose: () => void;
  onUpdate: () => void;
}

export default function OrderDetailsModal({ order, onClose, onUpdate }: OrderDetailsModalProps) {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [carrier, setCarrier] = useState<Carrier | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editedOrder, setEditedOrder] = useState<Omit<Order, 'id'>>({
    data_pedido: order.data_pedido,
    status: order.status,
    total: order.total,
    fornecedor_id: order.fornecedor_id,
    meio_pagamento: order.meio_pagamento,
    cartao_credito_id: order.cartao_credito_id,
    conta_bancaria_id: order.conta_bancaria_id,
    transportadora_id: order.transportadora_id,
  });

  useEffect(() => {
    fetchOrderDetails();
  }, [order.id]);

  async function fetchOrderDetails() {
    setLoading(true);
    await Promise.all([
      fetchOrderItems(),
      fetchSupplier(),
      fetchCarrier()
    ]);
    setLoading(false);
  }

  async function fetchOrderItems() {
    const { data, error } = await supabase
      .from('itens_pedido')
      .select(`
        *,
        produto:produtos(nome)
      `)
      .eq('pedido_id', order.id);

    if (error) {
      console.error('Error fetching order items:', error);
    } else {
      setOrderItems(data as OrderItem[]);
    }
  }

  async function fetchSupplier() {
    if (order.fornecedor_id) {
      const { data, error } = await supabase
        .from('fornecedores')
        .select('*')
        .eq('id', order.fornecedor_id)
        .single();

      if (error) {
        console.error('Error fetching supplier:', error);
      } else {
        setSupplier(data);
      }
    }
  }

  async function fetchCarrier() {
    if (order.transportadora_id) {
      const { data, error } = await supabase
        .from('carriers')
        .select('*')
        .eq('id', order.transportadora_id)
        .single();

      if (error) {
        console.error('Error fetching carrier:', error);
      } else {
        setCarrier(data);
      }
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setEditedOrder(prev => ({ ...prev, [name as string]: value }));
  };

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('pedidos')
        .update(editedOrder)
        .eq('id', order.id);

      if (error) throw error;

      setEditMode(false);
      onUpdate();
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  return (
    <Dialog open={true} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Order Details
        {!editMode && (
          <Button onClick={() => setEditMode(true)} style={{ float: 'right' }}>
            Edit
          </Button>
        )}
      </DialogTitle>
      <DialogContent>
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            <Typography variant="h6" gutterBottom>
              Order ID: {order.id}
            </Typography>
            {editMode ? (
              <form>
                <TextField
                  fullWidth
                  margin="normal"
                  name="data_pedido"
                  label="Date"
                  type="datetime-local"
                  value={editedOrder.data_pedido?.slice(0, 16) || ''}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                />
                <FormControl fullWidth margin="normal">
                  <InputLabel>Status</InputLabel>
                  <Select
                    name="status"
                    value={editedOrder.status}
                    onChange={handleInputChange}
                  >
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="processing">Processing</MenuItem>
                    <MenuItem value="shipped">Shipped</MenuItem>
                    <MenuItem value="delivered">Delivered</MenuItem>
                    <MenuItem value="cancelled">Cancelled</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  margin="normal"
                  name="total"
                  label="Total"
                  type="number"
                  value={editedOrder.total}
                  onChange={handleInputChange}
                />
                <Button onClick={handleSave} variant="contained" color="primary" style={{ marginTop: '1rem' }}>
                  Save Changes
                </Button>
              </form>
            ) : (
              <>
                <Typography variant="body1" gutterBottom>
                  Date: {new Date(order.data_pedido || '').toLocaleString()}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Status: {order.status}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Total: ${order.total.toFixed(2)}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Supplier: {supplier ? supplier.nome : 'N/A'}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Carrier: {carrier ? carrier.nome : 'N/A'}
                </Typography>
              </>
            )}
            <Typography variant="h6" gutterBottom style={{ marginTop: '1rem' }}>
              Order Items
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right">Unit Price</TableCell>
                    <TableCell align="right">Subtotal</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orderItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.produto.nome}</TableCell>
                      <TableCell align="right">{item.quantidade}</TableCell>
                      <TableCell align="right">${item.preco_unitario.toFixed(2)}</TableCell>
                      <TableCell align="right">${(item.quantidade * item.preco_unitario).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}