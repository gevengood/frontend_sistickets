// components/JSPasswordModal.js
import React, { useState, useContext } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
  Box,
  Typography
} from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const PasswordModal = ({ open, onClose }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { usuario, token, actualizarUsuario } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      return setError('Las contraseñas no coinciden');
    }

    if (newPassword.length < 8) {
      return setError('La contraseña debe tener al menos 8 caracteres');
    }

    setLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/cambiar-password',
        {
          currentPassword,
          newPassword
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // Actualizar el contexto para que no vuelva a aparecer el modal
      actualizarUsuario({ ...usuario, forzar_cambio_password: false });
      onClose();

    } catch (err) {
      setError(err.response?.data?.error || 'Error al cambiar contraseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={(event, reason) => {
        // No permitir cerrar haciendo click fuera o con ESC
        if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
          onClose();
        }
      }}
      disableEscapeKeyDown
    >
      <DialogTitle>
        <Typography variant="h5" component="div">
          🔒 Cambio de Contraseña Requerido
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Por seguridad, debes cambiar tu contraseña temporal antes de continuar.
          </Alert>

          <TextField
            label="Contraseña Actual (Temporal)"
            type="password"
            fullWidth
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            sx={{ mb: 2 }}
          />

          <TextField
            label="Nueva Contraseña"
            type="password"
            fullWidth
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            sx={{ mb: 2 }}
            helperText="Mínimo 8 caracteres"
          />

          <TextField
            label="Confirmar Nueva Contraseña"
            type="password"
            fullWidth
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          disabled={loading}
        >
          {loading ? 'Cambiando...' : 'Cambiar Contraseña'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PasswordModal;