import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, Snackbar, Select, MenuItem, FormControl, InputLabel, Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { supabase } from '../lib/supabaseClient';
import ManageBanksForm from './ManageBanksForm';
import ManageCardNetworksForm from './ManageCardNetworksForm';

interface FormValues {
  nome: string;
  numero_final: string;
  data_expiracao: string;
  bandeira_id: number | null;
  banco_id: number | null;
}

interface AddCreditCardFormProps {
  onSuccess: () => void;
}

const initialValues: FormValues = {
  nome: '',
  numero_final: '',
  data_expiracao: '',
  bandeira_id: null,
  banco_id: null,
};

export default function AddCreditCardForm({ onSuccess }: AddCreditCardFormProps) {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [bancos, setBancos] = useState<{ id: number; nome: string }[]>([]);
  const [bandeiras, setBandeiras] = useState<{ id: number; nome: string }[]>([]);
  const [openBanksDialog, setOpenBanksDialog] = useState(false);
  const [openNetworksDialog, setOpenNetworksDialog] = useState(false);

  useEffect(() => {
    fetchBancos();
    fetchBandeiras();
  }, []);

  async function fetchBancos() {
    const { data, error } = await supabase
      .from('bancos')
      .select('id, nome')
      .order('nome');
    
    if (error) console.error('Error fetching banks:', error);
    else setBancos(data || []);
  }

  async function fetchBandeiras() {
    const { data, error } = await supabase
      .from('bandeiras_cartao')
      .select('id, nome')
      .order('nome');
    
    if (error) console.error('Error fetching card networks:', error);
    else setBandeiras(data || []);
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
        .from('cartoes_credito')
        .insert([values]);

      if (error) throw error;

      setSnackbarMessage('Cartão de crédito adicionado com sucesso!');
      setOpenSnackbar(true);
      setValues(initialValues);
      onSuccess();
    } catch (error: any) {
      setSnackbarMessage(error.message || 'Ocorreu um erro ao adicionar o cartão de crédito.');
      setOpenSnackbar(true);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Adicionar Novo Cartão de Crédito
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          name="nome"
          label="Nome do Cartão"
          value={values.nome}
          onChange={handleChange}
          required
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Banco</InputLabel>
          <Select
            name="banco_id"
            value={values.banco_id || ''}
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
            {bancos.map((banco) => (
              <MenuItem key={banco.id} value={banco.id}>{banco.nome}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          fullWidth
          margin="normal"
          name="numero_final"
          label="Últimos 4 dígitos"
          value={values.numero_final}
          onChange={handleChange}
          required
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Bandeira</InputLabel>
          <Select
            name="bandeira_id"
            value={values.bandeira_id || ''}
            onChange={handleChange}
            required
            endAdornment={
              <IconButton
                size="small"
                onClick={() => setOpenNetworksDialog(true)}
                sx={{ marginRight: 2 }}
              >
                <EditIcon />
              </IconButton>
            }
          >
            {bandeiras.map((bandeira) => (
              <MenuItem key={bandeira.id} value={bandeira.id}>{bandeira.nome}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          fullWidth
          margin="normal"
          name="data_expiracao"
          label="Data de Expiração"
          type="date"
          value={values.data_expiracao}
          onChange={handleChange}
          InputLabelProps={{
            shrink: true,
          }}
          required
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Adicionar Cartão
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
          <ManageBanksForm onUpdate={fetchBancos} />
        </DialogContent>
      </Dialog>
      <Dialog open={openNetworksDialog} onClose={() => setOpenNetworksDialog(false)}>
        <DialogTitle>Gerenciar Bandeiras</DialogTitle>
        <DialogContent>
          <ManageCardNetworksForm onUpdate={fetchBandeiras} />
        </DialogContent>
      </Dialog>
    </Box>
  );
}