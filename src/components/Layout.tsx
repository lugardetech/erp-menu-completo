import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Box, AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PeopleIcon from '@mui/icons-material/People';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';
import FeedbackIcon from '@mui/icons-material/Feedback';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, link: '/' },
  { text: 'Products', icon: <InventoryIcon />, link: '/products' },
  { text: 'Orders', icon: <ShoppingCartIcon />, link: '/orders' },
  { text: 'Suppliers', icon: <LocalShippingIcon />, link: '/suppliers' },
  { text: 'Customers', icon: <PeopleIcon />, link: '/customers' },
  { text: 'Finance', icon: <AttachMoneyIcon />, link: '/finance' },
  { text: 'Purchase Order Tracker', icon: <ReceiptIcon />, link: '/purchase-order-tracker' },
  { text: 'Inventory', icon: <InventoryIcon />, link: '/inventory' },
  { text: 'Sales Returns', icon: <AssignmentReturnIcon />, link: '/sales-returns' },
  { text: 'Complaints', icon: <FeedbackIcon />, link: '/complaints' },
  { text: 'Marketplace Questions', icon: <QuestionAnswerIcon />, link: '/marketplace-questions' },
];

export default function Layout() {
  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            ERP System
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {menuItems.map((item) => (
              <ListItem button key={item.text} component={Link} to={item.link}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}