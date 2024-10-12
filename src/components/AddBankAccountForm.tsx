import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, Snackbar, Select, MenuItem, FormControl, InputLabel, Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { supabase } from '../lib/supabaseClient';
import ManageBanksForm from './ManageBanksForm';

interface FormValues {
  nome: string;
  bank_id: number | null;
  numero_conta: string;
  tipo_conta: string;
}

interface AddBankAccountFormProps {
  onSuccess: () => void;
}

const initialValues: FormValues = {
  nome: '',
  bank_id: null,
  numero_conta: '',
  tipo_conta: '',
};

interface Bank {
  id: number;
  nome: string;
}

export default function AddBankAccountForm({ onSuccess }: AddBankAccountFormProps) {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [banks, setBanks] = useState<Bank[]>([]);
  const [openBanksDialog, setOpenBanksDialog] = useState(false);

  useEffect(() => {
    fetchBanks();
  }, []);

  async function fetchBanks() {
    const { data, error } = await supabase
      .from('bancos')
      .select('id, nome')
      .order('nome');
    
    if (error) console.error('Error fetching banks:', error);
    else setBanks(data || []);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setValues(prevValues => ({
      ...prevValues,
      [name as string]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('contas_bancarias')
        .insert([{
          nome: values.nome,
          banco_id: values.bank_id,
          numero_conta: values.numero_conta,
          tipo_conta: values.tipo_conta,
        }]);

      if (error) throw error;

      setSnackbarMessage('Conta bancária adicionada com sucesso!');
      setOpenSnackbar(true);
      setValues(initialValues);
      onSuccess();
    } catch (error: any) {
      setSnackbarMessage(error.message || 'Ocorreu um erro ao adicionar a conta bancária.');
      setOpenSnackbar(true);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Adicionar Nova Conta Bancária
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          name="nome"
          label="Nome da Conta"
          value={values.nome}
          onChange={handleChange}
          required
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Banco</InputLabel>
          <Select
            name="bank_id"
            value={values.bank_id || ''}
            onChange={handleChange}
            required
            endAdornment={
              <IconButton
                size="small"
                onClick={() => setOpenBanksDialog(true)}
                sx={{ marginRight: 2 }}
              >
                <EditIcon />
              </IconButton>
            }
          >
            {banks.map((bank) => (
              <MenuItem key={bank.id} value={bank.id}>{bank.nome}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          fullWidth
          margin="normal"
          name="numero_conta"
          label="Número da Conta"
          value={values.numero_conta}
          onChange={handleChange}
          required
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Tipo de Conta</InputLabel>
          <Select
            name="tipo_conta"
            value={values.tipo_conta}
            onChange={handleChange}
            required
          >
            <MenuItem value="corrente">Conta Corrente</MenuItem>
            <MenuItem value="poupanca">Conta Poupança</MenuItem>
          </Select>
        </FormControl>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Adicionar Conta
        </Button>
      </form>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        message={snackbarMessage}
      />
      <Dialog open={openBanksDialog} onClose={() => setOpenBanksDialog(false)}>
        <DialogTitle>Gerenciar Bancos</DialogTitle>
        <DialogContent>
          <ManageBanksForm onUpdate={fetchBanks} />
        </DialogContent>
      </Dialog>
    </Box>
  );
}