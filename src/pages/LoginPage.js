// src/pages/LoginPage.js
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// --- IMPORTACIONES DE MATERIAL-UI ---
import { Container, TextField, Button, Typography, Box, Alert } from '@mui/material';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });
      login(response.data.token);
      navigate('/');
    } catch (err) {
      console.error('Error en el login:', err);
      setError('Credenciales inválidas. Por favor, inténtalo de nuevo.');
    }
  };

  return (
    // Container centra el contenido horizontalmente y le da un ancho máximo
    <Container component="main" maxWidth="xs">
      {/* Box es como un div, pero con acceso directo a propiedades de estilo */}
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Typography es para todo el texto. h1, p, etc. */}
        <Typography component="h1" variant="h5">
          Iniciar Sesión
        </Typography>

        {/* El 'component="form"' hace que la Box se comporte como un formulario */}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          {/* TextField es un input de texto con muchos estilos y funcionalidades */}
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Correo Electrónico"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Contraseña"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {/* Button es un botón con estilos de Material Design */}
          <Button
            type="submit"
            fullWidth
            variant="contained" // El 'contained' le da el fondo azul
            sx={{ mt: 3, mb: 2 }}
          >
            Entrar
          </Button>

          {/* Alert es un componente para mostrar mensajes de error/éxito */}
          {error && <Alert severity="error">{error}</Alert>}
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;