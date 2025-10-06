import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';
import { AuthContext } from '../context/AuthContext';
import AddCommentForm from '../components/AddCommentForm';
import AdminTicketPanel from '../components/AdminTicketPanel';
import { Box, Typography, Paper, Grid, Chip, CircularProgress, Divider, Avatar, Button } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const TicketDetailPage = () => {
  const { id } = useParams();
  const { token, usuario } = useContext(AuthContext);
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const socketRef = useRef(null);

  // Cargar ticket (inicial)
  useEffect(() => {
    const fetchTicket = async () => {
      if (!token) return;
      try {
        const response = await axios.get(`http://localhost:5000/api/tickets/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTicket(response.data);
      } catch (err) {
        setError('No se pudo cargar el ticket o no tienes permiso para verlo.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTicket();
  }, [id, token]);

  // Conexión Socket.io (una sola vez y cuando haya token)
  useEffect(() => {
    if (!token) return;
    socketRef.current = io('http://localhost:5000', {
      auth: { token }, // si no validas token en sockets, puedes quitar auth
    });

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [token]);

  // Unirse al "room" del ticket y escuchar nuevos comentarios
  useEffect(() => {
    if (!socketRef.current || !id) return;

    const socket = socketRef.current;
    socket.emit('join_ticket', id);

    const onNewComment = (nuevo) => {
      setTicket((prev) => {
        if (!prev) return prev;
        const lista = Array.isArray(prev.comentarios) ? prev.comentarios : [];
        const existe = lista.some((c) => c.id === nuevo.id);
        if (existe) return prev;
        return { ...prev, comentarios: [...lista, nuevo] };
      });
    };

    socket.on('comment:created', onNewComment);

    return () => {
      socket.emit('leave_ticket', id);
      socket.off('comment:created', onNewComment);
    };
  }, [id]);

  // Actualización local cuando YO agrego un comentario (optimistic update)
  const handleCommentAdded = (newComment) => {
  setTicket((prev) => {
    if (!prev) return prev;
    const lista = Array.isArray(prev.comentarios) ? prev.comentarios : [];
    const yaExiste = newComment?.id != null && lista.some((c) => c.id === newComment.id);
    if (yaExiste) return prev; // no duplicar
    return { ...prev, comentarios: [...lista, newComment] };
  });
};


  // Actualización local cuando YO cambio estado/prioridad desde esta pestaña
  const handleTicketUpdated = (updatedTicket) => {
    setTicket((prevTicket) => ({ ...prevTicket, ...updatedTicket }));
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!ticket) return <p>No se encontró el ticket.</p>;

  return (
    <Box>
      <Button component={Link} to="/" sx={{ mb: 2 }}>&larr; Volver a la lista</Button>

      {usuario && usuario.rol !== 'cliente' && (
        <AdminTicketPanel ticket={ticket} onTicketUpdated={handleTicketUpdated} />
      )}

      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Ticket #{ticket.id}: {ticket.titulo}
        </Typography>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={6}>
            <Typography variant="subtitle2" color="text.secondary">Estado</Typography>
            <Chip label={ticket.estado.replace('_', ' ')} color={ticket.estado === 'abierto' ? 'success' : 'primary'} />
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle2" color="text.secondary">Prioridad</Typography>
            <Chip label={ticket.prioridad} color={ticket.prioridad === 'alta' ? 'error' : 'warning'} />
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle2" color="text.secondary">Cliente ID</Typography>
            <Typography variant="body1">{ticket.cliente_id}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle2" color="text.secondary">Agente Asignado</Typography>
            <Typography variant="body1">{ticket.agente_id || 'Sin asignar'}</Typography>
          </Grid>
        </Grid>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6">Descripción</Typography>
        <Typography variant="body1" sx={{ mt: 1 }}>{ticket.descripcion}</Typography>
      </Paper>

      <Box sx={{ mt: 3 }}>
        <Typography variant="h5" gutterBottom>Historial de Comentarios</Typography>
        {ticket.comentarios && ticket.comentarios.map((c) => (
          <Paper key={c.id} elevation={1} sx={{ p: 2, mb: 2, display: 'flex', gap: 2 }}>
            <Avatar><AccountCircleIcon /></Avatar>
            <Box>
              <Typography variant="subtitle2">
                Usuario ID {c.usuario_id}
                {c.es_privado && <Chip label="Nota Privada" color="secondary" size="small" sx={{ ml: 1 }} />}
              </Typography>
              <Typography variant="body2">{c.contenido}</Typography>
              <Typography variant="caption" color="text.secondary">
                {new Date(c.fecha_creacion).toLocaleString()}
              </Typography>
            </Box>
          </Paper>
        ))}
      </Box>

      {/* Ocultar formulario si el ticket está cerrado */}
      {ticket.estado !== 'cerrado' ? (
        <AddCommentForm ticketId={ticket.id} onCommentAdded={handleCommentAdded} />
      ) : (
        <Paper elevation={2} sx={{ p: 2, mt: 3, backgroundColor: '#f5f5f5' }}>
          <Typography variant="h6" align="center" color="text.secondary">
            Este ticket está cerrado y no admite más comentarios.
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default TicketDetailPage;
