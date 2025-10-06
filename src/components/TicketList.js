import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Typography
} from '@mui/material';

// Función para obtener un color de Chip según el estado del ticket
const getStatusChipColor = (status) => {
  switch (status) {
    case 'abierto':
      return 'success'; // Verde
    case 'en_proceso':
      return 'primary'; // Azul
    case 'cerrado':
      return 'default'; // Gris
    default:
      return 'default';
  }
};

const TicketList = ({ tickets }) => {
  const navigate = useNavigate();

  // Si no hay tickets, muestra un mensaje amigable
  if (tickets.length === 0) {
    return <Typography variant="body1" sx={{ mt: 2 }}>No hay tickets para mostrar.</Typography>;
  }

  // Función que se ejecuta al hacer clic en una fila
  const handleRowClick = (id) => {
    navigate(`/tickets/${id}`);
  };

  return (
    // TableContainer y Paper le dan el estilo de contenedor a la tabla
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table aria-label="lista de tickets">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Título</TableCell>
            
            {/* Lógica condicional: La columna "Cliente" solo se muestra si los datos del ticket
                incluyen el nombre del cliente (lo cual solo pasa para los agentes) */}
            {tickets[0]?.cliente_nombre && <TableCell sx={{ fontWeight: 'bold' }}>Cliente</TableCell>}
            
            <TableCell sx={{ fontWeight: 'bold' }}>Estado</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Prioridad</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Fecha de Creación</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tickets.map((ticket) => (
            <TableRow
              key={ticket.id}
              onClick={() => handleRowClick(ticket.id)}
              hover // Efecto visual al pasar el mouse
              sx={{ cursor: 'pointer' }}
            >
              <TableCell>{ticket.id}</TableCell>
              <TableCell>{ticket.titulo}</TableCell>
              
              {/* Celda condicional para el nombre del cliente */}
              {ticket.cliente_nombre && <TableCell>{ticket.cliente_nombre}</TableCell>}

              <TableCell>
                {/* Chip es ideal para mostrar estados o etiquetas */}
                <Chip 
                  label={ticket.estado.replace('_', ' ')} 
                  color={getStatusChipColor(ticket.estado)} 
                  size="small" 
                />
              </TableCell>
              <TableCell sx={{ textTransform: 'capitalize' }}>{ticket.prioridad}</TableCell>
              <TableCell>{new Date(ticket.fecha_creacion).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TicketList;