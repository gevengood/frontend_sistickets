import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Box, Button, FormControl, InputLabel, Select, MenuItem, Paper, Typography, CircularProgress } from '@mui/material';

const AdminTicketPanel = ({ ticket, onTicketUpdated }) => {
  // Estados existentes
  const [estado, setEstado] = useState(ticket.estado);
  const [prioridad, setPrioridad] = useState(ticket.prioridad);
  
  // --- ADICIONES ---
  const [agenteId, setAgenteId] = useState(ticket.agente_id || '');
  const [agentes, setAgentes] = useState([]);
  const [cargandoAgentes, setCargandoAgentes] = useState(true);
  const { token, usuario } = useContext(AuthContext); // Sacamos el rol del usuario

  // --- ADICIÓN: EFECTO PARA CARGAR LA LISTA DE AGENTES ---
  useEffect(() => {
    const fetchAgentes = async () => {
      // Solo buscamos la lista si el usuario es un admin
      if (token && usuario?.rol === 'admin') {
        try {
          const response = await axios.get('http://localhost:5000/api/admin/agentes', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setAgentes(response.data);
        } catch (error) {
          console.error("No se pudo cargar la lista de agentes", error);
        } finally {
          setCargandoAgentes(false);
        }
      } else {
        setCargandoAgentes(false);
      }
    };
    fetchAgentes();
  }, [token, usuario]);

  const handleUpdate = async () => {
    try {
      // --- ADICIÓN: AÑADIMOS EL agente_id A LA PETICIÓN ---
      const payload = { estado, prioridad, agente_id: agenteId || null };

      const response = await axios.put(
        `http://localhost:5000/api/tickets/${ticket.id}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      onTicketUpdated(response.data.ticket);
      alert('Ticket actualizado exitosamente');

    } catch (err) {
      alert('Error al actualizar el ticket');
      console.error(err);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
      <Typography variant="h6" gutterBottom>Panel de Administración</Typography>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
        {/* FormControl de Estado (sin cambios) */}
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Estado</InputLabel>
          <Select value={estado} label="Estado" onChange={(e) => setEstado(e.target.value)}>
            <MenuItem value="abierto">Abierto</MenuItem>
            <MenuItem value="en_proceso">En Proceso</MenuItem>
            <MenuItem value="cerrado">Cerrado</MenuItem>
          </Select>
        </FormControl>

        {/* FormControl de Prioridad (sin cambios) */}
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Prioridad</InputLabel>
          <Select value={prioridad} label="Prioridad" onChange={(e) => setPrioridad(e.target.value)}>
            <MenuItem value="baja">Baja</MenuItem>
            <MenuItem value="media">Media</MenuItem>
            <MenuItem value="alta">Alta</MenuItem>
          </Select>
        </FormControl>

        {/* --- ADICIÓN: EL NUEVO MENÚ DESPLEGABLE (SOLO PARA ADMINS) --- */}
        {usuario?.rol === 'admin' && (
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Asignar a Agente</InputLabel>
            {cargandoAgentes ? <CircularProgress size={20} sx={{ m: 1 }} /> : (
              <Select value={agenteId} label="Asignar a Agente" onChange={(e) => setAgenteId(e.target.value)}>
                <MenuItem value="">
                  <em>Sin Asignar</em>
                </MenuItem>
                {agentes.map((agente) => (
                  <MenuItem key={agente.id} value={agente.id}>
                    {agente.nombre} ({agente.rol.replace('_', ' ')})
                  </MenuItem>
                ))}
              </Select>
            )}
          </FormControl>
        )}
        
        <Button onClick={handleUpdate} variant="contained">Guardar Cambios</Button>
      </Box>
    </Paper>
  );
};

export default AdminTicketPanel;