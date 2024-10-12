import React, { useState, useEffect } from 'react';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box } from '@mui/material';
import { supabase } from '../lib/supabaseClient';
import { Database } from '../types/supabase';

type SalesReturn = Database['public']['Tables']['sales_order_returns']['Row'];

export default function SalesReturns() {
  const [returns, setReturns] = useState<SalesReturn[]>([]);

  useEffect(() => {
    fetchSalesReturns();
  }, []);

  async function fetchSalesReturns() {
    const { data, error } = await supabase
      .from('sales_order_returns')
      .select('*')
      .order('return_date', { ascending: false });
    
    if (error) console.error('Error fetching sales returns:', error);
    else setReturns(data || []);
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Sales Returns
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Return ID</TableCell>
              <TableCell>Order ID</TableCell>
              <TableCell>Return Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Reason</TableCell>
              <TableCell>Refund Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {returns.map((return_) => (
              <TableRow key={return_.id}>
                <TableCell>{return_.id}</TableCell>
                <TableCell>{return_.sales_order_id}</TableCell>
                <TableCell>{new Date(return_.return_date || '').toLocaleDateString()}</TableCell>
                <TableCell>{return_.status}</TableCell>
                <TableCell>{return_.reason}</TableCell>
                <TableCell>${return_.refund_amount?.toFixed(2) || 'N/A'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}