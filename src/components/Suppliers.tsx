import React, { useState, useEffect } from 'react';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Box, Dialog, DialogContent, DialogTitle } from '@mui/material';
import { supabase } from '../lib/supabaseClient';
import AddSupplierForm from './AddSupplierForm';
import SupplierDetailsModal from './SupplierDetailsModal';

interface Supplier {
  id: number;
  name: string;
  contact: string;
}

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  async function fetchSuppliers() {
    const { data, error } = await supabase
      .from('suppliers')
      .select('*');
    
    if (error) console.error('Erro ao buscar fornecedores:', error);
    else setSuppliers(data || []);
  }

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    fetchSuppliers();
  };

  const handleSupplierClick = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
  };

  const handleCloseSupplierDetails = () => {
    setSelectedSupplier(null);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Fornecedores
      </Typography>
      <Button variant="contained" color="primary" onClick={handleOpenDialog} style={{ marginBottom: '1rem' }}>
        Adicionar Novo Fornecedor
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Contato</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {suppliers.map((supplier) => (
              <TableRow 
                key={supplier.id}
                onClick={() => handleSupplierClick(supplier)}
                style={{ cursor: 'pointer' }}
                hover
              >
                <TableCell>{supplier.name}</TableCell>
                <TableCell>{supplier.contact}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Adicionar Novo Fornecedor</DialogTitle>
        <DialogContent>
          <AddSupplierForm onSuccess={handleCloseDialog} />
        </DialogContent>
      </Dialog>
      {selectedSupplier && (
        <SupplierDetailsModal
          supplier={selectedSupplier}
          onClose={handleCloseSupplierDetails}
        />
      )}
    </Box>
  );
}