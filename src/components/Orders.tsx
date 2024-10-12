import React, { useState, useEffect } from 'react';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Box, Dialog, DialogContent, DialogTitle, TablePagination, TextField, TableSortLabel, CircularProgress } from '@mui/material';
import { supabase } from '../lib/supabaseClient';
import { Database } from '../types/supabase';
import AddOrderForm from './AddOrderForm';
import OrderDetailsModal from './OrderDetailsModal';
import { useDataFetching } from '../hooks/useDataFetching';

type Order = Database['public']['Tables']['pedidos']['Row'];

export default function Orders() {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filters, setFilters] = useState({ status: '', customer_id: '' });

  const {
    data: orders,
    totalCount,
    loading,
    error,
    updateFetchParams,
    refetch,
    fetchParams,
  } = useDataFetching<Order>(supabase, 'pedidos', {
    page: 0,
    pageSize: 10,
    sortColumn: 'data_pedido',
    sortOrder: 'desc',
    filters,
  });

  const handleChangePage = (event: unknown, newPage: number) => {
    updateFetchParams({ page: newPage });
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateFetchParams({ pageSize: parseInt(event.target.value, 10), page: 0 });
  };

  const handleSort = (column: string) => {
    updateFetchParams((prev) => ({
      sortColumn: column,
      sortOrder: prev.sortColumn === column && prev.sortOrder === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    updateFetchParams({ filters: { ...filters, [name]: value }, page: 0 });
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    refetch();
  };

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
  };

  const handleCloseOrderDetails = () => {
    setSelectedOrder(null);
    refetch();
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">Error: {error}</Typography>;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Pedidos
      </Typography>
      <Button variant="contained" color="primary" onClick={handleOpenDialog} style={{ marginBottom: '1rem' }}>
        Adicionar Novo Pedido
      </Button>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          label="Filtrar por Status"
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
        />
        <TextField
          label="Filtrar por ID do Cliente"
          name="customer_id"
          value={filters.customer_id}
          onChange={handleFilterChange}
        />
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={fetchParams.sortColumn === 'id'}
                  direction={fetchParams.sortColumn === 'id' ? fetchParams.sortOrder : 'asc'}
                  onClick={() => handleSort('id')}
                >
                  ID do Pedido
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={fetchParams.sortColumn === 'data_pedido'}
                  direction={fetchParams.sortColumn === 'data_pedido' ? fetchParams.sortOrder : 'asc'}
                  onClick={() => handleSort('data_pedido')}
                >
                  Data
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={fetchParams.sortColumn === 'status'}
                  direction={fetchParams.sortColumn === 'status' ? fetchParams.sortOrder : 'asc'}
                  onClick={() => handleSort('status')}
                >
                  Status
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={fetchParams.sortColumn === 'total'}
                  direction={fetchParams.sortColumn === 'total' ? fetchParams.sortOrder : 'asc'}
                  onClick={() => handleSort('total')}
                >
                  Total
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow 
                key={order.id}
                onClick={() => handleOrderClick(order)}
                style={{ cursor: 'pointer' }}
                hover
              >
                <TableCell>{order.id}</TableCell>
                <TableCell>{new Date(order.data_pedido || '').toLocaleString()}</TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell>R$ {order.total.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={totalCount}
        rowsPerPage={fetchParams.pageSize}
        page={fetchParams.page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>Adicionar Novo Pedido</DialogTitle>
        <DialogContent>
          <AddOrderForm onSuccess={handleCloseDialog} />
        </DialogContent>
      </Dialog>
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={handleCloseOrderDetails}
          onUpdate={refetch}
        />
      )}
    </Box>
  );
}