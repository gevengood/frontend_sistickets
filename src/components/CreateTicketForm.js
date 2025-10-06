import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
// --- IMPORTACIONES DE MATERIAL-UI ---
import { Box, TextField, Button, Typography, Paper, Alert } from '@mui/material';

const CreateTicketForm = ({ onTicketCreated }) => {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { token } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('http://localhost:5000/api/tickets', 
        { titulo, descripcion },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      setSuccess('¡Ticket creado exitosamente!');
      setTitulo('');
      setDescripcion('');
      // Limpiamos el mensaje de éxito después de 3 segundos
      setTimeout(() => setSuccess(''), 3000); 
      onTicketCreated(response.data.ticket);

    } catch (err) {
      setError('No se pudo crear el ticket.');
      console.error(err);
    }
  };

  return (
    // Paper crea un contenedor con sombra y fondo blanco
    <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Crear un Nuevo Ticket
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          label="Título"
          variant="outlined"
          fullWidth
          required
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          sx={{ mb: 2 }} // Margen inferior
        />
        <TextField
          label="Descripción del Problema"
          variant="outlined"
          fullWidth
          required
          multiline // Permite múltiples líneas
          rows={4}
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button type="submit" variant="contained" color="primary">
          Enviar Ticket
        </Button>
      </Box>
      {/* Mostramos los mensajes de error o éxito */}
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
    </Paper>
  );
};

export default CreateTicketForm;
