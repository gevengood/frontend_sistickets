import React, { useContext } from 'react';
    import { Navigate, Outlet } from 'react-router-dom';
    import { AuthContext } from '../context/AuthContext';
    import ClientLayout from './ClientLayout'; // Importamos el layout con la sidebar

    const ProtectedRoute = ({ allowedRoles }) => {
      const { usuario } = useContext(AuthContext);

      // 1. Si no hay usuario, redirigir al login
      if (!usuario) {
        return <Navigate to="/login" replace />;
      }

      // 2. Si la ruta requiere roles específicos y el usuario no tiene uno de ellos, no lo dejamos pasar
      // (Por ahora no lo usamos, pero es bueno tenerlo para el futuro)
      if (allowedRoles && !allowedRoles.includes(usuario.rol)) {
        return <p>No tienes permiso para ver esta página.</p>;
      }

      // 3. Si es un cliente, lo envolvemos en el layout con la barra lateral
      if (usuario.rol === 'cliente') {
        return (
          <ClientLayout>
            <Outlet /> {/* <Outlet /> renderizará el componente hijo de la ruta (ej: TicketListPage) */}
          </ClientLayout>
        );
      }
      
      // (Aquí podríamos añadir un layout para el agente más adelante)
      // Por ahora, el agente también ve el contenido directamente
      return <Outlet />;
    };

    export default ProtectedRoute;
    
