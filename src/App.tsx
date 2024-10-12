import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { supabase } from './lib/supabaseClient';
import { Session } from '@supabase/supabase-js';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Auth from './components/Auth';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Products from './components/Products';
import Orders from './components/Orders';
import Suppliers from './components/Suppliers';
import Customers from './components/Customers';
import Finance from './components/Finance';
import PurchaseOrderTracker from './components/PurchaseOrderTracker';
import Inventory from './components/Inventory';
import SalesReturns from './components/SalesReturns';
import Complaints from './components/Complaints';
import MarketplaceQuestions from './components/MarketplaceQuestions';

const theme = createTheme();

function App() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={session ? <Layout /> : <Auth />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="orders" element={<Orders />} />
            <Route path="suppliers" element={<Suppliers />} />
            <Route path="customers" element={<Customers />} />
            <Route path="finance" element={<Finance />} />
            <Route path="purchase-order-tracker" element={<PurchaseOrderTracker />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="sales-returns" element={<SalesReturns />} />
            <Route path="complaints" element={<Complaints />} />
            <Route path="marketplace-questions" element={<MarketplaceQuestions />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;