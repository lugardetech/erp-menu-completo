import React, { useState, useEffect } from 'react';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box } from '@mui/material';
import { supabase } from '../lib/supabaseClient';
import { Database } from '../types/supabase';
import CustomerDetailsModal from './CustomerDetailsModal';

type Customer = Database['public']['Tables']['customers']['Row'];

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  async function fetchCustomers() {
    const { data, error } = await supabase
      .from('customers')
      .select('*');
    
    if (error) console.error('Erro ao buscar clientes:', error);
    else setCustomers(data || []);
  }

  const handleCustomerClick = (customer: Customer) => {
    setSelectedCustomer(customer);
  };

  const handleCloseCustomerDetails = () => {
    setSelectedCustomer(null);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Clientes
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Telefone</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map((customer) => (
              <TableRow 
                key={customer.id}
                onClick={() => handleCustomerClick(customer)}
                style={{ cursor: 'pointer' }}
                hover
              >
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.phone || 'N/A'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {selectedCustomer && (
        <CustomerDetailsModal
          customer={selectedCustomer}
          onClose={handleCloseCustomerDetails}
        />
      )}
    </Box>
  );
}