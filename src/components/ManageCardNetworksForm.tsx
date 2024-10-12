import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, List, ListItem, ListItemText, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { supabase } from '../lib/supabaseClient';

interface ManageCardNetworksFormProps {
  onUpdate: () => void;
}

export default function ManageCardNetworksForm({ onUpdate }: ManageCardNetworksFormProps) {
  const [networks, setNetworks] = useState<string[]>([]);
  const [newNetwork, setNewNetwork] = useState('');

  useEffect(() => {
    fetchNetworks();
  }, []);

  async function fetchNetworks() {
    const { data, error } = await supabase
      .from('bandeiras_cartao')
      .select('nome')
      .order('nome');
    
    if (error) console.error('Error fetching card networks:', error);
    else setNetworks(data?.map(n => n.nome) || []);
  }

  const handleAddNetwork = async () => {
    if (newNetwork.trim()) {
      const { error } = await supabase
        .from('bandeiras_cartao')
        .insert({ nome: newNetwork.trim() });

      if (error) console.error('Error adding card network:', error);
      else {
        fetchNetworks();
        setNewNetwork('');
        onUpdate();
      }
    }
  };

  const handleDeleteNetwork = async (network: string) => {
    const { error } = await supabase
      .from('bandeiras_cartao')
      .delete()
      .eq('nome', network);

    if (error) console.error('Error deleting card network:', error);
    else {
      fetchNetworks();
      onUpdate();
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Gerenciar Lista de Bandeiras de Cartão
      </Typography>
      <Box display="flex" alignItems="center" mb={2}>
        <TextField
          value={newNetwork}
          onChange={(e) => setNewNetwork(e.target.value)}
          label="Nova Bandeira"
          variant="outlined"
          size="small"
          fullWidth
        />
        <Button onClick={handleAddNetwork} variant="contained" sx={{ ml: 1 }}>
          Adicionar
        </Button>
      </Box>
      <List>
        {networks.map((network) => (
          <ListItem
            key={network}
            secondaryAction={
              <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteNetwork(network)}>
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemText primary={network} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}