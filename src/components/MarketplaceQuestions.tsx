import React, { useState, useEffect } from 'react';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box } from '@mui/material';
import { supabase } from '../lib/supabaseClient';
import { Database } from '../types/supabase';

type MarketplaceQuestion = Database['public']['Tables']['marketplace_questions']['Row'];

export default function MarketplaceQuestions() {
  const [questions, setQuestions] = useState<MarketplaceQuestion[]>([]);

  useEffect(() => {
    fetchMarketplaceQuestions();
  }, []);

  async function fetchMarketplaceQuestions() {
    const { data, error } = await supabase
      .from('marketplace_questions')
      .select('*')
      .order('question_date', { ascending: false });
    
    if (error) console.error('Error fetching marketplace questions:', error);
    else setQuestions(data || []);
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Marketplace Questions
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Question ID</TableCell>
              <TableCell>Marketplace ID</TableCell>
              <TableCell>Product ID</TableCell>
              <TableCell>Question Date</TableCell>
              <TableCell>Question</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Answer Date</TableCell>
              <TableCell>Answer</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {questions.map((question) => (
              <TableRow key={question.id}>
                <TableCell>{question.id}</TableCell>
                <TableCell>{question.marketplace_id}</TableCell>
                <TableCell>{question.product_id}</TableCell>
                <TableCell>{new Date(question.question_date || '').toLocaleString()}</TableCell>
                <TableCell>{question.question_content}</TableCell>
                <TableCell>{question.status}</TableCell>
                <TableCell>{question.answer_date ? new Date(question.answer_date).toLocaleString() : 'N/A'}</TableCell>
                <TableCell>{question.answer_content || 'N/A'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}