import React, { useState } from 'react';
import { Typography, Tabs, Tab, Box } from '@mui/material';
import CreditCards from './CreditCards';
import BankAccounts from './BankAccounts';

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
      id={`finance-tabpanel-${index}`}
      aria-labelledby={`finance-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function Finance() {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Finanças
      </Typography>
      <Tabs value={value} onChange={handleChange} aria-label="finance tabs">
        <Tab label="Cartões de Crédito" />
        <Tab label="Contas Bancárias" />
      </Tabs>
      <TabPanel value={value} index={0}>
        <CreditCards />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <BankAccounts />
      </TabPanel>
    </div>
  );
}