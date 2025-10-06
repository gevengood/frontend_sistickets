import React, { useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Avatar, Typography, Box, Divider } from '@mui/material';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import AllInboxIcon from '@mui/icons-material/AllInbox';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People'; // Ícono para "Gestionar Usuarios"
import PersonAddIcon from '@mui/icons-material/PersonAdd';   // Ícono para "Crear Usuario"

const drawerWidth = 240;

const Sidebar = ({ mobileOpen, handleDrawerToggle }) => {
  const { usuario } = useContext(AuthContext);

  const clientLinks = (
    <>
      <ListItem disablePadding>
        <ListItemButton component={RouterLink} to="/">
          <ListItemIcon><ConfirmationNumberIcon /></ListItemIcon>
          <ListItemText primary="Mis Tickets" />
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding>
        <ListItemButton component={RouterLink} to="/crear-ticket">
          <ListItemIcon><AddCircleOutlineIcon /></ListItemIcon>
          <ListItemText primary="Crear Ticket" />
        </ListItemButton>
      </ListItem>
    </>
  );

  const agentLinks = (
    <>
      <ListItem disablePadding>
        <ListItemButton component={RouterLink} to="/">
          <ListItemIcon><DashboardIcon /></ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding>
        <ListItemButton component={RouterLink} to="/asignados">
          <ListItemIcon><AssignmentIndIcon /></ListItemIcon>
          <ListItemText primary="Mis Tickets Asignados" />
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding>
        <ListItemButton component={RouterLink} to="/no-asignados">
          <ListItemIcon><HelpOutlineIcon /></ListItemIcon>
          <ListItemText primary="Tickets sin Asignar" />
        </ListItemButton>
      </ListItem>
      
      {/* Opciones adicionales solo para ADMIN */}
      {usuario?.rol === 'admin' && (
        <>
          <Divider />
          <ListItem disablePadding>
            <ListItemButton component={RouterLink} to="/admin/usuarios">
              <ListItemIcon><PeopleIcon /></ListItemIcon>
              <ListItemText primary="Gestionar Usuarios" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={RouterLink} to="/admin/crear-usuario">
              <ListItemIcon><PersonAddIcon /></ListItemIcon>
              <ListItemText primary="Crear Usuario" />
            </ListItemButton>
          </ListItem>
        </>
      )}
    </>
  );

  const drawerContent = (
    <div>
      <Toolbar />
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Avatar sx={{ width: 64, height: 64, mb: 1, mx: 'auto' }} />
        <Typography variant="h6">{usuario?.nombre}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
          {usuario?.rol.replace('_', ' ')}
        </Typography>
      </Box>
      <Divider />
      <List>
        {usuario?.rol === 'cliente' ? clientLinks : agentLinks}
      </List>
    </div>
  );

  return (
    <Drawer
      variant="persistent"
      open={mobileOpen}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default Sidebar;