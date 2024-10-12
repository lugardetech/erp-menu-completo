import React, { useState, useEffect } from 'react';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box } from '@mui/material';
import { supabase } from '../lib/supabaseClient';
import { Database } from '../types/supabase';

type Complaint = Database['public']['Tables']['complaints']['Row'];

export default function Complaints() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);

  useEffect(() => {
    fetchComplaints();
  }, []);

  async function fetchComplaints() {
    const { data, error } = await supabase
      .from('complaints')
      .select('*')
      .order('complaint_date', { ascending: false });
    
    if (error) console.error('Error fetching complaints:', error);
    else setComplaints(data || []);
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Customer Complaints
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Complaint ID</TableCell>
              <TableCell>Customer ID</TableCell>
              <TableCell>Order ID</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Priority</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {complaints.map((complaint) => (
              <TableRow key={complaint.id}>
                <TableCell>{complaint.id}</TableCell>
                <TableCell>{complaint.customer_id}</TableCell>
                <TableCell>{complaint.order_id}</TableCell>
                <TableCell>{new Date(complaint.complaint_date || '').toLocaleString()}</TableCell>
                <TableCell>{complaint.status}</TableCell>
                <TableCell>{complaint.category}</TableCell>
                <TableCell>{complaint.priority}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}