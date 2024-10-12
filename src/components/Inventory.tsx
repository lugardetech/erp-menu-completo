import React, { useState, useEffect } from 'react';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box } from '@mui/material';
import { supabase } from '../lib/supabaseClient';

interface InventoryMovement {
  id: number;
  product_id: number;
  movement_type: string;
  quantity: number;
  movement_date: string;
  notes: string;
  product: {
    name: string;
  };
}

export default function Inventory() {
  const [movements, setMovements] = useState<InventoryMovement[]>([]);

  useEffect(() => {
    fetchInventoryMovements();
  }, []);

  async function fetchInventoryMovements() {
    const { data, error } = await supabase
      .from('inventory_movements')
      .select(`
        *,
        product:products(name)
      `)
      .order('movement_date', { ascending: false });
    
    if (error) console.error('Erro ao buscar movimentações de estoque:', error);
    else setMovements(data || []);
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Movimentações de Estoque
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Produto</TableCell>
              <TableCell>Tipo de Movimento</TableCell>
              <TableCell>Quantidade</TableCell>
              <TableCell>Data</TableCell>
              <TableCell>Observações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {movements.map((movement) => (
              <TableRow key={movement.id}>
                <TableCell>{movement.product.name}</TableCell>
                <TableCell>{movement.movement_type}</TableCell>
                <TableCell>{movement.quantity}</TableCell>
                <TableCell>{new Date(movement.movement_date).toLocaleString()}</TableCell>
                <TableCell>{movement.notes}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}