import React from 'react';
import { Typography, Grid, Paper } from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import PeopleIcon from '@mui/icons-material/People';
import InventoryIcon from '@mui/icons-material/Inventory';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const DashboardItem = ({ title, value, icon: Icon }) => (
  <Paper elevation={3} sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
    <Icon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
    <div>
      <Typography variant="h6">{title}</Typography>
      <Typography variant="h4">{value}</Typography>
    </div>
  </Paper>
);

export default function Dashboard() {
  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Painel de Controle
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardItem title="Vendas Totais" value="R$ 15.200" icon={BarChartIcon} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardItem title="Clientes" value="1.250" icon={PeopleIcon} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardItem title="Produtos" value="150" icon={InventoryIcon} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardItem title="Pedidos" value="85" icon={ShoppingCartIcon} />
        </Grid>
      </Grid>
    </div>
  );
}