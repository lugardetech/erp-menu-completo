import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, List, ListItem, ListItemText, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { supabase } from '../lib/supabaseClient';

interface ManageBanksFormProps {
  onUpdate: () => void;
}

export default function ManageBanksForm({ onUpdate }: ManageBanksFormProps) {
  const [banks, setBanks] = useState<string[]>([]);
  const [newBank, setNewBank] = useState('');

  useEffect(() => {
    fetchBanks();
  }, []);

  async function fetchBanks() {
    const { data, error } = await supabase
      .from('bancos')
      .select('nome')
      .order('nome');
    
    if (error) console.error('Error fetching banks:', error);
    else setBanks(data?.map(b => b.nome) || []);
  }

  const handleAddBank = async () => {
    if (newBank.trim()) {
      const { error } = await supabase
        .from('bancos')
        .insert({ nome: newBank.trim() });

      if (error) console.error('Error adding bank:', error);
      else {
        fetchBanks();
        setNewBank('');
        onUpdate();
      }
    }
  };

  const handleDeleteBank = async (bank: string) => {
    const { error } = await supabase
      .from('bancos')
      .delete()
      .eq('nome', bank);

    if (error) console.error('Error deleting bank:', error);
    else {
      fetchBanks();
      onUpdate();
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Gerenciar Lista de Bancos
      </Typography>
      <Box display="flex" alignItems="center" mb={2}>
        <TextField
          value={newBank}
          onChange={(e) => setNewBank(e.target.value)}
          label="Novo Banco"
          variant="outlined"
          size="small"
          fullWidth
        />
        <Button onClick={handleAddBank} variant="contained" sx={{ ml: 1 }}>
          Adicionar
        </Button>
      </Box>
      <List>
        {banks.map((bank) => (
          <ListItem
            key={bank}
            secondaryAction={
              <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteBank(bank)}>
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemText primary={bank} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}