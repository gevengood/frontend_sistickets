import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import TicketList from '../components/TicketList';
import { Typography, Box, CircularProgress, Grid, Card, CardContent } from '@mui/material';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';

const AgentTicketList = () => {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      if (token) {
        try {
          const [ticketsResponse, statsResponse] = await Promise.all([
            axios.get('http://localhost:5000/api/tickets?asignacion=todos', {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get('http://localhost:5000/api/tickets/stats', {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]);
          setTickets(ticketsResponse.data);
          setStats(statsResponse.data);
        } catch (err) {
          console.error("Error al cargar los datos del dashboard:", err);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [token]);

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>

      {stats && (
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ backgroundColor: '#28a745', color: 'white' }}>
              <CardContent>
                <PlaylistAddCheckIcon sx={{ fontSize: 40, float: 'right', opacity: 0.5 }} />
                <Typography variant="h5">{stats.abierto || 0}</Typography>
                <Typography>Tickets Abiertos</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ backgroundColor: '#007bff', color: 'white' }}>
              <CardContent>
                <HourglassTopIcon sx={{ fontSize: 40, float: 'right', opacity: 0.5 }} />
                <Typography variant="h5">{stats.en_proceso || 0}</Typography>
                <Typography>En Proceso</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ backgroundColor: '#6c757d', color: 'white' }}>
              <CardContent>
                <CheckCircleOutlineIcon sx={{ fontSize: 40, float: 'right', opacity: 0.5 }} />
                <Typography variant="h5">{stats.cerrado || 0}</Typography>
                <Typography>Cerrados</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      <Typography variant="h5" component="h2" gutterBottom>
        Todos los Tickets
      </Typography>
      <TicketList tickets={tickets} />
    </Box>
  );
};

export default AgentTicketList;