import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import TicketList from '../components/TicketList';
import { Typography, Box, CircularProgress } from '@mui/material';

const TicketListPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/tickets', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTickets(response.data);
      } catch (err) {
        setError('No se pudieron cargar los tickets.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchTickets();
    }
  }, [token]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Mis Tickets
      </Typography>
      <TicketList tickets={tickets} />
    </Box>
  );
};

export default TicketListPage;
