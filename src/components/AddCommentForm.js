import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';

const AddCommentForm = ({ ticketId, onCommentAdded }) => {
  const [contenido, setContenido] = useState('');
  const [error, setError] = useState('');
  const { token } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post(
        `http://localhost:5000/api/tickets/${ticketId}/comentarios`,
        { contenido },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // ¡ESTA ES LA LÍNEA CLAVE!
      // Llama a la función que nos pasó el componente padre (TicketDetailPage)
      // para entregarle el nuevo comentario y que la lista se actualice.
      onCommentAdded(response.data.comentario);
      
      setContenido(''); // Limpia el campo de texto después de enviar

    } catch (err) {
      setError('No se pudo agregar el comentario.');
      console.error(err);
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 2, mt: 3 }}>
        <Typography variant="h6" gutterBottom>Agregar un Comentario</Typography>
        <Box component="form" onSubmit={handleSubmit}>
            <TextField
                label="Escribe tu comentario..."
                fullWidth
                multiline
                rows={4}
                value={contenido}
                onChange={(e) => setContenido(e.target.value)}
                required
                sx={{ mb: 2 }}
            />
            <Button type="submit" variant="contained">Enviar Comentario</Button>
        </Box>
        {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}
    </Paper>
  );
};

export default AddCommentForm;
