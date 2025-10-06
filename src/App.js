import React, { useState, useContext } from 'react'; // <-- AGREGAR useState
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthContext, AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import LoginPage from './pages/LoginPage';
import ClientDashboard from './pages/ClientDashboard';
import AgentDashboard from './pages/AgentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import TicketDetailPage from './pages/TicketDetailPage';
import AgentTicketList from './pages/AgentTicketList';
import FilteredTicketListPage from './pages/FilteredTicketListPage';
import CreateTicketPage from './pages/CreateTicketPage';
import TicketListPage from './pages/TicketListPage';
import PasswordModal from './components/JSPasswordModal';
import UserListPage from './pages/UserListPage'; // <-- AGREGAR ESTA IMPORTACIÓN
import CreateUserPage from './pages/CreateUserPage'; // <-- AGREGAR ESTA IMPORTACIÓN

import { CssBaseline, Box, Toolbar, CircularProgress } from '@mui/material';

const drawerWidth = 240;

// Componente Layout para usuarios autenticados
const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true); // <-- Ahora useState está definido
  const handleDrawerToggle = () => setSidebarOpen(!sidebarOpen);

  return (
    <Box sx={{ display: 'flex' }}>
      <Header handleDrawerToggle={handleDrawerToggle} />
      <Sidebar mobileOpen={sidebarOpen} drawerWidth={drawerWidth} />
      <Box
        component="main"
        sx={{
          flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` },
          transition: (theme) => theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
          }),
          marginLeft: `-${drawerWidth}px`,
          ...(sidebarOpen && { marginLeft: 0 }),
        }}
      >
        <Toolbar />
        <Outlet /> 
      </Box>
    </Box>
  );
};

// Componente Guardia
const ProtectedRoutes = () => {
  const { usuario, cargandoAuth } = useContext(AuthContext);

  if (cargandoAuth) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress /></Box>;
  }

  return usuario ? <DashboardLayout /> : <Navigate to="/login" replace />;
};

// Rutas específicas para el cliente
const ClientRoutes = () => (
  <Routes>
    <Route path="/" element={<TicketListPage />} />
    <Route path="/crear-ticket" element={<CreateTicketPage />} />
    <Route path="/tickets/:id" element={<TicketDetailPage />} />
  </Routes>
);

// Rutas específicas para el agente
const AgentRoutes = () => (
  <Routes>
    <Route path="/" element={<AgentTicketList />} />
    <Route path="/todos" element={<FilteredTicketListPage filtro="todos" titulo="Todos los Tickets" />} />
    <Route path="/asignados" element={<FilteredTicketListPage filtro="propios" titulo="Mis Tickets Asignados" />} />
    <Route path="/no-asignados" element={<FilteredTicketListPage filtro="no_asignados" titulo="Tickets sin Asignar" />} />
    <Route path="/tickets/:id" element={<TicketDetailPage />} />
  </Routes>
);

// Rutas específicas para el admin
const AdminRoutes = () => (
  <Routes>
    <Route path="/" element={<AgentTicketList />} />
    <Route path="/todos" element={<FilteredTicketListPage filtro="todos" titulo="Todos los Tickets" />} />
    <Route path="/asignados" element={<FilteredTicketListPage filtro="propios" titulo="Mis Tickets Asignados" />} />
    <Route path="/no-asignados" element={<FilteredTicketListPage filtro="no_asignados" titulo="Tickets sin Asignar" />} />
    <Route path="/tickets/:id" element={<TicketDetailPage />} />
    <Route path="/admin/usuarios" element={<UserListPage />} /> {/* <-- Ahora UserListPage está definido */}
    <Route path="/admin/crear-usuario" element={<CreateUserPage />} /> {/* <-- Ahora CreateUserPage está definido */}
  </Routes>
);

// COMPONENTE PRINCIPAL DE LA APP
function AppContent() {
  const { usuario } = useContext(AuthContext);

  return (
    <>
      <Router>
        <CssBaseline />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoutes />}>
            <Route path="/*" element={
              <AuthContext.Consumer>
                {({ usuario }) => {
                  if (usuario?.rol === 'cliente') {
                    return <ClientRoutes />;
                  } else if (usuario?.rol === 'admin') {
                    return <AdminRoutes />;
                  } else {
                    return <AgentRoutes />;
                  }
                }}
              </AuthContext.Consumer>
            } />
          </Route>
        </Routes>
      </Router>

      {/* MODAL OBLIGATORIO DE CAMBIO DE CONTRASEÑA */}
      {usuario && usuario.forzar_cambio_password && (
        <PasswordModal 
          open={true}
          onClose={() => {}} // Modal obligatorio, no se puede cerrar
        />
      )}
    </>
  );
}

// WRAPPER PRINCIPAL
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;