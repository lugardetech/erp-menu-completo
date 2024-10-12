import React, { useState, useEffect } from 'react';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent } from '@mui/material';
import { supabase } from '../lib/supabaseClient';
import AddBankAccountForm from './AddBankAccountForm';

interface BankAccount {
  id: number;
  nome: string;
  banco_id: number;
  numero_conta: string;
  tipo_conta: string;
  bancos: {
    nome: string;
  };
}

export default function BankAccounts() {
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    fetchBankAccounts();
  }, []);

  async function fetchBankAccounts() {
    const { data, error } = await supabase
      .from('contas_bancarias')
      .select(`
        *,
        bancos (
          nome
        )
      `);
    
    if (error) console.error('Error fetching bank accounts:', error);
    else setBankAccounts(data || []);
  }

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    fetchBankAccounts(); // Refresh the list after adding a new bank account
  };

  const formatAccountType = (type: string) => {
    switch (type) {
      case 'corrente':
        return 'Conta Corrente';
      case 'poupanca':
        return 'Conta Poupança';
      default:
        return type;
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Contas Bancárias
      </Typography>
      <Button variant="contained" color="primary" onClick={handleOpenDialog} style={{ marginBottom: '1rem' }}>
        Adicionar Nova Conta
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome da Conta</TableCell>
              <TableCell>Banco</TableCell>
              <TableCell>Número da Conta</TableCell>
              <TableCell>Tipo de Conta</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bankAccounts.map((account) => (
              <TableRow key={account.id}>
                <TableCell>{account.nome}</TableCell>
                <TableCell>{account.bancos?.nome}</TableCell>
                <TableCell>{account.numero_conta}</TableCell>
                <TableCell>{formatAccountType(account.tipo_conta)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Adicionar Nova Conta Bancária</DialogTitle>
        <DialogContent>
          <AddBankAccountForm onSuccess={handleCloseDialog} />
        </DialogContent>
      </Dialog>
    </div>
  );
}