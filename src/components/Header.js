import React, { useContext } from 'react';
import { AppBar, Toolbar, IconButton, Button, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { AuthContext } from '../context/AuthContext';
import Logo from './Logo';

const Header = ({ handleDrawerToggle }) => {
  const { usuario, logout } = useContext(AuthContext);

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        {/* El botón de hamburguesa solo aparece si el usuario está logueado */}
        {usuario && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}
        <Logo />
        <Box sx={{ flexGrow: 1 }} />
        {usuario && (
          <Button color="inherit" onClick={logout}>
            Cerrar Sesión
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;