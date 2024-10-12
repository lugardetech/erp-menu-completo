import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, List, ListItem, ListItemText, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { supabase } from '../lib/supabaseClient';

interface Carrier {
  id: number;
  nome: string;
  contato: string;
  area_servico: string;
}

interface ManageCarriersFormProps {
  onUpdate: () => void;
}

export default function ManageCarriersForm({ onUpdate }: ManageCarriersFormProps) {
  const [carriers, setCarriers] = useState<Carrier[]>([]);
  const [newCarrier, setNewCarrier] = useState({ nome: '', contato: '', area_servico: '' });
  const [editingCarrier, setEditingCarrier] = useState<Carrier | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    fetchCarriers();
  }, []);

  async function fetchCarriers() {
    const { data, error } = await supabase
      .from('carriers')
      .select('*')
      .order('nome');
    
    if (error) console.error('Error fetching carriers:', error);
    else setCarriers(data || []);
  }

  const handleAddCarrier = async () => {
    if (newCarrier.nome.trim()) {
      const { error } = await supabase
        .from('carriers')
        .insert([newCarrier]);

      if (error) console.error('Error adding carrier:', error);
      else {
        fetchCarriers();
        setNewCarrier({ nome: '', contato: '', area_servico: '' });
        onUpdate();
      }
    }
  };

  const handleEditCarrier = (carrier: Carrier) => {
    setEditingCarrier(carrier);
    setOpenDialog(true);
  };

  const handleUpdateCarrier = async () => {
    if (editingCarrier) {
      const { error } = await supabase
        .from('carriers')
        .update(editingCarrier)
        .eq('id', editingCarrier.id);

      if (error) console.error('Error updating carrier:', error);
      else {
        fetchCarriers();
        setOpenDialog(false);
        onUpdate();
      }
    }
  };

  const handleDeleteCarrier = async (id: number) => {
    const { error } = await supabase
      .from('carriers')
      .delete()
      .eq('id', id);

    if (error) console.error('Error deleting carrier:', error);
    else {
      fetchCarriers();
      onUpdate();
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Gerenciar Transportadoras
      </Typography>
      <Box display="flex" flexDirection="column" gap={2} mb={2}>
        <TextField
          label="Nome da Transportadora"
          value={newCarrier.nome}
          onChange={(e) => setNewCarrier({ ...newCarrier, nome: e.target.value })}
        />
        <TextField
          label="Contato"
          value={newCarrier.contato}
          onChange={(e) => setNewCarrier({ ...newCarrier, contato: e.target.value })}
        />
        <TextField
          label="Área de Serviço"
          value={newCarrier.area_servico}
          onChange={(e) => setNewCarrier({ ...newCarrier, area_servico: e.target.value })}
        />
        <Button onClick={handleAddCarrier} variant="contained">
          Adicionar Transportadora
        </Button>
      </Box>
      <List>
        {carriers.map((carrier) => (
          <ListItem
            key={carrier.id}
            secondaryAction={
              <>
                <IconButton edge="end" aria-label="edit" onClick={() => handleEditCarrier(carrier)}>
                  <EditIcon />
                </IconButton>
                <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteCarrier(carrier.id)}>
                  <DeleteIcon />
                </IconButton>
              </>
            }
          >
            <ListItemText 
              primary={carrier.nome}
              secondary={`Contato: ${carrier.contato}, Área de Serviço: ${carrier.area_servico}`}
            />
          </ListItem>
        ))}
      </List>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Editar Transportadora</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="normal"
            label="Nome"
            value={editingCarrier?.nome || ''}
            onChange={(e) => setEditingCarrier(prev => prev ? {...prev, nome: e.target.value} : null)}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Contato"
            value={editingCarrier?.contato || ''}
            onChange={(e) => setEditingCarrier(prev => prev ? {...prev, contato: e.target.value} : null)}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Área de Serviço"
            value={editingCarrier?.area_servico || ''}
            onChange={(e) => setEditingCarrier(prev => prev ? {...prev, area_servico: e.target.value} : null)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button onClick={handleUpdateCarrier}>Atualizar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}