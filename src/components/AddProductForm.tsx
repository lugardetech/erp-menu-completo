import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Snackbar, Input } from '@mui/material';
import { supabase } from '../lib/supabaseClient';

interface FormValues {
  name: string;
  description: string;
  price: number;
  stock: number;
  sku: string;
  image_url: string;
}

interface AddProductFormProps {
  onSuccess: () => void;
}

const initialValues: FormValues = {
  name: '',
  description: '',
  price: 0,
  stock: 0,
  sku: '',
  image_url: '',
};

export default function AddProductForm({ onSuccess }: AddProductFormProps) {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues(prevValues => ({
      ...prevValues,
      [name]: name === 'price' || name === 'stock' ? Number(value) : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { data: user, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error('Usuário não autenticado');
      }

      let image_url = '';
      if (imageFile) {
        image_url = await uploadImage(imageFile);
      }

      const { error } = await supabase
        .from('products')
        .insert([{ ...values, image_url }]);

      if (error) throw error;

      setSnackbarMessage('Produto adicionado com sucesso!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      setValues(initialValues);
      setImageFile(null);
      onSuccess();
    } catch (error: any) {
      setSnackbarMessage(error.message || 'Ocorreu um erro ao adicionar o produto.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Adicionar Novo Produto
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          name="name"
          label="Nome do Produto"
          value={values.name}
          onChange={handleChange}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          name="description"
          label="Descrição"
          multiline
          rows={4}
          value={values.description}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          name="price"
          label="Preço"
          type="number"
          value={values.price}
          onChange={handleChange}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          name="stock"
          label="Estoque"
          type="number"
          value={values.stock}
          onChange={handleChange}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          name="sku"
          label="SKU"
          value={values.sku}
          onChange={handleChange}
          required
        />
        <Input
          type="file"
          onChange={handleImageChange}
          sx={{ mt: 2, mb: 2 }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
        >
          Adicionar Produto
        </Button>
      </form>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        ContentProps={{
          sx: { backgroundColor: snackbarSeverity === 'success' ? 'green' : 'red' }
        }}
      />
    </Box>
  );
}