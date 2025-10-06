import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

const UserListPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('todos');
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editForm, setEditForm] = useState({});
  const { token } = useContext(AuthContext);

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get('http://localhost:5000/api/admin/usuarios', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
    } catch (err) {
      setError('Error al cargar los usuarios');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Editar usuario
  const handleEditClick = (user) => {
    setSelectedUser(user);
    setEditForm({
      nombre: user.nombre,
      email: user.email,
      rol: user.rol
    });
    setEditDialog(true);
  };

  const handleEditSave = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/admin/usuarios/${selectedUser.id}`,
        editForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setSuccess('Usuario actualizado exitosamente');
      setEditDialog(false);
      fetchUsers();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al actualizar usuario');
    }
  };

  // Eliminar usuario
  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(
        `http://localhost:5000/api/admin/usuarios/${selectedUser.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setSuccess('Usuario eliminado exitosamente');
      setDeleteDialog(false);
      fetchUsers();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al eliminar usuario');
    }
  };

  // Filtros
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'todos' || user.rol === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
      <CircularProgress />
    </Box>
  );

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Gestión de Usuarios
      </Typography>

      {/* Mensajes de éxito/error */}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      {/* Filtros */}
      <Stack direction="row" spacing={2} sx={{ mb: 3 }} alignItems="center">
        <TextField
          label="Buscar usuario"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ minWidth: 200 }}
        />
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Filtrar por rol</InputLabel>
          <Select
            value={roleFilter}
            label="Filtrar por rol"
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <MenuItem value="todos">Todos</MenuItem>
            <MenuItem value="cliente">Cliente</MenuItem>
            <MenuItem value="agente_n1">Agente N1</MenuItem>
            <MenuItem value="agente_n2">Agente N2</MenuItem>
            <MenuItem value="admin">Administrador</MenuItem>
          </Select>
        </FormControl>
        <IconButton onClick={fetchUsers} color="primary">
          <RefreshIcon />
        </IconButton>
      </Stack>

      {/* Tabla de usuarios */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Rol</TableCell>
              <TableCell>Estado Password</TableCell>
              <TableCell>Fecha Creación</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  {users.length === 0 ? 'No hay usuarios registrados' : 'No se encontraron resultados'}
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.nombre}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip 
                        label={user.rol} 
                        color={
                          user.rol === 'admin' ? 'error' : 
                          user.rol.includes('agente') ? 'warning' : 'primary'
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={user.forzar_cambio_password ? 'Cambio Requerido' : 'Clave OK'} 
                        color={user.forzar_cambio_password ? 'warning' : 'success'}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(user.fecha_creacion).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <IconButton 
                        color="primary" 
                        onClick={() => handleEditClick(user)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        color="error" 
                        onClick={() => handleDeleteClick(user)}
                        disabled={user.rol === 'admin'}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {filteredUsers.length > 0 && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}

      {/* Dialog de edición */}
      <Dialog open={editDialog} onClose={() => setEditDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Editar Usuario</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Nombre"
              value={editForm.nombre}
              onChange={(e) => setEditForm({...editForm, nombre: e.target.value})}
              fullWidth
            />
            <TextField
              label="Email"
              type="email"
              value={editForm.email}
              onChange={(e) => setEditForm({...editForm, email: e.target.value})}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Rol</InputLabel>
              <Select
                value={editForm.rol}
                label="Rol"
                onChange={(e) => setEditForm({...editForm, rol: e.target.value})}
              >
                <MenuItem value="cliente">Cliente</MenuItem>
                <MenuItem value="agente_n1">Agente N1</MenuItem>
                <MenuItem value="agente_n2">Agente N2</MenuItem>
                <MenuItem value="admin">Administrador</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog(false)} startIcon={<CancelIcon />}>
            Cancelar
          </Button>
          <Button onClick={handleEditSave} variant="contained" startIcon={<SaveIcon />}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de eliminación */}
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          ¿Estás seguro de que quieres eliminar al usuario {selectedUser?.nombre}?
          {selectedUser?.rol === 'admin' && (
            <Alert severity="warning" sx={{ mt: 1 }}>
              ¡Cuidado! Estás intentando eliminar un usuario administrador.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>Cancelar</Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default UserListPage;