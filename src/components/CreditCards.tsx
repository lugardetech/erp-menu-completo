import React, { useState, useEffect } from 'react';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, CircularProgress } from '@mui/material';
import { supabase } from '../lib/supabaseClient';
import AddCreditCardForm from './AddCreditCardForm';

interface CreditCard {
  id: number;
  name: string;
  last_four_digits: string;
  expiration_date: string;
  card_brand_id: number;
  bank_id: number;
  bank: {
    name: string;
  };
  card_brand: {
    name: string;
  };
}

export default function CreditCards() {
  const [creditCards, setCreditCards] = useState<CreditCard[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCreditCards();
  }, []);

  async function fetchCreditCards() {
    setIsLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('credit_cards')
      .select(`
        id,
        name,
        last_four_digits,
        expiration_date,
        card_brand_id,
        bank_id,
        bank (name),
        card_brand (name)
      `)
      .order('name');
    
    if (error) {
      console.error('Error fetching credit cards:', error);
      setError('Failed to load credit cards. Please try again.');
    } else if (!data) {
      console.warn('No credit card data received');
      setError('No credit card data found.');
    } else {
      console.log('Formatted Credit Cards:', data);
      setCreditCards(data);
    }
    setIsLoading(false);
  }

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    fetchCreditCards(); // Refresh the list after adding a new credit card
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Credit Cards
      </Typography>
      <Button variant="contained" color="primary" onClick={handleOpenDialog} style={{ marginBottom: '1rem' }}>
        Add New Card
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Card Name</TableCell>
              <TableCell>Last 4 digits</TableCell>
              <TableCell>Card Brand</TableCell>
              <TableCell>Bank</TableCell>
              <TableCell>Expiration Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {creditCards.map((card) => (
              <TableRow key={card.id}>
                <TableCell>{card.name || 'N/A'}</TableCell>
                <TableCell>{card.last_four_digits}</TableCell>
                <TableCell>{card.card_brand?.name}</TableCell>
                <TableCell>{card.bank?.name}</TableCell>
                <TableCell>{new Date(card.expiration_date).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Add New Credit Card</DialogTitle>
        <DialogContent>
          <AddCreditCardForm onSuccess={handleCloseDialog} />
        </DialogContent>
      </Dialog>
    </div>
  );
}