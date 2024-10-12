import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Snackbar } from '@mui/material';
import { supabase } from '../lib/supabaseClient';

interface FormValues {
  name: string;
  contact: string;
}

interface AddSupplierFormProps {
  onSuccess: () => void;
}

const initialValues: FormValues = {
  name: '',
  contact: '',
};

export default function AddSupplierForm({ onSuccess }: AddSupplierFormProps) {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues(prevValues => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('suppliers')
        .insert([values]);

      if (error) throw error;

      setSnackbarMessage('Fornecedor adicionado com sucesso!');
      setOpenSnackbar(true);
      setValues(initialValues);
      onSuccess();
    } catch (error: any) {
      setSnackbarMessage(error.message || 'Ocorreu um erro ao adicionar o fornecedor.');
      setOpenSnackbar(true);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Adicionar Novo Fornecedor
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          name="name"
          label="Nome do Fornecedor"
          value={values.name}
          onChange={handleChange}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          name="contact"
          label="Contato"
          value={values.contact}
          onChange={handleChange}
          required
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
        >
          Adicionar Fornecedor
        </Button>
      </form>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        message={snackbarMessage}
      />
    </Box>
  );
}