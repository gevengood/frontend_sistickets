import React from 'react';
import { useNavigate } from 'react-router-dom';
import CreateTicketForm from '../components/CreateTicketForm';
import { Typography, Box } from '@mui/material';

const CreateTicketPage = () => {
  const navigate = useNavigate();

  // Esta función se ejecutará cuando el ticket se cree exitosamente
  const handleTicketCreated = (newTicket) => {
    // Redirigimos al usuario a la página de la lista de tickets
    navigate('/');
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Crear Nuevo Ticket
      </Typography>
      <CreateTicketForm onTicketCreated={handleTicketCreated} />
    </Box>
  );
};

export default CreateTicketPage;
