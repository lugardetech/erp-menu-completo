import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Button, TextField, Box, Typography, Container, Tabs, Tab, Alert } from '@mui/material';
import { Mail, Lock } from 'lucide-react';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`auth-tabpanel-${index}`}
      aria-labelledby={`auth-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setError(null);
    setSuccess(null);
  };

  const handleMagicLink = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) throw error;
      setSuccess('Verifique seu e-mail para o link de login!');
    } catch (error: any) {
      setError(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (error: any) {
      setError(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs" className="min-h-screen flex items-center justify-center">
      <Box className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <Typography component="h1" variant="h4" className="text-center mb-6 font-bold text-gray-800">
          Login do Sistema ERP
        </Typography>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="auth tabs" centered>
          <Tab label="E-mail/Senha" />
          <Tab label="Link Mágico" />
        </Tabs>
        {error && (
          <Alert severity="error" className="mt-4">
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" className="mt-4">
            {success}
          </Alert>
        )}
        <TabPanel value={tabValue} index={0}>
          <Box component="form" onSubmit={handleEmailSignIn} noValidate className="space-y-4">
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Endereço de E-mail"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-50"
              InputProps={{
                className: "text-lg",
                startAdornment: <Mail className="mr-2 text-gray-400" size={20} />,
              }}
              InputLabelProps={{
                className: "text-gray-600",
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Senha"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-50"
              InputProps={{
                className: "text-lg",
                startAdornment: <Lock className="mr-2 text-gray-400" size={20} />,
              }}
              InputLabelProps={{
                className: "text-gray-600",
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-md text-lg font-semibold transition duration-300 mt-4"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </Box>
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <Box component="form" onSubmit={handleMagicLink} noValidate className="space-y-4">
            <TextField
              margin="normal"
              required
              fullWidth
              id="magic-link-email"
              label="Endereço de E-mail"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-50"
              InputProps={{
                className: "text-lg",
                startAdornment: <Mail className="mr-2 text-gray-400" size={20} />,
              }}
              InputLabelProps={{
                className: "text-gray-600",
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-md text-lg font-semibold transition duration-300 mt-4"
            >
              {loading ? 'Enviando...' : 'Enviar Link Mágico'}
            </Button>
          </Box>
        </TabPanel>
      </Box>
    </Container>
  );
}