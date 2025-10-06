import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AgentTicketList from './AgentTicketList';
import FilteredTicketListPage from './FilteredTicketListPage';
import TicketDetailPage from './TicketDetailPage';

const AgentDashboard = () => {
  return (
    <Routes>
      {/* La ruta principal ahora muestra el dashboard completo con estadísticas */}
      <Route path="/" element={<AgentTicketList />} />

      {/* Las rutas de la sidebar ahora usan el componente de listas filtradas */}
      <Route path="/asignados" element={<FilteredTicketListPage filtro="propios" titulo="Mis Tickets Asignados" />} />
      <Route path="/no-asignados" element={<FilteredTicketListPage filtro="no_asignados" titulo="Tickets sin Asignar" />} />
      <Route path="/todos" element={<FilteredTicketListPage filtro="todos" titulo="Todos los Tickets" />} />

      {/* La ruta de detalle sigue funcionando igual */}
      <Route path="/tickets/:id" element={<TicketDetailPage />} />
    </Routes>
  );
};

export default AgentDashboard;