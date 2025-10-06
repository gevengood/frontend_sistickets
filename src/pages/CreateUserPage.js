import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Paper, 
  Alert, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  Stack // <-- Agregar Stack para botones
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download'; // <-- Ícono de descarga

const CreateUserPage = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [rol, setRol] = useState('cliente');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userData, setUserData] = useState(null); // <-- Guardar datos del usuario creado
  const { token } = useContext(AuthContext);

  // Función para descargar los datos como TXT
  const downloadUserData = () => {
    if (!userData) return;

    const content = `
Tacos de Birria Solutions - Credenciales de Usuario
=================================================

Nombre: ${userData.nombre}
Email: ${userData.email}
Rol: ${userData.rol}
Contraseña Temporal: ${userData.passwordTemporal}

=================================================
Fecha de creación: ${new Date().toLocaleDateString()}
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `credenciales_${userData.nombre.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setUserData(null);

    try {
      const response = await axios.post(
        'http://localhost:5000/api/admin/usuarios',
        { nombre, email, rol },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Guardar datos del usuario para posible descarga
      const userData = {
        nombre,
        email,
        rol,
        passwordTemporal: response.data.passwordTemporal
      };
      
      setUserData(userData);
      setSuccess(`¡Usuario creado! La contraseña temporal es: ${response.data.passwordTemporal}`);
      setNombre('');
      setEmail('');
      setRol('cliente');

    } catch (err) {
      const errorMessage = err.response?.data?.error || 'No se pudo crear el usuario.';
      setError(errorMessage);
      console.error(err);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Crear Nuevo Usuario
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          label="Nombre Completo"
          variant="outlined"
          fullWidth
          required
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Correo Electrónico"
          type="email"
          variant="outlined"
          fullWidth
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mb: 2 }}
        />
        <FormControl fullWidth required sx={{ mb: 2 }}>
          <InputLabel>Rol</InputLabel>
          <Select
            value={rol}
            label="Rol"
            onChange={(e) => setRol(e.target.value)}
          >
            <MenuItem value="cliente">Cliente</MenuItem>
            <MenuItem value="agente_n1">Agente Nivel 1</MenuItem>
            <MenuItem value="agente_n2">Agente Nivel 2</MenuItem>
            <MenuItem value="admin">Administrador</MenuItem>
          </Select>
        </FormControl>
        
        <Stack direction="row" spacing={2}>
          <Button type="submit" variant="contained" color="primary">
            Crear Usuario
          </Button>
          
          {/* Botón de descarga (solo visible cuando hay datos) */}
          {userData && (
            <Button 
              variant="outlined" 
              color="success"
              startIcon={<DownloadIcon />}
              onClick={downloadUserData}
            >
              Descargar Credenciales
            </Button>
          )}
        </Stack>
      </Box>
      
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      {success && (
        <Alert severity="success" sx={{ mt: 2 }}>
          {success}
          {userData && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="body2">
                <strong>Nombre:</strong> {userData.nombre}
              </Typography>
              <Typography variant="body2">
                <strong>Email:</strong> {userData.email}
              </Typography>
              <Typography variant="body2">
                <strong>Rol:</strong> {userData.rol}
              </Typography>
            </Box>
          )}
        </Alert>
      )}
    </Paper>
  );
};

export default CreateUserPage;