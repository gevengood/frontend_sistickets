import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import TicketList from '../components/TicketList';
import { Typography, Box, CircularProgress, Grid, Card, CardContent } from '@mui/material';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';

// Este componente ahora recibe props: el filtro a aplicar y el título a mostrar
const FilteredTicketListPage = ({ filtro, titulo }) => {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState(null); // Las stats las mostraremos solo en la vista "todos"
  const [loading, setLoading] = useState(true);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      if (token) {
        setLoading(true);
        try {
          // Hacemos la llamada a la API añadiendo el filtro como un query param
          const ticketsResponse = await axios.get(`http://localhost:5000/api/tickets?asignacion=${filtro}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setTickets(ticketsResponse.data);

          // Solo pedimos las estadísticas para la vista general
          if (filtro === 'todos') {
            const statsResponse = await axios.get('http://localhost:5000/api/tickets/stats', {
              headers: { Authorization: `Bearer ${token}` },
            });
            setStats(statsResponse.data);
          } else {
            setStats(null); // En otras vistas, no mostramos las stats
          }

        } catch (err) {
          console.error(`Error al cargar datos con filtro ${filtro}:`, err);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [filtro, token]); // El useEffect se vuelve a ejecutar si cambia el filtro

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        {titulo} {/* Usamos el título que nos pasan como prop */}
      </Typography>

      {/* Mostramos las tarjetas de estadísticas solo si existen */}
      {stats && (
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {/* ... (Las 3 tarjetas de Grid con las stats van aquí) ... */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ backgroundColor: '#28a745', color: 'white' }}>
              <CardContent>
                <PlaylistAddCheckIcon sx={{ fontSize: 40, float: 'right', opacity: 0.5 }} />
                <Typography variant="h5">{stats.abierto || 0}</Typography>
                <Typography>Tickets Abiertos</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ backgroundColor: '#007bff', color: 'white' }}>
              <CardContent>
                <HourglassTopIcon sx={{ fontSize: 40, float: 'right', opacity: 0.5 }} />
                <Typography variant="h5">{stats.en_proceso || 0}</Typography>
                <Typography>En Proceso</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
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

      <TicketList tickets={tickets} />
    </Box>
  );
};

export default FilteredTicketListPage;